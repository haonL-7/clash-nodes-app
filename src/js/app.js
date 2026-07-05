/* ── App Initialization ── */

var appSettings = {
  tray_enabled: false,
  autostart_enabled: false,
  notify_updates: true,
  latency_test_enabled: false,
  refresh_interval_secs: 21600
};

/* Apply settings to UI checkboxes */
function applySettingsToUI(settings) {
  if (!settings) return;
  appSettings = settings;

  var trayCb = document.getElementById('settingTray');
  var autoCb = document.getElementById('settingAutostart');
  var notifyCb = document.getElementById('settingNotify');
  var latencyCb = document.getElementById('settingLatency');
  var intervalSel = document.getElementById('settingInterval');

  if (trayCb) trayCb.checked = !!settings.trayEnabled;
  if (autoCb) autoCb.checked = !!settings.autostartEnabled;
  if (notifyCb) notifyCb.checked = !!settings.notifyUpdates;
  if (latencyCb) {
    latencyCb.checked = !!settings.latencyTestEnabled;
    // Show/hide latency button
    var btn = document.getElementById('latencyBtn');
    if (btn) btn.style.display = settings.latencyTestEnabled ? 'inline-flex' : 'none';
  }
  if (intervalSel) intervalSel.value = String(settings.refreshIntervalSecs || 21600);
}

/* Update a single setting */
async function updateSetting(key, value) {
  appSettings[key] = value;
  await saveAppSettings(appSettings);

  // Apply immediately
  if (key === 'latency_test_enabled' || key === 'latencyTestEnabled') {
    var btn = document.getElementById('latencyBtn');
    if (btn) btn.style.display = value ? 'inline-flex' : 'none';
  }
}

/* Start auto-refresh timer */
var refreshTimer = null;
function startAutoRefresh(intervalSecs) {
  if (refreshTimer) clearInterval(refreshTimer);
  if (intervalSecs > 0 && isNative()) {
    refreshTimer = setInterval(async function() {
      var result = await checkForUpdate();
      if (result && result.updated) {
        var nodes = await fetchNodes();
        if (nodes && nodes.length) updateNodesFromBackend(nodes);
      }
    }, intervalSecs * 1000);
  }
}

/* ── Init ── */
async function init() {
  applyLang();
  render();
  animateCounters();

  if (isNative()) {
    // Show settings panel
    var settingsCard = document.getElementById('settingsCard');
    if (settingsCard) settingsCard.style.display = 'block';

    // Show settings toggle button
    var settingsToggle = document.getElementById('settingsToggle');
    if (settingsToggle) settingsToggle.style.display = 'inline-flex';

    // Show latency button
    var latencyBtn = document.getElementById('latencyBtn');
    if (latencyBtn) latencyBtn.style.display = 'inline-flex';

    // Hide desktop-only hint on desktop
    var desktopHint = document.getElementById('desktopHint');
    if (desktopHint) desktopHint.style.display = 'none';

    // ── Listen for tray events ──
    onTrayCopyUrl(function() {
      var url = document.getElementById('sub-raw').value;
      copyText(url).then(function() {
        var toast = document.getElementById('toast');
        toast.textContent = t('toast');
        toast.classList.add('show');
        setTimeout(function() { toast.classList.remove('show'); }, 1800);
      });
    });

    onTriggerRefresh(function() {
      fetchNodes().then(function(nodes) {
        if (nodes && nodes.length) updateNodesFromBackend(nodes);
      });
    });

    // ── Load settings ──
    var settings = await getAppSettings();
    if (settings) applySettingsToUI(settings);

    // ── Load nodes from backend ──
    var cachedNodes = await getNodes();
    if (cachedNodes && cachedNodes.length) {
      updateNodesFromBackend(cachedNodes);
    }

    // ── Fetch latest nodes in background ──
    fetchNodes().then(function(nodes) {
      if (nodes && nodes.length) updateNodesFromBackend(nodes);
    });

    // ── Check for updates ──
    checkForUpdate().then(function(result) {
      if (result && result.updated) {
        console.log('Data update available');
      }
    });

    // ── Start auto-refresh ──
    startAutoRefresh(appSettings.refresh_interval_secs);
  } else {
    // Browser mode
    var desktopHint = document.getElementById('desktopHint');
    if (desktopHint) desktopHint.style.display = 'block';

    var settingsToggle = document.getElementById('settingsToggle');
    if (settingsToggle) settingsToggle.style.display = 'none';
  }

  // Update copy buttons to use Electron clipboard
  if (isElectron()) {
    // Enhance doCopy to use Electron's clipboard
    var origDoCopy = doCopy;
    // doCopy already works — it uses navigator.clipboard which works in Electron too
  }
}

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', init);
