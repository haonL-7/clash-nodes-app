use serde::{Deserialize, Serialize};

/// Simplified node info for the frontend (matches existing NODES structure)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeInfo {
    /// Node display name
    #[serde(rename = "n")]
    pub name: String,
    /// Region code: jp, us, fr, other
    #[serde(rename = "r")]
    pub region: String,
}

/// Full proxy node details parsed from YAML
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProxyNode {
    pub name: String,
    #[serde(default)]
    pub server: String,
    #[serde(default)]
    pub port: u16,
    #[serde(rename = "type", default)]
    pub proxy_type: String,
    pub region: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub latency_ms: Option<u64>,
}

/// Application settings
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    #[serde(default = "default_theme")]
    pub theme: String,
    #[serde(default = "default_language")]
    pub language: String,
    #[serde(default)]
    pub tray_enabled: bool,
    #[serde(default)]
    pub autostart_enabled: bool,
    #[serde(default = "default_true")]
    pub notify_updates: bool,
    #[serde(default)]
    pub latency_test_enabled: bool,
    #[serde(default = "default_refresh_interval")]
    pub refresh_interval_secs: u64,
    #[serde(default)]
    pub last_data_update: Option<String>,
}

fn default_theme() -> String { "dark".into() }
fn default_language() -> String { "en".into() }
fn default_true() -> bool { true }
fn default_refresh_interval() -> u64 { 21600 }

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            theme: default_theme(),
            language: default_language(),
            tray_enabled: false,
            autostart_enabled: false,
            notify_updates: true,
            latency_test_enabled: false,
            refresh_interval_secs: default_refresh_interval(),
            last_data_update: None,
        }
    }
}
