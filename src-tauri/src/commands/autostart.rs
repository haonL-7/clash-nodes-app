use tauri::AppHandle;

/// Enable or disable auto-start with the system.
/// Uses tauri-plugin-autostart under the hood.
#[tauri::command]
pub async fn set_autostart(app: AppHandle, enabled: bool) -> Result<(), String> {
    if enabled {
        // Enable auto-start via the autostart plugin
        let autostart_manager = app.state::<tauri_plugin_autostart::ManagerExt>();
        autostart_manager
            .enable()
            .map_err(|e| format!("Failed to enable autostart: {}", e))?;
        println!("Auto-start enabled");
    } else {
        let autostart_manager = app.state::<tauri_plugin_autostart::ManagerExt>();
        autostart_manager
            .disable()
            .map_err(|e| format!("Failed to disable autostart: {}", e))?;
        println!("Auto-start disabled");
    }
    Ok(())
}

/// Check if auto-start is currently enabled
#[tauri::command]
pub async fn is_autostart_enabled(app: AppHandle) -> Result<bool, String> {
    let autostart_manager = app.state::<tauri_plugin_autostart::ManagerExt>();
    autostart_manager
        .is_enabled()
        .map_err(|e| format!("Failed to check autostart: {}", e))
}
