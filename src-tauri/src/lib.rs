mod commands;
mod models;
mod parser;

use crate::models::ProxyNode;
use std::sync::Mutex;

/// In-memory cache of proxy nodes, accessible from commands
pub struct NodeCache {
    nodes: Mutex<Vec<ProxyNode>>,
}

impl Default for NodeCache {
    fn default() -> Self {
        Self {
            nodes: Mutex::new(Vec::new()),
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(NodeCache::default())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None, // No custom arguments
        ))
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::fetch::fetch_latest_nodes,
            commands::fetch::get_cached_nodes,
            commands::fetch::check_data_update,
            commands::fetch::get_full_proxy_nodes,
            commands::settings::get_settings,
            commands::settings::save_settings,
            commands::settings::update_setting,
            commands::tray::set_tray_enabled,
            commands::tray::get_tray_status,
            commands::autostart::set_autostart,
            commands::autostart::is_autostart_enabled,
            commands::latency::test_node_latency,
        ])
        .setup(|app| {
            // Build system tray
            use tauri::menu::{MenuBuilder, MenuItemBuilder};
            use tauri::tray::TrayIconBuilder;

            let show_item = MenuItemBuilder::new("Show Window")
                .id("show")
                .build(app)?;
            let copy_item = MenuItemBuilder::new("Copy Subscription")
                .id("copy")
                .build(app)?;
            let check_item = MenuItemBuilder::new("Check Updates")
                .id("check")
                .build(app)?;
            let quit_item = MenuItemBuilder::new("Quit")
                .id("quit")
                .build(app)?;

            let menu = MenuBuilder::new(app)
                .item(&show_item)
                .item(&copy_item)
                .item(&check_item)
                .separator()
                .item(&quit_item)
                .build()?;

            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .id("main-tray")
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "copy" => {
                        // Focus the main window so the user can copy the URL
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                        // Also emit event so frontend can copy the URL
                        let _ = app.emit("tray-copy-subscription", ());
                    }
                    "check" => {
                        // Trigger update check (handled by frontend via events)
                        let _ = app.emit("tray-check-update", ());
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;

            // Hide tray initially (enabled via settings)
            let _ = _tray.set_visible(false);

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                // If tray is enabled, hide window instead of closing
                // The frontend controls this via settings
                let _ = window.hide();
                api.prevent_close();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running Clash Nodes app");
}
