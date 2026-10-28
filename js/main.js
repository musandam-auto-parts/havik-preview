(function () {
  'use strict';

  // ===== Preloader =====
  var pre = document.getElementById('preloader');
  if (pre) {
    window.addEventListener('load', function () {
      setTimeout(function () { pre.classList.add('done'); }, 450);
    });
    setTimeout(function () { pre.classList.add('done'); }, 2600); // fallback
  }

  // ===== Scroll progress =====
  var bar = document.querySelector('.scroll-progress');
  if (bar) {
    var upd = function () {
      var h = document.documentElement;
      var p = h.scrollTop / (h.scrollHeight - h.clientHeight);
      bar.style.width = (p * 100) + '%';
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
    var parts = [];
    var PCOUNT = window.innerWidth < 640 ? 40 : 90;
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
        var x = p.x + Math.sin(p.wave) * 14;
        ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232,184,75,' + p.a + ')'; ctx.fill();
      });
      requestAnimationFrame(frame);
    })();
  }

  // ===== Hero 3D floating gold shapes =====
  var stage = document.getElementById('hero3d');
  if (stage) {
    var count = window.innerWidth < 640 ? 8 : 12;
    for (var j = 0; j < count; j++) {
      var el = document.createElement('div');
      var isRing = j % 3 === 0;
      el.className = isRing ? 'float-ring' : 'float-orb';
      var size2 = 12 + Math.random() * 40;
      el.style.width = size2 + 'px';
      el.style.height = size2 + 'px';
      el.style.left = 40 + Math.random() * 55 + '%';
      el.style.top = Math.random() * 100 + '%';
      if (isRing) {
        el.style.borderWidth = '0.12em';
        el.style.opacity = 0.5 + Math.random() * 0.3;
      } else {
        el.style.background = j % 2 ? 'rgba(122,95,69,0.45)' : 'rgba(232,184,75,0.4)';
        el.style.opacity = 0.3 + Math.random() * 0.3;
      }
      el.style.animationDuration = 14 + Math.random() * 16 + 's';
      el.style.animationDelay = -Math.random() * 18 + 's';
      stage.appendChild(el);
    }
    stage.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 26;
      var y = (e.clientY / window.innerHeight - 0.5) * 26;
      stage.style.transform = 'rotateY(' + x + 'deg) rotateX(' + -y + 'deg)';
    });
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
        p = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = (Number.isInteger(target) ? Math.round(target * p) : (target * p).toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  // ===== Sidebar toggle (desktop collapse) =====
  var side = document.getElementById('sidebar');
  var sideToggle = document.getElementById('sideToggle');
  if (sideToggle && side) {
    sideToggle.addEventListener('click', function () {
      side.classList.toggle('collapsed');
      var ic = sideToggle.querySelector('i');
      if (ic) ic.classList.toggle('fa-angles-right');
    });
  }

  // ===== Mobile menu =====
  var menuBtn = document.getElementById('menuBtn');
  if (menuBtn && side) {
    menuBtn.addEventListener('click', function () { side.classList.toggle('open'); });
    side.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { side.classList.remove('open'); });
    });
  }

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
})();
