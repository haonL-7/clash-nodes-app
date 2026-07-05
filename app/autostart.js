const { app } = require('electron');
const path = require('path');
const fs = require('fs');

/**
 * Enable or disable auto-start on Windows.
 * Windows: Creates/removes a registry entry via a .vbs helper or direct registry.
 * macOS: Uses LaunchAgent (handled by electron's app.setLoginItemSettings)
 */
function setupAutoStart(enabled) {
  if (process.platform === 'win32') {
    // On Windows, use Electron's built-in API
    app.setLoginItemSettings({
      openAtLogin: enabled,
      path: process.execPath,
      args: []
    });
    console.log(`Auto-start ${enabled ? 'enabled' : 'disabled'}`);
  } else if (process.platform === 'darwin') {
    app.setLoginItemSettings({
      openAtLogin: enabled,
      path: process.execPath
    });
  }
  // Linux: not supported in this simple implementation
}

module.exports = { setupAutoStart };
