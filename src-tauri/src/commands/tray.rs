use tauri::{AppHandle, Manager};

/// Enable or disable the system tray icon.
/// On desktop platforms, this shows/hides the tray icon.
#[tauri::command]
pub async fn set_tray_enabled(app: AppHandle, enabled: bool) -> Result<(), String> {
    if enabled {
        // Tray should already be built at startup; if enabled later, show it
        if let Some(tray) = app.tray_by_id("main-tray") {
            let _ = tray.set_visible(true);
        }
        println!("System tray enabled");
    } else {
        // Hide the tray icon
        if let Some(tray) = app.tray_by_id("main-tray") {
            let _ = tray.set_visible(false);
        }
        println!("System tray disabled");
    }
    Ok(())
}

/// Get current tray status
#[tauri::command]
pub fn get_tray_status(app: AppHandle) -> bool {
    if let Some(tray) = app.tray_by_id("main-tray") {
        // Tauri v2 tray doesn't expose visibility directly;
        // we rely on settings state managed by the frontend
        return true;
    }
    false
}
