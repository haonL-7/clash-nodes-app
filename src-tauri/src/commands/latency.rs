use crate::models::ProxyNode;
use std::collections::HashMap;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tauri::AppHandle;
use tauri::Emitter;
use tokio::net::TcpStream as TokioTcpStream;
use tokio::time::timeout;

const CONNECT_TIMEOUT: Duration = Duration::from_secs(3);
const MAX_CONCURRENT: usize = 20;

/// Test TCP latency for a single server:port pair.
async fn test_single_latency(server: &str, port: u16) -> Option<u64> {
    let addr = format!("{}:{}", server, port);
    let start = Instant::now();

    match timeout(CONNECT_TIMEOUT, TokioTcpStream::connect(&addr)).await {
        Ok(Ok(_stream)) => {
            let rtt = start.elapsed().as_millis() as u64;
            // Drop the stream immediately (we don't need to keep the connection)
            drop(_stream);
            Some(rtt)
        }
        _ => None, // Timeout or connection refused
    }
}

/// Run latency tests on selected nodes.
/// node_names: list of node names to test.
/// Emits progress events: `latency-progress` with {name, latency_ms}
/// Returns final results as HashMap<String, Option<u64>>
#[tauri::command]
pub async fn test_node_latency(
    app: AppHandle,
    node_names: Vec<String>,
) -> Result<HashMap<String, Option<u64>>, String> {
    // Get full proxy details from cache
    let all_proxies: Vec<ProxyNode> = {
        let state = app.state::<crate::NodeCache>();
        state.nodes.lock().unwrap().clone()
    };

    if all_proxies.is_empty() {
        return Err("No cached node data available. Please refresh data first.".to_string());
    }

    // Build lookup: name -> ProxyNode
    let node_map: HashMap<String, ProxyNode> = all_proxies
        .into_iter()
        .map(|p| (p.name.clone(), p))
        .collect();

    // Filter to requested nodes
    let targets: Vec<(&String, &ProxyNode)> = if node_names.is_empty() {
        node_map.iter().collect()
    } else {
        node_names
            .iter()
            .filter_map(|name| node_map.get(name).map(|p| (name, p)))
            .collect()
    };

    let semaphore = Arc::new(tokio::sync::Semaphore::new(MAX_CONCURRENT));
    let mut results: HashMap<String, Option<u64>> = HashMap::new();
    let mut handles = Vec::new();

    for (name, node) in targets {
        let permit = semaphore.clone().acquire_owned().await.unwrap();
        let server = node.server.clone();
        let port = node.port;
        let name = name.clone();
        let app_clone = app.clone();

        handles.push(tokio::spawn(async move {
            let latency = test_single_latency(&server, port).await;
            drop(permit);

            // Emit progress event
            let payload = serde_json::json!({
                "name": name,
                "latency_ms": latency,
            });
            let _ = app_clone.emit("latency-progress", payload);

            (name, latency)
        }));
    }

    for handle in handles {
        match handle.await {
            Ok((name, latency)) => {
                results.insert(name, latency);
            }
            Err(e) => {
                eprintln!("Latency task panicked: {}", e);
            }
        }
    }

    Ok(results)
}
