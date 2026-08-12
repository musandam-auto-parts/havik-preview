(function () {
  'use strict';

  // Reveal on scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  // Hero 3D floating gold shapes
  const stage = document.getElementById('hero3d');
  if (stage) {
    const count = window.innerWidth < 640 ? 8 : 12;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const isRing = i % 3 === 0;
      el.className = isRing ? 'float-ring' : 'float-orb';
      const size = 12 + Math.random() * 40;
      el.style.width = size + 'px';
      el.style.height = isRing ? size + 'px' : size + 'px';
      el.style.left = 40 + Math.random() * 55 + '%';
      el.style.top = Math.random() * 100 + '%';
      if (isRing) {
        el.style.borderWidth = '0.12em';
        el.style.opacity = 0.55 + Math.random() * 0.3;
      } else {
        el.style.background = i % 2 ? 'rgba(122,95,69,0.5)' : 'rgba(212,169,78,0.5)';
        el.style.opacity = 0.35 + Math.random() * 0.3;
      }
      el.style.animationDuration = 14 + Math.random() * 16 + 's';
      el.style.animationDelay = -Math.random() * 18 + 's';
      stage.appendChild(el);
    }
    stage.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 26;
      const y = (e.clientY / window.innerHeight - 0.5) * 26;
      stage.style.transform = 'rotateY(' + x + 'deg) rotateX(' + -y + 'deg)';
    });
  }

  // Sidebar toggle (desktop collapse)
  const side = document.getElementById('sidebar');
  const sideToggle = document.getElementById('sideToggle');
  if (sideToggle && side) {
    sideToggle.addEventListener('click', () => side.classList.toggle('collapsed'));
  }

  // Mobile menu
  const menuBtn = document.getElementById('menuBtn');
  if (menuBtn && side) {
    menuBtn.addEventListener('click', () => side.classList.toggle('open'));
    side.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => side.classList.remove('open'));
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
})();