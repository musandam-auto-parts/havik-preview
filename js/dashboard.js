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

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const el = document.querySelector(a.getAttribute('href'));
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // Toast
  window.havikToast = function (msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2600);
  };

  // Mobile sidebar
  document.querySelectorAll('[data-sidebar-toggle]').forEach(btn => {
    btn.addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
  });

  // Sidebar nav active (highlight current page)
  const page = document.body.getAttribute('data-page');
  document.querySelectorAll('.side-icon[data-page]').forEach(el => {
    if (el.getAttribute('data-page') === page) el.classList.add('active');
  });

  // Course category filter
  document.querySelectorAll('[data-filter]').forEach(el => {
    el.addEventListener('click', function () {
      document.querySelectorAll('[data-filter]').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      const f = this.getAttribute('data-filter');
      document.querySelectorAll('.course-card').forEach(c => {
        if (f === 'all' || c.getAttribute('data-cat') === f) c.style.display = 'block';
        else c.style.display = 'none';
      });
    });
  });

  // Add buttons (demo)
  document.querySelectorAll('[data-add-course]').forEach(btn => {
    btn.addEventListener('click', function () {
      const name = this.getAttribute('data-add-course');
      havikToast('Enrolled: ' + name);
    });
  });
})();