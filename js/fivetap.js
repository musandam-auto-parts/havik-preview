(function () {
  'use strict';

  var IMG = 'images/fivetap.jpg';
  var WINDOW_MS = 1400;
  var taps = [];
  var overlay = null;
  var imgEl = null;

  function injectStyle() {
    if (document.getElementById('ft-style')) return;
    var css = ''
      + '.ft-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;'
      + 'background:rgba(5,3,1,.88);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);'
      + 'opacity:0;visibility:hidden;transition:opacity .35s ease,visibility .35s ease;padding:24px;}'
      + '.ft-overlay.show{opacity:1;visibility:visible;}'
      + '.ft-overlay img{max-width:min(86vw,520px);max-height:80vh;border-radius:18px;border:1px solid rgba(232,184,75,.55);'
      + 'box-shadow:0 30px 90px rgba(0,0,0,.75),0 0 60px rgba(232,184,75,.28);'
      + 'transform:scale(.86) translateY(16px);transition:transform .45s cubic-bezier(.2,.9,.25,1.15);}'
      + '.ft-overlay.show img{transform:scale(1) translateY(0);}'
      + '.ft-close{position:absolute;top:18px;right:18px;width:44px;height:44px;border-radius:50%;'
      + 'border:1px solid rgba(232,184,75,.4);background:rgba(20,14,8,.7);color:#e8b84b;font-size:1.1rem;'
      + 'cursor:pointer;display:flex;align-items:center;justify-content:center;}'
      + '.ft-close:hover{background:rgba(232,184,75,.15);}'
      + 'body.ft-lock{overflow:hidden;}';
    var st = document.createElement('style');
    st.id = 'ft-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function build() {
    injectStyle();
    overlay = document.createElement('div');
    overlay.className = 'ft-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Secret');

    var btn = document.createElement('button');
    btn.className = 'ft-close';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Close');
    btn.innerHTML = '&times;';

    imgEl = document.createElement('img');
    imgEl.src = IMG;
    imgEl.alt = '';
    imgEl.decoding = 'async';
    imgEl.loading = 'eager';

    overlay.appendChild(btn);
    overlay.appendChild(imgEl);
    document.body.appendChild(overlay);

    function close() {
      overlay.classList.remove('show');
      document.body.classList.remove('ft-lock');
    }
    btn.addEventListener('click', function (e) { e.stopPropagation(); close(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function show() {
    if (!overlay) build();
    overlay.classList.add('show');
    document.body.classList.add('ft-lock');
    if (navigator.vibrate) { try { navigator.vibrate(30); } catch (e) {} }
  }

  document.addEventListener('pointerdown', function () {
    if (overlay && overlay.classList.contains('show')) return;
    var now = Date.now();
    taps = taps.filter(function (t) { return now - t < WINDOW_MS; });
    taps.push(now);
    if (taps.length >= 5) {
      taps = [];
      show();
    }
  }, { passive: true });
})();
