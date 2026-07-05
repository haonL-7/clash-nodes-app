/* ── Nodes Data & Rendering ── */

/* Default embedded nodes (used as fallback in browser mode) */
var EMBEDDED_NODES = [{"n": "FR法國丨yoyapai.com", "r": "fr"}, {"n": "FR法國丨yoyapai.com_1", "r": "fr"}, {"n": "FR法國丨yoyapai.com_2", "r": "fr"}, {"n": "FR法國丨yoyapai.com_3", "r": "fr"}, {"n": "JP日本丨yoyapai.com", "r": "jp"}, {"n": "JP日本丨yoyapai.com_1", "r": "jp"}, {"n": "JP日本丨yoyapai.com_2", "r": "jp"}, {"n": "JP日本丨yoyapai.com_3", "r": "jp"}, {"n": "JP日本丨yoyapai.com_4", "r": "jp"}, {"n": "US美國丨yoyapai.com", "r": "us"}, {"n": "US美國丨yoyapai.com", "r": "us"}, {"n": "美國丨yoyapai.com", "r": "us"}, {"n": "美國丨yoyapai.com_1", "r": "us"}, {"n": "FR法國丨yoyapai.com_4", "r": "fr"}, {"n": "FR法國丨yoyapai.com_5", "r": "fr"}, {"n": "FR法國丨yoyapai.com_6", "r": "fr"}, {"n": "US美國丨yoyapai.com_1", "r": "us"}, {"n": "US美國丨yoyapai.com_2", "r": "us"}, {"n": "US美國丨yoyapai.com_3", "r": "us"}, {"n": "US美國丨yoyapai.com_4", "r": "us"}, {"n": "JP日本丨yoyapai.com_5", "r": "jp"}, {"n": "US美國丨yoyapai.com_5", "r": "us"}, {"n": "JP日本丨yoyapai.com_6", "r": "jp"}, {"n": "JP日本丨yoyapai.com_7", "r": "jp"}, {"n": "US美國丨yoyapai.com_6", "r": "us"}, {"n": "美國丨yoyapai.com_2", "r": "us"}, {"n": "美國丨yoyapai.com_3", "r": "us"}, {"n": "美國丨yoyapai.com_4", "r": "us"}, {"n": "美國丨yoyapai.com_5", "r": "us"}, {"n": "JP日本丨yoyapai.com_8", "r": "jp"}, {"n": "US美國丨yoyapai.com_7", "r": "us"}, {"n": "美國節點丨yoyapai.com", "r": "us"}, {"n": "US美國丨yoyapai.com", "r": "us"}, {"n": "美國丨yoyapai.com_6", "r": "us"}, {"n": "US美國丨yoyapai.com_1", "r": "us"}, {"n": "美國丨yoyapai.com_7", "r": "us"}, {"n": "美國節點丨yoyapai.com_1", "r": "us"}, {"n": "美國節點丨yoyapai.com_2", "r": "us"}, {"n": "美國節點丨yoyapai.com_3", "r": "us"}, {"n": "美國丨yoyapai.com_8", "r": "us"}, {"n": "US美國丨yoyapai.com_2", "r": "us"}, {"n": "美國節點丨yoyapai.com_4", "r": "us"}, {"n": "美國丨yoyapai.com_9", "r": "us"}, {"n": "美國丨yoyapai.com_10", "r": "us"}, {"n": "US美國丨yoyapai.com_8", "r": "us"}, {"n": "美國丨yoyapai.com_11", "r": "us"}, {"n": "美國節點丨yoyapai.com_5", "r": "us"}, {"n": "美國節點丨yoyapai.com_6", "r": "us"}, {"n": "HU匈牙利丨yoyapai.com", "r": "other"}, {"n": "美國丨yoyapai.com_12", "r": "us"}, {"n": "US美國丨yoyapai.com_9", "r": "us"}, {"n": "US美國丨yoyapai.com_10", "r": "us"}, {"n": "美國丨yoyapai.com_13", "r": "us"}, {"n": "新加坡丨yoyapai.com", "r": "other"}, {"n": "英國", "r": "other"}, {"n": "日本節點", "r": "jp"}, {"n": "英國丨yoyapai.com", "r": "other"}, {"n": "烏克蘭丨yoyapai.com", "r": "other"}, {"n": "德國丨yoyapai.com", "r": "other"}, {"n": "丹麥丨yoyapai.com", "r": "other"}, {"n": "臺灣節點丨yoyapai.com", "r": "other"}, {"n": "美國節點", "r": "us"}, {"n": "KR南朝鮮丨yoyapai.com", "r": "other"}, {"n": "KR韓國節點丨yoyapai.com", "r": "other"}, {"n": "NL荷蘭丨yoyapai.com", "r": "other"}, {"n": "意大利節點IT丨yoyapai.com", "r": "other"}, {"n": "NL荷蘭丨yoyapai.com_1", "r": "other"}, {"n": "NL荷蘭丨yoyapai.com_2", "r": "other"}, {"n": "荷蘭節點丨yoyapai.com", "r": "other"}, {"n": "美国 加利福尼亚州圣何塞", "r": "us"}, {"n": "丹麥丨yoyapai.com_1", "r": "other"}, {"n": "中國臺灣丨yoyapai.com", "r": "other"}, {"n": "韓國丨yoyapai.com", "r": "other"}, {"n": "韓國丨yoyapai.com_1", "r": "other"}, {"n": "美國丨yoyapai.com_14", "r": "us"}, {"n": "保加利亞丨yoyapai.com", "r": "other"}, {"n": "烏克蘭丨yoyapai.com_1", "r": "other"}, {"n": "美國丨yoyapai.com_15", "r": "us"}, {"n": "美國丨yoyapai.com_16", "r": "us"}, {"n": "保加利亞丨yoyapai.com_1", "r": "other"}, {"n": "保加利亞丨yoyapai.com_2", "r": "other"}, {"n": "美國節點_1", "r": "us"}, {"n": "美國節點_2", "r": "us"}, {"n": "美國節點_3", "r": "us"}, {"n": "德國節點丨yoyapai.com", "r": "other"}, {"n": "德國丨yoyapai.com_1", "r": "other"}, {"n": "英國丨yoyapai.com_1", "r": "other"}, {"n": "香港丨yoyapai.com", "r": "other"}, {"n": "亞太地區", "r": "other"}, {"n": "亞太地區_1", "r": "other"}, {"n": "香港", "r": "other"}, {"n": "亞太地區_2", "r": "other"}, {"n": "亞太地區_3", "r": "other"}, {"n": "香港_1", "r": "other"}, {"n": "歐盟丨yoyapai.com", "r": "other"}, {"n": "俄羅斯丨yoyapai.com", "r": "other"}, {"n": "美国+亚利桑那州斯科茨代尔市丨yoyapai.com", "r": "us"}, {"n": "歐盟丨yoyapai.com_1", "r": "other"}, {"n": "俄羅斯丨yoyapai.com_1", "r": "other"}, {"n": "美国+亚利桑那州斯科茨代尔市丨yoyapai.com_1", "r": "us"}, {"n": "臺灣省丨yoyapai.com", "r": "other"}, {"n": "亞太地區丨yoyapai.com", "r": "other"}, {"n": "臺灣省丨yoyapai.com_1", "r": "other"}, {"n": "亞太地區丨yoyapai.com_1", "r": "other"}, {"n": "俄羅斯", "r": "other"}, {"n": "美國節點丨yoyapai.com_7", "r": "us"}, {"n": "荷蘭丨yoyapai.com", "r": "other"}, {"n": "荷蘭丨yoyapai.com_1", "r": "other"}, {"n": "英國節點", "r": "other"}, {"n": "德國節點丨yoyapai.com_1", "r": "other"}, {"n": "台湾省台北市丨yoyapai.com", "r": "other"}, {"n": "日本節點丨yoyapai.com", "r": "jp"}, {"n": "俄羅斯丨yoyapai.com_2", "r": "other"}, {"n": "瑞士丨yoyapai.com", "r": "other"}, {"n": "英國節點丨yoyapai.com", "r": "other"}, {"n": "亞太地區丨yoyapai.com_2", "r": "other"}, {"n": "保加利亞丨yoyapai.com_3", "r": "other"}, {"n": "巴西聖保羅丨yoyapai.com", "r": "other"}, {"n": "美國", "r": "us"}, {"n": "土耳其丨yoyapai.com", "r": "other"}, {"n": "德國丨yoyapai.com_2", "r": "other"}, {"n": "烏克蘭丨yoyapai.com_2", "r": "other"}, {"n": "美國丨yoyapai.com_17", "r": "us"}, {"n": "美國丨yoyapai.com_18", "r": "us"}, {"n": "美國丨yoyapai.com_19", "r": "us"}, {"n": "荷蘭丨yoyapai.com_2", "r": "other"}, {"n": "澳大利亞丨yoyapai.com", "r": "other"}, {"n": "澳大利亞丨yoyapai.com_1", "r": "other"}, {"n": "澳大利亞丨yoyapai.com_2", "r": "other"}, {"n": "澳大利亞丨yoyapai.com_3", "r": "other"}, {"n": "土耳其丨yoyapai.com_1", "r": "other"}, {"n": "土耳其丨yoyapai.com_2", "r": "other"}, {"n": "土耳其丨yoyapai.com_3", "r": "other"}, {"n": "土耳其丨yoyapai.com_4", "r": "other"}, {"n": "瑞典節點丨yoyapai.com", "r": "other"}, {"n": "瑞典節點丨yoyapai.com_1", "r": "other"}, {"n": "瑞典節點丨yoyapai.com_2", "r": "other"}, {"n": "瑞典節點丨yoyapai.com_3", "r": "other"}, {"n": "羅馬尼亞節點丨yoyapai.com", "r": "other"}, {"n": "羅馬尼亞節點丨yoyapai.com_1", "r": "other"}, {"n": "德國丨yoyapai.com_3", "r": "other"}, {"n": "德國丨yoyapai.com_4", "r": "other"}, {"n": "荷蘭節點丨yoyapai.com_1", "r": "other"}, {"n": "荷蘭節點丨yoyapai.com_2", "r": "other"}, {"n": "荷蘭節點丨yoyapai.com_3", "r": "other"}, {"n": "美國CloudFlare节点丨yoyapai.com", "r": "us"}, {"n": "美國南卡羅來納州丨yoyapai.com", "r": "us"}, {"n": "捷克丨yoyapai.com", "r": "other"}, {"n": "荷蘭丨yoyapai.com_3", "r": "other"}, {"n": "德國法蘭克福丨yoyapai.com", "r": "other"}, {"n": "羅馬尼亞丨yoyapai.com", "r": "other"}, {"n": "羅馬尼亞丨yoyapai.com_1", "r": "other"}, {"n": "羅馬尼亞丨yoyapai.com_2", "r": "other"}, {"n": "羅馬尼亞丨yoyapai.com_3", "r": "other"}, {"n": "瑞典丨yoyapai.com", "r": "other"}, {"n": "瑞典丨yoyapai.com_1", "r": "other"}, {"n": "烏克蘭丨yoyapai.com_3", "r": "other"}, {"n": "土耳其丨yoyapai.com_5", "r": "other"}, {"n": "土耳其丨yoyapai.com_6", "r": "other"}, {"n": "瑞典丨yoyapai.com_2", "r": "other"}, {"n": "瑞典丨yoyapai.com_3", "r": "other"}, {"n": "美國南卡羅來納州丨yoyapai.com_1", "r": "us"}, {"n": "荷蘭節點丨yoyapai.com_4", "r": "other"}, {"n": "荷蘭節點丨yoyapai.com_5", "r": "other"}, {"n": "荷蘭節點丨yoyapai.com_6", "r": "other"}, {"n": "韓國丨yoyapai.com_2", "r": "other"}, {"n": "巴西聖保羅丨yoyapai.com_1", "r": "other"}, {"n": "巴西聖保羅丨yoyapai.com_2", "r": "other"}, {"n": "土耳其", "r": "other"}, {"n": "土耳其_1", "r": "other"}, {"n": "羅馬尼亞丨yoyapai.com_4", "r": "other"}, {"n": "羅馬尼亞丨yoyapai.com_5", "r": "other"}, {"n": "法國節點", "r": "fr"}, {"n": "美國丨yoyapai.com_20", "r": "us"}, {"n": "土耳其丨yoyapai.com_7", "r": "other"}, {"n": "土耳其丨yoyapai.com_8", "r": "other"}, {"n": "巴西聖保羅", "r": "other"}, {"n": "丹麥", "r": "other"}, {"n": "斯洛文尼亞丨yoyapai.com", "r": "other"}, {"n": "羅馬尼亞丨yoyapai.com_6", "r": "other"}, {"n": "羅馬尼亞丨yoyapai.com_7", "r": "other"}, {"n": "瑞典節點丨yoyapai.com_4", "r": "other"}, {"n": "瑞典節點丨yoyapai.com_5", "r": "other"}, {"n": "土耳其節點丨yoyapai.com", "r": "other"}, {"n": "土耳其節點丨yoyapai.com_1", "r": "other"}, {"n": "荷蘭丨yoyapai.com_4", "r": "other"}, {"n": "荷蘭丨yoyapai.com_5", "r": "other"}, {"n": "亞太地區_4", "r": "other"}, {"n": "US美國丨yoyapai.com_11", "r": "us"}, {"n": "US美國丨yoyapai.com_12", "r": "us"}, {"n": "US美國丨yoyapai.com_13", "r": "us"}, {"n": "US美國丨yoyapai.com_14", "r": "us"}, {"n": "US美國丨yoyapai.com_15", "r": "us"}, {"n": "US美國丨yoyapai.com_16", "r": "us"}, {"n": "JP日本丨yoyapai.com", "r": "jp"}, {"n": "US美國丨yoyapai.com_17", "r": "us"}, {"n": "US美國丨yoyapai.com_1", "r": "us"}, {"n": "US美國丨yoyapai.com_2", "r": "us"}, {"n": "US美國丨yoyapai.com_3", "r": "us"}, {"n": "US美國丨yoyapai.com_4", "r": "us"}, {"n": "US美國丨yoyapai.com_5", "r": "us"}, {"n": "JP日本丨yoyapai.com_1", "r": "jp"}, {"n": "免費節點", "r": "other"}, {"n": "免費節點丨yoyapai.com", "r": "other"}, {"n": "美國丨yoyapai.com_21", "r": "us"}, {"n": "美國丨yoyapai.com_22", "r": "us"}, {"n": "NL荷蘭丨yoyapai.com", "r": "other"}, {"n": "NL荷兰+阿姆斯特丹丨yoyapai.com", "r": "other"}, {"n": "歐盟丨yoyapai.com_2", "r": "other"}, {"n": "日本東京丨yoyapai.com", "r": "jp"}, {"n": "香港丨yoyapai.com_1", "r": "other"}, {"n": "日本丨yoyapai.com", "r": "jp"}, {"n": "日本東京丨yoyapai.com_1", "r": "jp"}, {"n": "日本東京丨yoyapai.com_2", "r": "jp"}, {"n": "挪威奧斯陸丨yoyapai.com", "r": "other"}, {"n": "美國明尼蘇達州明尼阿波利斯丨yoyapai.com", "r": "us"}, {"n": "美國加利福尼亞州洛杉磯丨yoyapai.com", "r": "us"}, {"n": "美國丨yoyapai.com德克薩斯州休斯頓丨yoyapai.com", "r": "us"}, {"n": "加拿大丨yoyapai.com不列顛哥倫比亞省溫哥華丨yoyapai.com", "r": "other"}, {"n": "加拿大丨yoyapai.com安大略省多倫多丨yoyapai.com", "r": "other"}, {"n": "荷蘭丨yoyapai.com赫爾辛基丨yoyapai.com", "r": "other"}, {"n": "德國丨yoyapai.com黑森州法蘭克福丨yoyapai.com", "r": "other"}, {"n": "巴西丨yoyapai.com庫裏奇巴", "r": "other"}, {"n": "澳大利亞丨yoyapai.com_4", "r": "other"}, {"n": "AU澳大利亞丨yoyapai.com", "r": "other"}, {"n": "BE比利時丨yoyapai.com", "r": "other"}, {"n": "BE比利時丨yoyapai.com_1", "r": "other"}, {"n": "BR巴西丨yoyapai.com", "r": "other"}, {"n": "CA加拿大丨yoyapai.com", "r": "other"}, {"n": "CA加拿大丨yoyapai.com_1", "r": "other"}, {"n": "CA加拿大丨yoyapai.com_2", "r": "other"}, {"n": "FI荷蘭丨yoyapai.com", "r": "other"}, {"n": "IN印度丨yoyapai.com", "r": "other"}, {"n": "IR伊朗丨yoyapai.com", "r": "other"}, {"n": "IT意大利丨yoyapai.com", "r": "other"}, {"n": "NO挪威丨yoyapai.com", "r": "other"}, {"n": "SE瑞典丨yoyapai.com", "r": "other"}, {"n": "US美國丨yoyapai.com_6", "r": "us"}, {"n": "KR韓國丨yoyapai.com", "r": "other"}, {"n": "CA加拿大丨yoyapai.com_3", "r": "other"}, {"n": "CA加拿大丨yoyapai.com_4", "r": "other"}, {"n": "免費節點丨yoyapai.com_1", "r": "other"}, {"n": "美國節點丨yoyapai.com_8", "r": "us"}, {"n": "IR伊朗丨yoyapai.com_1", "r": "other"}, {"n": "US美國丨yoyapai.com_18", "r": "us"}, {"n": "HU匈牙利丨yoyapai.com_1", "r": "other"}, {"n": "IR伊朗丨yoyapai.com_2", "r": "other"}, {"n": "免費節點丨yoyapai.com_2", "r": "other"}, {"n": "美國節點丨yoyapai.com_9", "r": "us"}, {"n": "美國丨yoyapai.com_23", "r": "us"}, {"n": "免費節點丨yoyapai.com_3", "r": "other"}, {"n": "LT立陶宛丨yoyapai.com", "r": "other"}, {"n": "US美國丨yoyapai.com_3", "r": "us"}, {"n": "羅馬尼亞丨yoyapai.com_8", "r": "other"}, {"n": "荷蘭丨yoyapai.com", "r": "other"}, {"n": "意大利丨yoyapai.com", "r": "other"}, {"n": "瑞典丨yoyapai.com_4", "r": "other"}, {"n": "美國丨yoyapai.com_24", "r": "us"}, {"n": "美國喬治亞州亞特蘭大丨yoyapai.com", "r": "us"}, {"n": "法國丨yoyapai.com", "r": "fr"}, {"n": "羅馬尼亞丨yoyapai.com", "r": "other"}, {"n": "CH瑞士丨yoyapai.com", "r": "other"}, {"n": "美國丨yoyapai.com_25", "r": "us"}, {"n": "美國丨yoyapai.com_26", "r": "us"}, {"n": "RU俄羅斯丨yoyapai.com", "r": "other"}, {"n": "US美國丨yoyapai.com_19", "r": "us"}, {"n": "US美國丨yoyapai.com_20", "r": "us"}, {"n": "委內瑞拉丨yoyapai.com", "r": "other"}, {"n": "美國+CloudFlare节点丨yoyapai.com", "r": "us"}, {"n": "美國+CloudFlare节点丨yoyapai.com_1", "r": "us"}, {"n": "美國+CloudFlare节点丨yoyapai.com_2", "r": "us"}, {"n": "美國CloudFlare节点丨yoyapai.com", "r": "us"}, {"n": "LT立陶宛丨yoyapai.com_1", "r": "other"}, {"n": "LT立陶宛丨yoyapai.com_2", "r": "other"}, {"n": "HU匈牙利丨yoyapai.com_2", "r": "other"}, {"n": "HU匈牙利丨yoyapai.com_3", "r": "other"}, {"n": "HU匈牙利丨yoyapai.com_4", "r": "other"}, {"n": "HU匈牙利丨yoyapai.com_5", "r": "other"}, {"n": "HU匈牙利丨yoyapai.com_6", "r": "other"}, {"n": "CH瑞士丨yoyapai.com_1", "r": "other"}, {"n": "CH瑞士丨yoyapai.com_2", "r": "other"}, {"n": "荷蘭丨yoyapai.com", "r": "other"}, {"n": "南非丨yoyapai.com", "r": "other"}, {"n": "LT立陶宛丨yoyapai.com_3", "r": "other"}, {"n": "节点选择", "r": "other"}, {"n": "自动选择", "r": "other"}, {"n": "国外媒体", "r": "other"}, {"n": "电报信息", "r": "other"}, {"n": "微软服务", "r": "other"}, {"n": "苹果服务", "r": "other"}, {"n": "全球直连", "r": "other"}, {"n": "全球拦截", "r": "other"}, {"n": "应用净化", "r": "other"}, {"n": "漏网之鱼", "r": "other"}];

