const { app, BrowserWindow, ipcMain, Tray, Menu, dialog, shell, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
const { checkUpdateAvailable, fetchAndParseNodes } = require('./updater');
const { setupAutoStart } = require('./autostart');

// ── Settings store ──
const store = new Store({
  defaults: {
    theme: 'dark',
    language: 'en',
    trayEnabled: false,
    autostartEnabled: false,
    notifyUpdates: true,
    latencyTestEnabled: false,
    refreshIntervalSecs: 21600,
    lastUpdate: null
  }
});

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
    frame: true,
    autoHideMenuBar: true,
    backgroundColor: '#0a0f1e'
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting && store.get('trayEnabled')) {
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
  // Use a simple 16x16 PNG icon (create from scratch if needed)
  const iconPath = path.join(__dirname, '..', 'src', 'assets', 'tray-icon.png');

  // Fallback: use a minimal built-in approach
  try {
    tray = new Tray(iconPath);
  } catch (e) {
    // Create a tiny PNG programmatically if file doesn't exist
    console.log('Tray icon not found, tray disabled until icon is provided');
    return;
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Window',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    {
      label: 'Copy Subscription URL',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('tray-copy-url');
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Clash Nodes');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });

  // Hide tray initially (enabled via settings)
  tray.setVisible(store.get('trayEnabled'));
}

// ── IPC Handlers ──

// Settings
ipcMain.handle('get-settings', () => {
  return store.store;
});

ipcMain.handle('save-settings', (event, settings) => {
  const old = { ...store.store };
  store.set(settings);

  // Apply changes immediately
  if (settings.trayEnabled !== undefined && settings.trayEnabled !== old.trayEnabled) {
    if (tray) tray.setVisible(settings.trayEnabled);
  }
  if (settings.autostartEnabled !== undefined) {
    setupAutoStart(settings.autostartEnabled);
  }

  return { success: true };
});

// Clipboard
ipcMain.handle('copy-to-clipboard', (event, text) => {
  const { clipboard } = require('electron');
  clipboard.writeText(text);
  return { success: true };
});

// Node fetching
ipcMain.handle('fetch-nodes', async () => {
  try {
    const result = await fetchAndParseNodes();
    if (result && result.nodes) {
      // Cache to disk
      const cachePath = path.join(app.getPath('userData'), 'nodes_cache.json');
      fs.writeFileSync(cachePath, JSON.stringify(result.nodes, null, 2));
      store.set('lastUpdate', new Date().toISOString());
    }
    return result;
  } catch (e) {
    console.error('Fetch nodes error:', e);
    return { error: e.message };
  }
});

ipcMain.handle('get-cached-nodes', () => {
  try {
    const cachePath = path.join(app.getPath('userData'), 'nodes_cache.json');
    if (fs.existsSync(cachePath)) {
      const data = fs.readFileSync(cachePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Read cache error:', e);
  }
  return [];
});

// Update check
ipcMain.handle('check-update', async () => {
  try {
    const result = await checkUpdateAvailable();
    if (result && store.get('notifyUpdates')) {
      new Notification({
        title: 'Clash Nodes Updated',
        body: 'New proxy nodes are available. Click to refresh.',
        urgency: 'normal'
      }).on('click', () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.webContents.send('trigger-refresh');
        }
      }).show();
    }
    return result;
  } catch (e) {
    return { updated: false };
  }
});

// Window controls
ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window-close', () => {
  if (store.get('trayEnabled')) {
    mainWindow.hide();
  } else {
    isQuitting = true;
    app.quit();
  }
});

// Open external URL
ipcMain.handle('open-external', (event, url) => {
  shell.openExternal(url);
});

// ── App lifecycle ──
app.whenReady().then(() => {
  createWindow();
  createTray();

  // Apply stored autostart setting
  if (store.get('autostartEnabled')) {
    setupAutoStart(true);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
    if (mainWindow) {
      mainWindow.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Don't quit if tray is enabled — keep running in background
    if (!store.get('trayEnabled')) {
      app.quit();
    }
  }
});

app.on('before-quit', () => {
  isQuitting = true;
});
