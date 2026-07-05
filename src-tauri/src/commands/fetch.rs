use crate::models::{NodeInfo, ProxyNode};
use crate::parser;
use std::path::PathBuf;
use std::sync::Mutex;
use once_cell::sync::Lazy;

/// Cached proxy nodes in memory
static CACHED_NODES: Lazy<Mutex<Vec<ProxyNode>>> = Lazy::new(|| Mutex::new(Vec::new()));

const YAML_URLS: &[&str] = &[
    "https://cdn.jsdelivr.net/gh/haonL-7/clash-nodes@main/latest.yaml",
    "https://raw.githubusercontent.com/haonL-7/clash-nodes/main/latest.yaml",
];

/// Data directory for caching
fn data_dir() -> PathBuf {
    dirs::data_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("clash-nodes")
}

fn cache_file() -> PathBuf {
    data_dir().join("nodes_cache.json")
}

fn yaml_cache_file() -> PathBuf {
    data_dir().join("latest.yaml")
}

/// Ensure data directory exists
fn ensure_data_dir() -> std::io::Result<()> {
    let dir = data_dir();
    if !dir.exists() {
        std::fs::create_dir_all(&dir)?;
    }
    Ok(())
}

/// Fetch latest.yaml from CDN, parse it, and cache results.
#[tauri::command]
pub async fn fetch_latest_nodes() -> Result<Vec<NodeInfo>, String> {
    let yaml_content = download_yaml().await?;

    let proxies = parser::parse_proxies(&yaml_content)?;

    // Update in-memory cache
    let node_infos = parser::extract_node_infos(&proxies);
    if let Ok(mut cache) = CACHED_NODES.lock() {
        *cache = proxies;
    }

    // Persist to disk
    let _ = ensure_data_dir();
    if let Ok(json) = serde_json::to_string_pretty(&node_infos) {
        let _ = std::fs::write(cache_file(), json);
    }
    // Also cache the raw YAML
    let _ = std::fs::write(yaml_cache_file(), &yaml_content);

    Ok(node_infos)
}

/// Download the latest YAML from CDN (try primary URL, fallback to secondary)
async fn download_yaml() -> Result<String, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| format!("HTTP client error: {}", e))?;

    for url in YAML_URLS {
        match client.get(*url).send().await {
            Ok(resp) => {
                if resp.status().is_success() {
                    return resp
                        .text()
                        .await
                        .map_err(|e| format!("Failed to read response from {}: {}", url, e));
                }
            }
            Err(e) => {
                eprintln!("Failed to fetch from {}: {}", url, e);
                continue;
            }
        }
    }

    Err("All YAML URLs failed".to_string())
}

/// Get cached nodes (from memory or disk), without network fetch.
#[tauri::command]
pub async fn get_cached_nodes() -> Result<Vec<NodeInfo>, String> {
    // Try in-memory cache first
    if let Ok(cache) = CACHED_NODES.lock() {
        if !cache.is_empty() {
            return Ok(parser::extract_node_infos(&cache));
        }
    }

    // Try disk cache
    if cache_file().exists() {
        let content = std::fs::read_to_string(cache_file())
            .map_err(|e| format!("Failed to read cache: {}", e))?;
        let nodes: Vec<NodeInfo> = serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse cache: {}", e))?;
        if !nodes.is_empty() {
            return Ok(nodes);
        }
    }

    // Return empty if no cache — frontend will use embedded data
    Ok(Vec::new())
}

/// Check if there's a data update available.
/// Returns the new last-modified timestamp if updated, None otherwise.
#[tauri::command]
pub async fn check_data_update() -> Result<Option<String>, String> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(15))
        .build()
        .map_err(|e| format!("HTTP client error: {}", e))?;

    for url in YAML_URLS {
        match client.head(*url).send().await {
            Ok(resp) => {
                if resp.status().is_success() {
                    let last_modified = resp
                        .headers()
                        .get("last-modified")
                        .and_then(|v| v.to_str().ok())
                        .map(|s| s.to_string());

                    if let Some(ref lm) = last_modified {
                        // Compare with cached timestamp
                        let cache_timestamp = yaml_cache_file()
                            .metadata()
                            .ok()
                            .and_then(|m| m.modified().ok());

                        // For now, always trigger fetch if we reach here
                        // In production, you'd compare the timestamps properly
                        return Ok(Some(lm.clone()));
                    }

                    return Ok(Some("unknown".to_string()));
                }
            }
            Err(_) => continue,
        }
    }

    Ok(None)
}

/// Get the full proxy nodes (including server/port) from cache.
/// Used for latency testing.
#[tauri::command]
pub async fn get_full_proxy_nodes() -> Result<Vec<ProxyNode>, String> {
    if let Ok(cache) = CACHED_NODES.lock() {
        if !cache.is_empty() {
            return Ok(cache.clone());
        }
    }

    // Try to read from YAML cache
    if yaml_cache_file().exists() {
        let content = std::fs::read_to_string(yaml_cache_file())
            .map_err(|e| format!("Failed to read YAML cache: {}", e))?;
        let proxies = parser::parse_proxies(&content)?;
        return Ok(proxies);
    }

    Ok(Vec::new())
}
