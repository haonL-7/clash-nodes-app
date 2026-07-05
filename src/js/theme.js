/* ── Theme ── */
(function() {
  var saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

function toggleTheme() {
  var el = document.documentElement;
  var cur = el.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  el.setAttribute('data-theme', cur);
  localStorage.setItem('theme', cur);
}