/* Active node data (may be replaced by backend data) */
var NODES = EMBEDDED_NODES;

var BADGES = {
  jp: '<span class="badge jp">' + t('badge_jp') + '</span>',
  us: '<span class="badge us">' + t('badge_us') + '</span>',
  fr: '<span class="badge fr">' + t('badge_fr') + '</span>',
  other: '<span class="badge other">' + t('badge_other') + '</span>'
};
var curFilter = 'all', curSearch = '';

function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function render() {
  var h = '', c = 0, q = curSearch.toLowerCase();
  NODES.forEach(function(n) {
    if (curFilter !== 'all' && n.r !== curFilter) return;
    if (q && n.n.toLowerCase().indexOf(q) === -1) return;
    h += '<tr><td>' + esc(n.n) + '</td><td>' + (BADGES[n.r] || BADGES.other) + '</td></tr>';
    c++;
  });
  document.getElementById('tbody').innerHTML = h;
  document.getElementById('empty').style.display = c ? 'none' : 'block';
}

function setFilter(f, btn) {
  curFilter = f;
  document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  render();
}

function setSearch(q) { curSearch = q; render(); }

function doCopy(id, btn) {
  var inp = document.getElementById(id);
  inp.select(); inp.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(inp.value).then(function() {
    var orig = btn.textContent;
    btn.textContent = t('copied'); btn.classList.add('copied');
    var toast = document.getElementById('toast');
    toast.textContent = t('toast');
    toast.classList.add('show');
    setTimeout(function() {
      toast.classList.remove('show');
      btn.textContent = orig; btn.classList.remove('copied');
    }, 1800);
  });
}

