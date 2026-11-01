(function () {
  'use strict';

  var grid = document.getElementById('bookGrid');
  if (!grid) return;

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function card(book, index) {
    var url = book.url || '#';
    var icon = book.icon || 'fa-book-open';
    var num = pad(index + 1);
    var note = book.note ? '<p class="book-note">' + esc(book.note) + '</p>' : '<p class="book-note"></p>';
    return '' +
      '<a class="book" data-reveal href="' + esc(url) + '"' + (book.hosted === false || /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : '') + '>' +
        '<span class="book-num">' + num + '</span>' +
        '<div class="book-cover"><i class="fas ' + esc(icon) + '"></i></div>' +
        '<div class="book-meta">' +
          '<span class="book-tag">' + esc(book.tag || 'Library') + '</span>' +
          '<h3>' + esc(book.title) + '</h3>' +
          '<p class="book-author">' + esc(book.author || '') + '</p>' +
          note +
          '<div class="book-meta-row"><span>' + esc(book.format || 'PDF') + '</span><span>' + esc(book.year || '') + '</span></div>' +
        '</div>' +
      '</a>';
  }

  fetch('data/books.json?v=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error('no data'); return r.json(); })
    .then(function (data) {
      var books = (data && data.books) || [];
      if (!books.length) return;
      grid.innerHTML = books.map(card).join('');
      if (window.refreshReveals) window.refreshReveals();
    })
    .catch(function () {
      /* static cards already in the HTML act as fallback */
    });
})();
