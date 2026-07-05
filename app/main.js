const { app, BrowserWindow, ipcMain, Tray, Menu, shell, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const { checkUpdateAvailable, fetchAndParseNodes } = require('./updater');
const { setupAutoStart } = require('./autostart');

// ── Settings (simple JSON file) ──
const settingsPath = path.join(app.getPath('userData'), 'settings.json');

const defaultSettings = {
  theme: 'dark',
  language: 'en',
  trayEnabled: false,
  autostartEnabled: false,
  notifyUpdates: true,
  latencyTestEnabled: false,
  refreshIntervalSecs: 21600,
  lastUpdate: null
};

function loadSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      return { ...defaultSettings, ...JSON.parse(fs.readFileSync(settingsPath, 'utf-8')) };
    }
  } catch (e) { console.error('Load settings error:', e); }
  return { ...defaultSettings };
}

function saveSettings(settings) {
  try {
    const dir = path.dirname(settingsPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (e) { console.error('Save settings error:', e); }
}

let currentSettings = defaultSettings;

// ── Globals ──
let mainWindow = null;
let tray = null;
let isQuitting = false;

// ── Create main window ──
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 700,
    minWidth: 420,
    minHeight: 520,
    center: true,
    show: false,
    title: 'Clash Nodes',
    icon: path.join(__dirname, '..', 'src', 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    autoHideMenuBar: true,
    backgroundColor: '#0a0f1e'
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting && currentSettings.trayEnabled) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// ── System Tray ──
function createTray() {
  const iconPath = path.join(__dirname, '..', 'src', 'assets', 'tray-icon.png');
  try {
    tray = new Tray(iconPath);
  } catch (e) {
    console.log('Tray icon not found:', e.message);
    return;
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Window',
      click: () => { if (mainWindow) { mainWindow.show(); mainWindow.focus(); } }
    },
    {
      label: 'Copy Subscription URL',
      click: () => { if (mainWindow) mainWindow.webContents.send('tray-copy-url'); }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => { isQuitting = true; app.quit(); }
    }
  ]);

  tray.setToolTip('Clash Nodes');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    if (mainWindow) { mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show(); }
  });
  tray.setVisible(currentSettings.trayEnabled);
}

// ── IPC Handlers ──
ipcMain.handle('get-settings', () => currentSettings);

ipcMain.handle('save-settings', (event, newSettings) => {
  currentSettings = { ...currentSettings, ...newSettings };
  saveSettings(currentSettings);

  if (newSettings.trayEnabled !== undefined && tray) {
    tray.setVisible(newSettings.trayEnabled);
  }
  if (newSettings.autostartEnabled !== undefined) {
    setupAutoStart(newSettings.autostartEnabled);
  }
  return { success: true };
});

ipcMain.handle('copy-to-clipboard', (event, text) => {
  const { clipboard } = require('electron');
  clipboard.writeText(text);
  return { success: true };
});

ipcMain.handle('fetch-nodes', async () => {
  try {
    const result = await fetchAndParseNodes();
    if (result && result.nodes) {
      const cachePath = path.join(app.getPath('userData'), 'nodes_cache.json');
      fs.writeFileSync(cachePath, JSON.stringify(result.nodes, null, 2));
      currentSettings.lastUpdate = new Date().toISOString();
      saveSettings(currentSettings);
    }
    return result;
  } catch (e) { return { error: e.message }; }
});

ipcMain.handle('get-cached-nodes', () => {
  try {
    const cachePath = path.join(app.getPath('userData'), 'nodes_cache.json');
    if (fs.existsSync(cachePath)) return JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  } catch (e) { console.error('Read cache error:', e); }
  return [];
});

ipcMain.handle('check-update', async () => {
  try {
    const result = await checkUpdateAvailable();
    if (result && result.updated && currentSettings.notifyUpdates) {
      new Notification({
        title: 'Clash Nodes Updated',
        body: 'New proxy nodes available. Click to refresh.'
      }).on('click', () => {
        if (mainWindow) { mainWindow.show(); mainWindow.webContents.send('trigger-refresh'); }
      }).show();
    }
    return result;
  } catch (e) { return { updated: false }; }
});

ipcMain.handle('window-minimize', () => { if (mainWindow) mainWindow.minimize(); });
ipcMain.handle('window-close', () => {
  if (currentSettings.trayEnabled) { mainWindow.hide(); }
  else { isQuitting = true; app.quit(); }
});
ipcMain.handle('open-external', (event, url) => { shell.openExternal(url); });

// ── App lifecycle ──
app.whenReady().then(() => {
  currentSettings = loadSettings();
  createWindow();
  createTray();
  if (currentSettings.autostartEnabled) setupAutoStart(true);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    if (mainWindow) mainWindow.show();
  });
});

app.on('window-all-closed', () => {
  if (!currentSettings.trayEnabled) app.quit();
});

app.on('before-quit', () => { isQuitting = true; });