function animateCounters() {
  document.querySelectorAll('.stat .num[data-target]').forEach(function(el) {
    var target = parseInt(el.getAttribute('data-target'));
    var dur = 1000, start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  });
}

/* Update counts and node data from backend */
function updateNodesFromBackend(backendNodes) {
  if (!backendNodes || !backendNodes.length) return;
  NODES = backendNodes;

  // Update stat counts
  var counts = { total: 0, jp: 0, us: 0, fr: 0 };
  NODES.forEach(function(n) {
    counts.total++;
    counts[n.r] = (counts[n.r] || 0) + 1;
  });

  // Update data-target attributes on stat numbers
  var statEls = document.querySelectorAll('.stat .num');
  if (statEls[0]) { statEls[0].setAttribute('data-target', counts.total); statEls[0].textContent = counts.total; }
  if (statEls[1]) { statEls[1].setAttribute('data-target', counts.jp); statEls[1].textContent = counts.jp; }
  if (statEls[2]) { statEls[2].setAttribute('data-target', counts.us); statEls[2].textContent = counts.us; }
  if (statEls[3]) { statEls[3].setAttribute('data-target', counts.fr); statEls[3].textContent = counts.fr; }

  // Update filter button counts
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    var label = btn.textContent.replace(/\d+/, '').trim();
    if (label === t('all')) btn.innerHTML = t('all') + '<span class="count">' + counts.total + '</span>';
  });

  render();
}

