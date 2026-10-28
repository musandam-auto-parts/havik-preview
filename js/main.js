(function () {
  'use strict';

  // ===== Preloader =====
  var pre = document.getElementById('preloader');
  if (pre) {
    window.addEventListener('load', function () {
      setTimeout(function () { pre.classList.add('done'); }, 450);
    });
    setTimeout(function () { pre.classList.add('done'); }, 2600);
  }

  // ===== Scroll progress =====
  var bar = document.querySelector('.scroll-progress');
  if (bar) {
    var upd = function () {
      var h = document.documentElement;
      bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    };
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  // ===== Cursor glow (desktop) =====
  var glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', function (e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

  // ===== Drawer =====
  var drawer = document.getElementById('drawer');
  var overlay = document.getElementById('drawerOverlay');
  var menuBtn = document.getElementById('menuBtn');
  var closeBtn = document.getElementById('drawerClose');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('show');
    document.body.classList.add('drawer-open');
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.classList.remove('drawer-open');
  }
  if (menuBtn) menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });
  document.querySelectorAll('.drawer-link').forEach(function (a) {
    a.addEventListener('click', function () {
      setTimeout(closeDrawer, 250);
    });
  });

  // ===== Active drawer link while scrolling =====
  var sections = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('.drawer-link[data-target]');
  if (sections.length && links.length) {
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('data-target') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { sio.observe(s); });
  }

  // ===== Reveal on scroll =====
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });

  // ===== Hero particles canvas =====
  var canvas = document.getElementById('heroCanvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var PCOUNT = window.innerWidth < 640 ? 40 : 90;
    var parts = [];
    function size() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    size(); window.addEventListener('resize', size);
    for (var i = 0; i < PCOUNT; i++) {
      parts.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: 0.6 + Math.random() * 1.9, s: 0.15 + Math.random() * 0.55,
        a: 0.15 + Math.random() * 0.55, wave: Math.random() * Math.PI * 2
      });
    }
    (function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(function (p) {
        p.y -= p.s; p.wave += 0.02;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        ctx.beginPath(); ctx.arc(p.x + Math.sin(p.wave) * 14, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232,184,75,' + p.a + ')'; ctx.fill();
      });
      requestAnimationFrame(frame);
    })();
  }

  // ===== Animated counters =====
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      var el = en.target;
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var t0 = performance.now(), dur = 1600;
        (function tick(now) {
          var p = Math.min((now - t0) / dur, 1);
          p = 1 - Math.pow(1 - p, 3);
          el.textContent = (Number.isInteger(target) ? Math.round(target * p) : (target * p).toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  // ===== Toast =====
  window.showToast = function (msg) {
    var t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 2800);
  };
})();
