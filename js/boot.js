/* js/boot.js — safety net: visible error banner + crash-proof charts */
window.addEventListener('error', function (e) {
  var b = document.getElementById('js-error-banner');
  if (!b) {
    b = document.createElement('div');
    b.id = 'js-error-banner';
    b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;background:#7f1d1d;color:#fff;padding:10px 14px;border-radius:10px;font:12px Consolas,monospace;white-space:pre-wrap;max-height:35vh;overflow:auto;border:1px solid #f87171';
    document.body.appendChild(b);
  }
  b.textContent += '⚠ ' + (e.message || 'Script error') + ' → ' + (e.filename || '').split('/').pop() + ':' + e.lineno + '\n';
});
if (typeof window.$ !== 'function') window.$ = function (id) { return document.getElementById(id); };
if (typeof window.charts === 'undefined') window.charts = {};