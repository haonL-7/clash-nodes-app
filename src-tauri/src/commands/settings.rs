use crate::models::AppSettings;
use std::path::PathBuf;

fn settings_dir() -> PathBuf {
    dirs::data_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("clash-nodes")
}

fn settings_file() -> PathBuf {
    settings_dir().join("settings.json")
}

fn ensure_dir() -> std::io::Result<()> {
    let dir = settings_dir();
    if !dir.exists() {
        std::fs::create_dir_all(&dir)?;
    }
    Ok(())
}

/// Read settings from disk
fn read_settings() -> AppSettings {
    if !settings_file().exists() {
        return AppSettings::default();
    }

    std::fs::read_to_string(settings_file())
        .ok()
        .and_then(|content| serde_json::from_str(&content).ok())
        .unwrap_or_default()
}

/// Write settings to disk
fn write_settings(settings: &AppSettings) -> Result<(), String> {
    ensure_dir().map_err(|e| format!("Failed to create settings dir: {}", e))?;
    let json = serde_json::to_string_pretty(settings)
        .map_err(|e| format!("Failed to serialize settings: {}", e))?;
    std::fs::write(settings_file(), json)
        .map_err(|e| format!("Failed to write settings: {}", e))
}

/// Get current app settings
#[tauri::command]
pub fn get_settings() -> AppSettings {
    read_settings()
}

/// Save app settings and apply changes immediately
#[tauri::command]
pub fn save_settings(settings: AppSettings) -> Result<(), String> {
    write_settings(&settings)
}

/// Update a single setting key-value pair
#[tauri::command]
pub fn update_setting(key: String, value: serde_json::Value) -> Result<(), String> {
    let mut settings = read_settings();

    match key.as_str() {
        "theme" => {
            if let Some(v) = value.as_str() {
                settings.theme = v.to_string();
            }
        }
        "language" => {
            if let Some(v) = value.as_str() {
                settings.language = v.to_string();
            }
        }
        "tray_enabled" => {
            if let Some(v) = value.as_bool() {
                settings.tray_enabled = v;
            }
        }
        "autostart_enabled" => {
            if let Some(v) = value.as_bool() {
                settings.autostart_enabled = v;
            }
        }
        "notify_updates" => {
            if let Some(v) = value.as_bool() {
                settings.notify_updates = v;
            }
        }
        "latency_test_enabled" => {
            if let Some(v) = value.as_bool() {
                settings.latency_test_enabled = v;
            }
        }
        "refresh_interval_secs" => {
            if let Some(v) = value.as_u64() {
                settings.refresh_interval_secs = v;
            }
        }
        _ => return Err(format!("Unknown setting key: {}", key)),
    }

    write_settings(&settings)
}
