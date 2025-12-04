// app.js
(() => {
  const shortenBtn = document.getElementById('shortenBtn');
  const longUrlInput = document.getElementById('longUrl');
  const resultBox = document.getElementById('result');
  const shortUrlInput = document.getElementById('shortUrl');
  const visitBtn = document.getElementById('visitBtn');
  const copyBtn = document.getElementById('copyBtn');
  const shareBtn = document.getElementById('shareBtn');
  const qrBtn = document.getElementById('qrBtn');
  const qrModal = document.getElementById('qrModal');
  const qrcodeDiv = document.getElementById('qrcode');
  const closeQr = document.getElementById('closeQr');
  const historyModal = document.getElementById('historyModal');
  const viewHistoryBtn = document.getElementById('viewHistoryBtn');
  const historyList = document.getElementById('historyList');
  const closeHistory = document.getElementById('closeHistory');
  const clearHistory = document.getElementById('clearHistory');

  // Auth modal elements
  const signupModal = document.getElementById('signupModal');
  const signinModal = document.getElementById('signinModal');
  const openSignupBtn = document.getElementById('openSignupBtn');
  const openSigninBtn = document.getElementById('openSigninBtn');
  const closeSignup = document.getElementById('closeSignup');
  const closeSignin = document.getElementById('closeSignin');
  const switchToSignin = document.getElementById('switchToSignin');
  const switchToSignup = document.getElementById('switchToSignup');
  const signupBtn = document.getElementById('signupBtn');
  const signinBtn = document.getElementById('signinBtn');

  const API = '/api/shorten';
  const HISTORY_KEY = 'shorturl_history';

  function show(el) { el.classList.remove('hidden'); }
  function hide(el) { el.classList.add('hidden'); }

  // --- AUTH MODAL FUNCTIONS ---
  openSignupBtn.addEventListener('click', () => {
    show(signupModal);
    document.body.style.overflow = 'hidden';
  });

  openSigninBtn.addEventListener('click', () => {
    show(signinModal);
    document.body.style.overflow = 'hidden';
  });

  closeSignup.addEventListener('click', () => {
    hide(signupModal);
    document.body.style.overflow = 'auto';
  });

  closeSignin.addEventListener('click', () => {
    hide(signinModal);
    document.body.style.overflow = 'auto';
  });

  switchToSignin.addEventListener('click', (e) => {
    e.preventDefault();
    hide(signupModal);
    show(signinModal);
  });

  switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    hide(signinModal);
    show(signupModal);
  });

  signupBtn.addEventListener('click', () => {
    alert('Sign-up functionality not implemented yet.');
  });

  signinBtn.addEventListener('click', () => {
    alert('Sign-in functionality not implemented yet.');
  });

  // Close modal on overlay click
  signupModal.addEventListener('click', (e) => {
    if (e.target === signupModal || e.target.classList.contains('auth-modal-overlay')) {
      hide(signupModal);
      document.body.style.overflow = 'auto';
    }
  });

  signinModal.addEventListener('click', (e) => {
    if (e.target === signinModal || e.target.classList.contains('auth-modal-overlay')) {
      hide(signinModal);
      document.body.style.overflow = 'auto';
    }
  });

  // --- Shorten URL ---
  shortenBtn.addEventListener('click', async () => {
    const url = longUrlInput.value.trim();

    if (!url) {
      alert('Please enter a URL (include http:// or https://)');
      return;
    }

    shortenBtn.disabled = true;
    shortenBtn.textContent = 'Shortening...';

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Error shortening URL');
      } else {
        const short = data.shortUrl;
        shortUrlInput.value = short;
        show(resultBox);
        saveHistory(url, short);
      }
    } catch (e) {
      alert('Network error: ' + e.message);
    } finally {
      shortenBtn.disabled = false;
      shortenBtn.textContent = 'Short URL';
    }
  });

  // --- Button actions ---
  visitBtn.addEventListener('click', () => {
    const u = shortUrlInput.value;
    if (u) window.open(u, '_blank');
  });

  copyBtn.addEventListener('click', async () => {
    const u = shortUrlInput.value;
    if (!u) return;
    try {
      await navigator.clipboard.writeText(u);
      copyBtn.textContent = 'Copied';
      setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
    } catch {
      alert('Copy failed. You can manually copy the URL.');
    }
  });

  shareBtn.addEventListener('click', async () => {
    const u = shortUrlInput.value;
    if (!u) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Short URL', text: 'Here is a short link', url: u });
      } catch {
        // cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(u);
        alert('Share not supported – link copied to clipboard.');
      } catch {
        alert('Share not supported and copy failed.');
      }
    }
  });

  qrBtn.addEventListener('click', () => {
    const u = shortUrlInput.value;
    if (!u) return;
    qrcodeDiv.innerHTML = '';
    new QRCode(qrcodeDiv, { text: u, width: 200, height: 200 });
    show(qrModal);
  });

  closeQr.addEventListener('click', () => hide(qrModal));

  // --- History (LocalStorage) ---
  function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveHistoryItem(item) {
    const list = loadHistory();
    list.unshift(item);
    if (list.length > 50) list.splice(50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  }

  function saveHistory(original, short) {
    const item = { original, short, when: new Date().toISOString() };
    saveHistoryItem(item);
  }

  function renderHistory() {
    const list = loadHistory();
    historyList.innerHTML = '';
    if (list.length === 0) {
      historyList.innerHTML = '<div style="padding:8px;color:#666">No history yet.</div>';
      return;
    }
    list.forEach(it => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <div style="flex:1;">
          <div style="font-size:13px; color:#333">${it.original}</div>
          <a href="${it.short}" target="_blank">${it.short}</a>
        </div>
        <div style="display:flex;gap:8px; align-items:center;">
          <button class="btn small copy-history">Copy</button>
          <button class="btn small ghost delete-history">Del</button>
        </div>
      `;
      const copyBtn = div.querySelector('.copy-history');
      const delBtn = div.querySelector('.delete-history');

      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(it.short);
          copyBtn.textContent = 'Copied';
          setTimeout(() => (copyBtn.textContent = 'Copy'), 1000);
        } catch {
          alert('Copy failed');
        }
      };

      delBtn.onclick = () => {
        const arr = loadHistory().filter(
          x => x.short !== it.short || x.when !== it.when
        );
        localStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
        renderHistory();
      };

      historyList.appendChild(div);
    });
  }

  viewHistoryBtn.addEventListener('click', () => {
    renderHistory();
    show(historyModal);
  });

  closeHistory.addEventListener('click', () => hide(historyModal));

  clearHistory.addEventListener('click', () => {
    if (confirm('Clear history?')) {
      localStorage.removeItem(HISTORY_KEY);
      renderHistory();
    }
  });

  // --- Close modals on outside click ---
  window.addEventListener('click', e => {
    if (e.target === qrModal) hide(qrModal);
    if (e.target === historyModal) hide(historyModal);
  });
})();