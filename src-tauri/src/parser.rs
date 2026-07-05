use crate::models::{NodeInfo, ProxyNode};

/// Parse the `latest.yaml` Clash config and extract proxy node entries.
/// Returns full ProxyNode details (name, server, port, type, region).
pub fn parse_proxies(yaml_content: &str) -> Result<Vec<ProxyNode>, String> {
    let doc: serde_yaml::Value = serde_yaml::from_str(yaml_content)
        .map_err(|e| format!("YAML parse error: {}", e))?;

    let proxies = doc["proxies"]
        .as_sequence()
        .ok_or_else(|| "No 'proxies' key found in YAML".to_string())?;

    let nodes: Vec<ProxyNode> = proxies
        .iter()
        .filter_map(|p| {
            let name = p["name"].as_str().unwrap_or("unknown").to_string();
            let server = p["server"].as_str().unwrap_or("").to_string();
            let port = p["port"].as_u64().unwrap_or(443) as u16;
            let proxy_type = p["type"].as_str().unwrap_or("unknown").to_string();
            let region = classify_region(&name);

            Some(ProxyNode {
                name,
                server,
                port,
                proxy_type,
                region,
                latency_ms: None,
            })
        })
        .collect();

    Ok(nodes)
}

/// Extract simplified NodeInfo list (for frontend compatibility)
pub fn extract_node_infos(proxies: &[ProxyNode]) -> Vec<NodeInfo> {
    proxies
        .iter()
        .map(|p| NodeInfo {
            name: p.name.clone(),
            region: p.region.clone(),
        })
        .collect()
}

/// Classify a node name into a region code.
/// Uses the same logic as the original build_html.py.
pub fn classify_region(name: &str) -> String {
    let lower = name.to_lowercase();

    // Japan
    if lower.contains("日本") || lower.contains("jp") || lower.contains("japan")
        || lower.contains("tokyo") || lower.contains("osaka") || lower.contains("東京")
        || lower.contains("大阪")
    {
        return "jp".into();
    }

    // US
    if lower.contains("美国") || lower.contains("美國") || lower.contains("usa")
        || lower.contains("united states") || lower.contains("unitedstates")
        || lower.contains("california") || lower.contains("los angeles")
        || lower.contains("san jose") || lower.contains("new york")
        || lower.contains("seattle") || lower.contains("chicago")
        || lower.contains("texas") || lower.contains("atlanta") || lower.contains("atl")
        || lower.contains("minnesota") || lower.contains("arizona") || lower.contains("scottsdale")
        || lower.contains("south carolina") || lower.contains("cloudflare")
        || lower.starts_with("us") && (lower.contains("丨") || lower.contains("|"))
    {
        return "us".into();
    }

    // France
    if lower.contains("法国") || lower.contains("法國") || lower.contains("france")
        || lower.contains("french") || lower.contains("paris") || lower.contains("fr")
    {
        return "fr".into();
    }

    "other".into()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_classify_jp() {
        assert_eq!(classify_region("JP日本丨yoyapai.com"), "jp");
        assert_eq!(classify_region("日本東京丨yoyapai.com"), "jp");
    }

    #[test]
    fn test_classify_us() {
        assert_eq!(classify_region("US美國丨yoyapai.com"), "us");
        assert_eq!(classify_region("美国 加利福尼亚州圣何塞"), "us");
    }

    #[test]
    fn test_classify_fr() {
        assert_eq!(classify_region("FR法國丨yoyapai.com"), "fr");
    }

    #[test]
    fn test_classify_other() {
        assert_eq!(classify_region("荷蘭丨yoyapai.com"), "other");
    }
}
