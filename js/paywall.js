(function () {
  'use strict';

  var UPI_ID = 'vineet-327@ptyes';
  var PRICE = 100;
  var STORE = 'vineet_unlocked_pdfs';

  function getUnlocked() {
    try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch (e) { return []; }
  }

  function saveUnlocked(list) {
    try { localStorage.setItem(STORE, JSON.stringify(list)); } catch (e) {}
  }

  function upiLink(name, note) {
    // Build UPI payment intent link (works with GPay/PhonePe/BHIM/Paytm)
    return 'upi://pay?pa=' + encodeURIComponent(UPI_ID) +
      '&pn=' + encodeURIComponent('VINEET') +
      '&am=' + PRICE +
      '&cu=INR' +
      '&tn=' + encodeURIComponent(note || 'VINEET Resources');
  }

  // Build modal once
  var modal = document.getElementById('payModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'payModal';
    modal.className = 'pay-modal';
    modal.innerHTML =
      '<div class="pay-card">' +
        '<button class="pay-close" id="payClose"><i class="fas fa-xmark"></i></button>' +
        '<div class="pay-head"><i class="fas fa-lock"></i><h3 id="payTitle">Locked Document</h3></div>' +
        '<p class="pay-desc">This document is locked. Pay <b>₹' + PRICE + '</b> to unlock and access it anytime.</p>' +
        '<div class="pay-price"><span>₹' + PRICE + '</span><small>one-time</small></div>' +
        '<a id="payBtn" class="btn btn-solid btn-lg" target="_blank" rel="noopener" style="width:100%;justify-content:center;">' +
          '<i class="fas fa-qrcode"></i> Pay ₹' + PRICE + ' via UPI</a>' +
        '<button id="payDone" class="btn btn-outline btn-lg" style="width:100%;justify-content:center;margin-top:10px;">' +
          '<i class="fas fa-circle-check"></i> I Have Paid — Unlock</button>' +
        '<p class="pay-note"><i class="fas fa-circle-info"></i> Pay using any UPI app (GPay / PhonePe / Paytm / BHIM). After payment tap "I Have Paid" to open the document.</p>' +
      '</div>';
    document.body.appendChild(modal);
    document.getElementById('payClose').addEventListener('click', function () {
      modal.classList.remove('open');
    });
    document.getElementById('payDone').addEventListener('click', function () {
      var pdf = modal.getAttribute('data-pdf');
      if (!pdf) return;
      var list = getUnlocked();
      if (list.indexOf(pdf) === -1) list.push(pdf);
      saveUnlocked(list);
      showToast('Unlocked! Opening document...');
      modal.classList.remove('open');
      setTimeout(function () { window.open(pdf, '_blank'); }, 600);
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  // Existing unlocked links/pages keep working (no lock on those)
  function isUnlocked(pdf) { return getUnlocked().indexOf(pdf) !== -1; }

  // Attach lock to resource links
  document.querySelectorAll('[data-locked]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var pdf = link.getAttribute('data-locked');
      if (!pdf) return;
      if (isUnlocked(pdf)) return; // already paid — allow normal open
      e.preventDefault();
      modal.setAttribute('data-pdf', pdf);
      var title = link.getAttribute('data-title') || 'Document';
      document.getElementById('payTitle').textContent = title;
      document.getElementById('payBtn').href = upiLink(title);
      modal.classList.add('open');
    });
  });

  function showToast(msg) {
    var t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 2800);
  }
})();