/* ── i18n ── */
var LANG = {
  en: {
    subtitle: 'Free proxy subscription &mdash; auto-updated daily from public sources',
    sub_title: 'Subscription URLs',
    copy: 'Copy',
    copied: 'Copied',
    clients_title: 'Desktop Clients',
    clients_hint: 'Install any client, then import the subscription URL above.',
    nodes_title: 'Node Directory',
    all: 'All',
    other: 'Other',
    search: 'Search nodes...',
    col_name: 'Name',
    col_region: 'Region',
    empty: 'No matching nodes.',
    updated: 'Last update',
    powered: 'Powered by',
    toast: 'Copied to clipboard',
    badge_jp: 'Japan',
    badge_us: 'United States',
    badge_fr: 'France',
    badge_other: 'Other',
    settings_title: 'App Settings',
    setting_tray: 'System Tray',
    setting_autostart: 'Auto-start with system',
    setting_notify: 'Update notifications',
    setting_latency: 'Node latency testing',
    setting_interval: 'Data refresh interval',
    test_latency: 'Ping',
    latency_testing: 'Testing...',
    latency_ms: 'ms',
    latency_timeout: 'timeout',
    setting_hint_desktop: 'These options are only available in the desktop app.',
    mobile_share: 'Share',
    toast_share: 'Subscription link copied — share with your client app'
  },
  zh: {
    subtitle: '免费代理订阅 &mdash; 每日自动更新，聚合公开数据',
    sub_title: '订阅地址',
    copy: '复制',
    copied: '已复制',
    clients_title: '桌面客户端',
    clients_hint: '安装任意客户端，导入上方订阅地址即可使用。',
    nodes_title: '节点列表',
    all: '全部',
    other: '其他',
    search: '搜索节点...',
    col_name: '名称',
    col_region: '地区',
    empty: '无匹配节点。',
    updated: '最后更新',
    powered: '驱动',
    toast: '已复制到剪贴板',
    badge_jp: '日本',
    badge_us: '美国',
    badge_fr: '法国',
    badge_other: '其他',
    settings_title: '应用设置',
    setting_tray: '系统托盘',
    setting_autostart: '开机自启',
    setting_notify: '更新通知',
    setting_latency: '节点延迟测试',
    setting_interval: '数据刷新间隔',
    test_latency: '测速',
    latency_testing: '测速中...',
    latency_ms: 'ms',
    latency_timeout: '超时',
    setting_hint_desktop: '以下选项仅在桌面端可用。',
    mobile_share: '分享',
    toast_share: '订阅链接已复制 — 可粘贴到客户端中使用'
  }
};

var curLang = localStorage.getItem('lang') || 'en';

function t(key) { return (LANG[curLang] || LANG['en'])[key] || key; }

function applyLang() {
  document.documentElement.lang = curLang;
  var langLabel = document.getElementById('langLabel');
  if (langLabel) langLabel.textContent = curLang === 'zh' ? 'EN' : '中文';

  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' && key === 'search') {
      el.placeholder = t('search');
    } else if (key === 'subtitle') {
      el.innerHTML = t('subtitle');
    } else {
      el.textContent = t(key);
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  if (curLang === 'zh') {
    var searchEl = document.querySelector('[data-i18n="search"]');
    if (searchEl) searchEl.placeholder = t('search');
  }

  var hint = document.querySelector('.card:nth-of-type(2) p');
  if (hint) hint.textContent = t('clients_hint');
}

function toggleLang() {
  curLang = curLang === 'en' ? 'zh' : 'en';
  localStorage.setItem('lang', curLang);
  applyLang();
  // Re-render badges
  BADGES = {
    jp: '<span class="badge jp">' + t('badge_jp') + '</span>',
    us: '<span class="badge us">' + t('badge_us') + '</span>',
    fr: '<span class="badge fr">' + t('badge_fr') + '</span>',
    other: '<span class="badge other">' + t('badge_other') + '</span>'
  };
  render();
}