/* Latency testing UI */
var latencyResults = {};
var isTesting = false;

async function runLatencyUITest() {
  if (isTesting) return;
  isTesting = true;
  var btn = document.getElementById('latencyBtn');
  var origText = btn.innerHTML;
  btn.innerHTML = '<span class="spinner"></span> ' + t('latency_testing');
  btn.disabled = true;

  if (isTauri()) {
    var nodeNames = NODES.filter(function(n) {
      return curFilter === 'all' || n.r === curFilter;
    }).map(function(n) { return n.n; });

    latencyResults = await runLatencyTest(nodeNames) || {};
  } else {
    // In browser mode, we can't do TCP pings
    latencyResults = {};
  }

  // Add latency badges to table rows
  applyLatencyToTable();

  isTesting = false;
  btn.innerHTML = origText;
  btn.disabled = false;
}

function applyLatencyToTable() {
  var rows = document.querySelectorAll('#tbody tr');
  rows.forEach(function(row) {
    var nameCell = row.querySelector('td:first-child');
    if (!nameCell) return;
    var name = nameCell.textContent;
    var ms = latencyResults[name];
    if (ms !== undefined && ms !== null) {
      var cls = ms < 150 ? 'latency-fast' : (ms < 350 ? 'latency-mid' : 'latency-slow');
      nameCell.innerHTML = esc(name) + ' <span class="latency-ms ' + cls + '">' + ms + t('latency_ms') + '</span>';
    } else if (Object.keys(latencyResults).length > 0) {
      nameCell.innerHTML = esc(name) + ' <span class="latency-ms latency-none">' + t('latency_timeout') + '</span>';
    }
  });
}
