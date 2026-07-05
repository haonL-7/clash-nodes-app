/* ── Bridge to Electron backend ── */
var IS_ELECTRON = !!(window.electronAPI);
var IS_TAURI = typeof window.__TAURI_INTERNALS__ !== 'undefined';

/* Check if running inside a native app */
function isNative() {
  return IS_ELECTRON || IS_TAURI;
}

function isTauri() {
  return IS_TAURI;
}

function isElectron() {
  return IS_ELECTRON;
}

/* ── Node data ── */
async function getNodes() {
  if (IS_ELECTRON) {
    try {
      return await window.electronAPI.getCachedNodes();
    } catch (e) {
      console.warn('Failed to get cached nodes:', e);
      return null;
    }
  }
  return null;
}

async function fetchNodes() {
  if (IS_ELECTRON) {
    try {
      var result = await window.electronAPI.fetchNodes();
      return result && result.nodes ? result.nodes : null;
    } catch (e) {
      console.warn('Failed to fetch nodes:', e);
      return null;
    }
  }
  return null;
}

/* ── Settings ── */
async function getAppSettings() {
  if (IS_ELECTRON) {
    try {
      return await window.electronAPI.getSettings();
    } catch (e) {
      console.warn('Failed to get settings:', e);
      return null;
    }
  }
  return null;
}

async function saveAppSettings(settings) {
  if (IS_ELECTRON) {
    try {
      await window.electronAPI.saveSettings(settings);
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }
}

/* ── Update check ── */
async function checkForUpdate() {
  if (IS_ELECTRON) {
    try {
      return await window.electronAPI.checkUpdate();
    } catch (e) {
      console.warn('Failed to check update:', e);
      return null;
    }
  }
  return null;
}

/* ── Clipboard ── */
async function copyText(text) {
  if (IS_ELECTRON) {
    try {
      await window.electronAPI.copyToClipboard(text);
      return true;
    } catch (e) {
      console.warn('Failed to copy:', e);
    }
  }
  // Fallback to browser clipboard API
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return false;
  }
}

/* ── Window control ── */
async function minimizeWindow() {
  if (IS_ELECTRON) {
    try { await window.electronAPI.minimizeWindow(); } catch (e) {}
  }
}

/* ── Tray copy handler ── */
function onTrayCopyUrl(callback) {
  if (IS_ELECTRON) {
    return window.electronAPI.onTrayCopyUrl(callback);
  }
  return function() {};
}

function onTriggerRefresh(callback) {
  if (IS_ELECTRON) {
    return window.electronAPI.onTriggerRefresh(callback);
  }
  return function() {};
}

/* ── Open external ── */
function openExternal(url) {
  if (IS_ELECTRON) {
    window.electronAPI.openExternal(url);
  } else {
    window.open(url, '_blank');
  }
}

/* ── Deprecated: latency test (full impl in Electron requires native module) ── */
async function runLatencyTest(nodeNames) {
  // TCP ping from renderer is blocked by browsers.
  // In a future version, this can be implemented in the Electron main process
  // using Node.js net module. For now, return empty.
  console.log('Latency test not available in browser mode');
  return null;
}
