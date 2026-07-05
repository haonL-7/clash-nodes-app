const { contextBridge, ipcRenderer } = require('electron');

// Expose a safe API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // ── Settings ──
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

  // ── Clipboard ──
  copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),

  // ── Node data ──
  fetchNodes: () => ipcRenderer.invoke('fetch-nodes'),
  getCachedNodes: () => ipcRenderer.invoke('get-cached-nodes'),

  // ── Update ──
  checkUpdate: () => ipcRenderer.invoke('check-update'),

  // ── Window ──
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  closeWindow: () => ipcRenderer.invoke('window-close'),

  // ── External ──
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // ── Events (main → renderer) ──
  onTrayCopyUrl: (callback) => {
    ipcRenderer.on('tray-copy-url', () => callback());
    return () => ipcRenderer.removeAllListeners('tray-copy-url');
  },
  onTriggerRefresh: (callback) => {
    ipcRenderer.on('trigger-refresh', () => callback());
    return () => ipcRenderer.removeAllListeners('trigger-refresh');
  }
});
