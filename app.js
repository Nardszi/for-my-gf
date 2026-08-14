(function() {
  'use strict';

  var PAGE = location.pathname.split('/').pop() || 'lovepage.html';
  var YOUR_NAME = 'Nard';
  var HER_NAME = 'Rezil';
  var START_DATE = '2024-09-10';

  var storageOk = false;
  try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); storageOk = true; } catch (e) {}

  /* ---------------- global dark mode ---------------- */
  var THEME_KEY = 'forMyGf_theme';
  function getSavedTheme() {
    if (!storageOk) return null;
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(current);
    if (storageOk) {
      try { localStorage.setItem(THEME_KEY, current); } catch (e) {}
    }
  }
  window.toggleTheme = toggleTheme;
  window.getTheme = function() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; };
  var savedTheme = getSavedTheme();
  if (savedTheme) applyTheme(savedTheme);

  /* ---------------- auto-create theme toggle button ---------------- */
  function syncToggleIcon(iconEl) {
    if (iconEl) iconEl.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
  }
  function createThemeToggle() {
    if (document.getElementById('globalThemeToggle')) return;
    var btn = document.getElementById('themeToggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'globalThemeToggle';
      btn.setAttribute('aria-label', 'Toggle dark and light theme');
      btn.style.cssText = 'position:fixed;top:1rem;right:1rem;z-index:99999;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,143,171,0.4);background:rgba(26,15,20,0.85);backdrop-filter:blur(8px);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.1rem;transition:all 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
      btn.innerHTML = '<span id="globalThemeIcon">☀️</span>';
      btn.addEventListener('mouseenter', function() { btn.style.transform = 'scale(1.1) rotate(10deg)'; });
      btn.addEventListener('mouseleave', function() { btn.style.transform = 'scale(1) rotate(0deg)'; });
      document.body.appendChild(btn);
    }
    btn.addEventListener('click', function() {
      toggleTheme();
      syncToggleIcon(document.getElementById('globalThemeIcon'));
      syncToggleIcon(document.getElementById('themeIcon'));
    });
    syncToggleIcon(document.getElementById('globalThemeIcon'));
    syncToggleIcon(document.getElementById('themeIcon'));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createThemeToggle);
  } else {
    createThemeToggle();
  }

  /* ---------------- light mode overrides for dark-only pages ---------------- */
  function injectThemeStyles() {
    if (document.getElementById('globalThemeStyles')) return;
    var st = document.createElement('style');
    st.id = 'globalThemeStyles';
    st.textContent =
      'html:not([data-theme="dark"]) body {' +
      '  background:#fff9f5 !important; color:#3d3a38 !important;' +
      '}' +
      'html:not([data-theme="dark"]) .bg-fade {' +
      '  background:radial-gradient(1200px 600px at 50% -10%, rgba(232,165,169,0.25), transparent 60%),linear-gradient(180deg,#fff5ef,#fce8e8) !important;' +
      '}' +
      'html:not([data-theme="dark"]) .topbar { background:linear-gradient(180deg, rgba(255,249,245,0.92), rgba(255,249,245,0)) !important; }' +
      'html:not([data-theme="dark"]) .topbar a,' +
      'html:not([data-theme="dark"]) .btn,' +
      'html:not([data-theme="dark"]) .composer,' +
      'html:not([data-theme="dark"]) .panel,' +
      'html:not([data-theme="dark"]) .card,' +
      'html:not([data-theme="dark"]) .fun,' +
      'html:not([data-theme="dark"]) .under-card,' +
      'html:not([data-theme="dark"]) .board,' +
      'html:not([data-theme="dark"]) .entry,' +
      'html:not([data-theme="dark"]) .scratch-card {' +
      '  color:#3d3a38 !important;' +
      '}' +
      'html:not([data-theme="dark"]) input, html:not([data-theme="dark"]) textarea {' +
      '  color:#3d3a38 !important; background:rgba(255,255,255,0.85) !important;' +
      '}' +
      'html:not([data-theme="dark"]) .sub,' +
      'html:not([data-theme="dark"]) .hint,' +
      'html:not([data-theme="dark"]) .stat .lab,' +
      'html:not([data-theme="dark"]) .counter,' +
      'html:not([data-theme="dark"]) .hero-sub,' +
      'html:not([data-theme="dark"]) .hero-eyebrow {' +
      '  color:rgba(61,58,56,0.65) !important;' +
      '}' +
      'html:not([data-theme="dark"]) .topbar .brand { color:#c98a8f !important; }';
    document.head.appendChild(st);
  }
  injectThemeStyles();

  /* ---------------- PWA ---------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').catch(function() {});
    });
  }

  /* ---------------- silent analytics ---------------- */
  var VISIT_KEY = 'forMyGf_visits';
  function readVisits() {
    try { return JSON.parse(localStorage.getItem(VISIT_KEY)) || defaultVisits(); }
    catch (e) { return defaultVisits(); }
  }
  function defaultVisits() {
    return { count: 0, first: null, last: null, totalMs: 0, list: [] };
  }
  function writeVisits(v) { try { localStorage.setItem(VISIT_KEY, JSON.stringify(v)); } catch (e) {} }
  var sessionStart = Date.now();
  function recordVisit(leave) {
    if (!storageOk) return;
    if (PAGE === 'visitors.html') return;
    var v = readVisits();
    v.count = (v.count || 0) + 1;
    var now = new Date().toISOString();
    if (!v.first) v.first = now;
    v.last = now;
    if (!leave) {
      v.list.push({ t: now, p: PAGE });
      if (v.list.length > 500) v.list = v.list.slice(-500);
    } else {
      v.totalMs = (v.totalMs || 0) + Math.max(0, Date.now() - sessionStart);
    }
    writeVisits(v);
  }
  recordVisit(false);
  window.addEventListener('beforeunload', function() { recordVisit(true); });
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') recordVisit(true);
    else if (document.visibilityState === 'visible') sessionStart = Date.now();
  });

  /* ---------------- easter egg: type "rezil" -> heart rain ---------------- */
  var heartRainActive = false;
  var heartSeq = '';
  function heartRain() {
    if (heartRainActive) return;
    heartRainActive = true;
    var layer = document.createElement('div');
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:90000;overflow:hidden;';
    document.body.appendChild(layer);
    var colors = ['#ff8fab', '#ff5d8f', '#e0567c', '#e8c17e', '#ffd3e0', '#ff9ec4'];
    var iv = setInterval(function() {
      for (var k = 0; k < 3; k++) {
        var h = document.createElement('div');
        h.textContent = Math.random() < 0.5 ? '\u2665' : '\u2661';
        h.style.cssText = 'position:absolute;font-size:' + (14 + Math.random() * 24) + 'px;color:' + colors[Math.floor(Math.random() * colors.length)] + ';left:' + (Math.random() * 100) + 'vw;top:-40px;opacity:' + (0.55 + Math.random() * 0.45) + ';will-change:transform;';
        layer.appendChild(h);
        (function(el) {
          var t = 3200 + Math.random() * 2600;
          var st = Date.now();
          var sway = Math.random() * 60 - 30;
          (function fall() {
            var p = Math.min(1, (Date.now() - st) / t);
            el.style.transform = 'translate(' + (sway * p) + 'px,' + (window.innerHeight * 1.25 * p) + 'px) rotate(' + (p * 320) + 'deg)';
            if (p < 1) requestAnimationFrame(fall); else el.remove();
          })();
        })(h);
      }
    }, 170);
    setTimeout(function() {
      clearInterval(iv);
      setTimeout(function() { layer.remove(); heartRainActive = false; }, 3600);
    }, 5200);
  }
  document.addEventListener('keydown', function(e) {
    if (e.key && e.key.length === 1) {
      heartSeq = (heartSeq + e.key.toLowerCase()).slice(-10);
      if (heartSeq.indexOf('rezil') !== -1) { heartSeq = ''; heartRain(); }
    }
  });
  document.addEventListener('touchstart', function() { if (heartSeq) heartSeq = ''; }, { passive: true });

  

  /* ---------------- share card ---------------- */
  window.openShareCard = function() {
    if (document.getElementById('shareCardEl')) return;
    var card = document.createElement('div');
    card.id = 'shareCardEl';
    card.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(0.9);z-index:92000;background:rgba(26,15,20,0.97);border:1px solid rgba(255,143,171,0.4);border-radius:22px;padding:1.7rem 1.4rem;text-align:center;max-width:300px;width:90vw;box-shadow:0 22px 70px rgba(0,0,0,0.65);opacity:0;transition:opacity 0.3s ease,transform 0.3s cubic-bezier(0.34,1.56,0.64,1);';
    card.innerHTML =
      '<div style="font-size:2.2rem;margin-bottom:0.5rem;">\uD83D\uDC8C</div>' +
      '<div style="font-family:Georgia,serif;font-size:1.1rem;color:#fff7ee;line-height:1.45;">Every love story is beautiful,</div>' +
      '<div style="font-family:Georgia,serif;font-size:1.1rem;color:#fff7ee;line-height:1.45;">but ours is my favorite.</div>' +
      '<div style="font-family:Georgia,serif;font-size:1.35rem;color:#ff8fab;margin:0.7rem 0 1rem;font-style:italic;">made with all my love, Nard</div>' +
      '<button id="shareCardBtn" style="background:linear-gradient(135deg,#ff8fab,#e0567c);border:none;color:#fff;padding:0.65rem 1.4rem;border-radius:999px;font-size:0.9rem;cursor:pointer;width:100%;font-family:inherit;">Share our story</button>' +
      '<button id="shareCardClose" style="background:transparent;border:none;color:rgba(255,247,238,0.6);margin-top:0.7rem;font-size:0.8rem;cursor:pointer;width:100%;font-family:inherit;">close</button>';
    document.body.appendChild(card);
    setTimeout(function() { card.style.opacity = '1'; card.style.transform = 'translate(-50%,-50%) scale(1)'; }, 20);
    document.getElementById('shareCardBtn').addEventListener('click', function() {
      var url = location.href;
      var text = 'Every love story is beautiful, but ours is my favorite \uD83E\uDD70 — made with all my love, Nard';
      if (navigator.share) {
        navigator.share({ title: 'Our Love Story', text: text, url: url }).catch(function() {});
      } else {
        var ta = document.createElement('textarea');
        ta.value = text + ' ' + url;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        ta.remove();
        var b = document.getElementById('shareCardBtn');
        b.textContent = 'Link copied!';
        setTimeout(function() { b.textContent = 'Share our story'; }, 1800);
      }
    });
    document.getElementById('shareCardClose').addEventListener('click', closeShareCard);
    card.addEventListener('click', function(e) { if (e.target === card) closeShareCard(); });
  };
  function closeShareCard() {
    var c = document.getElementById('shareCardEl');
    if (c) { c.style.opacity = '0'; setTimeout(function() { c.remove(); }, 300); }
  }
  window.closeShareCard = closeShareCard;

  /* ---------------- anniversary notification ---------------- */
  var ANNIV_MONTH = 8, ANNIV_DAY = 10;
  function checkAnniversary() {
    var now = new Date();
    if (now.getMonth() !== ANNIV_MONTH || now.getDate() !== ANNIV_DAY) return;
    var key = 'forMyGf_lastAnnivNotif';
    var today = now.toLocaleDateString();
    var last = null;
    try { last = localStorage.getItem(key); } catch (e) {}
    if (last === today) return;
    try {
      var n = new Notification('Happy Anniversary \uD83E\uDD70', {
        body: 'Another year of us, my love. Forever isn\u2019t long enough. \u2014 Nard',
        icon: 'icons/icon-192.png'
      });
      setTimeout(function() { try { n.close(); } catch (e) {} }, 7000);
      try { localStorage.setItem(key, today); } catch (e) {}
    } catch (e) {}
  }
  if ('Notification' in window && storageOk) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        if (Notification.permission === 'default' && PAGE === 'finale.html') {
          Notification.requestPermission().then(function(p) {
            if (p === 'granted') checkAnniversary();
          }).catch(function() {});
        } else if (Notification.permission === 'granted') {
          checkAnniversary();
        }
      }, 3500);
    });
  }

  /* ---------------- days until forever (50 years) ---------------- */
  window.daysUntilForever = function() {
    try {
      var start = new Date(START_DATE + 'T00:00:00');
      var now = new Date();
      var elapsed = Math.max(1, Math.floor((now - start) / 86400000));
      var forever = 365 * 50;
      return Math.max(0, forever - elapsed);
    } catch (e) { return 0; }
  };
  window.DATE_RANGE = { YOUR_NAME: YOUR_NAME, HER_NAME: HER_NAME, START_DATE: START_DATE };

  /* ---------------- scroll-triggered fireflies ---------------- */
  window.initFireflies = function() {
    if (document.getElementById('fireflyLayer')) return;
    var layer = document.createElement('div');
    layer.id = 'fireflyLayer';
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:76000;overflow:hidden;';
    document.body.appendChild(layer);
    var flies = [];
    var colors = ['#ffe9a8', '#ffd3a0', '#f6ffc9', '#ffb86b'];
    for (var i = 0; i < 16; i++) {
      var f = document.createElement('div');
      f.style.cssText = 'position:absolute;width:' + (3 + Math.random() * 4) + 'px;height:' + (3 + Math.random() * 4) + 'px;border-radius:50%;background:' + colors[i % colors.length] + ';box-shadow:0 0 14px 4px rgba(255,220,150,0.5);opacity:0;left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;transition:opacity 1.2s ease;';
      layer.appendChild(f);
      flies.push({ el: f, x: Math.random() * 100, y: Math.random() * 100, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5, phase: Math.random() * Math.PI * 2 });
    }
    var visible = false;
    var lastY = window.scrollY;
    window.addEventListener('scroll', function() {
      var dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      if (dy > 6 && !visible) { visible = true; flies.forEach(function(fl) { fl.el.style.opacity = '0.85'; }); }
      else if (dy <= 6 && visible) { visible = false; flies.forEach(function(fl) { fl.el.style.opacity = '0'; }); }
    }, { passive: true });
    (function flyLoop() {
      flies.forEach(function(fl) {
        fl.phase += 0.02;
        fl.x += fl.vx + Math.sin(fl.phase) * 0.14;
        fl.y += fl.vy + Math.cos(fl.phase * 0.7) * 0.11;
        if (fl.x < 0) fl.x = 100; if (fl.x > 100) fl.x = 0;
        if (fl.y < 0) fl.y = 100; if (fl.y > 100) fl.y = 0;
        fl.el.style.left = fl.x + '%';
        fl.el.style.top = fl.y + '%';
        fl.el.style.transform = 'scale(' + (0.8 + Math.sin(fl.phase * 2) * 0.4) + ')';
      });
      requestAnimationFrame(flyLoop);
    })();
  };

  /* ---------------- hold-to-feel-a-heartbeat ---------------- */
  window.attachHeartbeat = function(el) {
    if (!el || el.getAttribute('data-heartbeat')) return;
    el.setAttribute('data-heartbeat', '1');
    var timer = null;
    var beat = function() { try { navigator.vibrate([90, 60, 90, 60, 180]); } catch (e) {} };
    var start = function() { timer = setTimeout(beat, 430); };
    var clear = function() { if (timer) { clearTimeout(timer); timer = null; } };
    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchmove', clear, { passive: true });
    el.addEventListener('touchend', clear);
    el.addEventListener('touchcancel', clear);
    el.addEventListener('mousedown', start);
    el.addEventListener('mouseup', clear);
    el.addEventListener('mouseleave', clear);
  };

  /* ---------------- scroll progress ribbon ---------------- */
  function initScrollRibbon() {
    if (document.getElementById('scrollRibbon')) return;
    var ribbon = document.createElement('div');
    ribbon.id = 'scrollRibbon';
    ribbon.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0%;z-index:99998;background:linear-gradient(90deg,#e0567c,#ff8fab,#e8c17e);box-shadow:0 0 8px rgba(255,143,171,0.6);transition:width 0.1s linear;pointer-events:none;border-radius:0 2px 2px 0;';
    document.body.appendChild(ribbon);
    window.addEventListener('scroll', function() {
      var doc = document.documentElement;
      var total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) { ribbon.style.width = '0%'; return; }
      var pct = (window.scrollY / total) * 100;
      ribbon.style.width = pct + '%';
    }, { passive: true });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollRibbon);
  } else {
    initScrollRibbon();
  }

  /* ---------------- 3D tilt on hover for cards ---------------- */
  window.initTilt = function(selector) {
    var els = document.querySelectorAll(selector || '.time-card,.dream-card,.note-card,.extras-card,.card,.big-card,.timeline-entry,.game-card');
    els.forEach(function(el) {
      if (el.getAttribute('data-tilt')) return;
      el.setAttribute('data-tilt', '1');
      el.style.transformStyle = 'preserve-3d';
      el.style.willChange = 'transform';
      el.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease';
      function onMove(cx, cy) {
        var rect = el.getBoundingClientRect();
        var x = (cx - rect.left) / rect.width - 0.5;
        var y = (cy - rect.top) / rect.height - 0.5;
        el.style.transform = 'perspective(600px) rotateY(' + (x * 14) + 'deg) rotateX(' + (-y * 14) + 'deg) scale3d(1.03,1.03,1.03)';
        el.style.boxShadow = '0 ' + (12 + Math.abs(y) * 14) + 'px ' + (30 + Math.abs(x) * 20) + 'px rgba(201,138,143,0.28)';
      }
      function onLeave() {
        el.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
        el.style.boxShadow = '';
        el.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease';
        setTimeout(function() { el.style.transition = 'transform 0.12s ease, box-shadow 0.12s ease'; }, 400);
      }
      el.addEventListener('mousemove', function(e) { onMove(e.clientX, e.clientY); });
      el.addEventListener('mouseleave', onLeave);
      el.addEventListener('touchmove', function(e) {
        var t = e.touches[0];
        if (t) onMove(t.clientX, t.clientY);
      }, { passive: true });
      el.addEventListener('touchend', onLeave);
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { window.initTilt(); });
  } else {
    setTimeout(function() { window.initTilt(); }, 400);
  }

  /* ---------------- magnetic buttons ---------------- */
  window.initMagneticBtns = function(selector) {
    var btns = document.querySelectorAll(selector || 'button.extras-share-btn,.replay-btn,.mini-btn,.add,.btn,button.share');
    btns.forEach(function(btn) {
      if (btn.getAttribute('data-magnet')) return;
      btn.setAttribute('data-magnet', '1');
      var rect, ox = 0, oy = 0;
      btn.addEventListener('mouseenter', function() {
        rect = btn.getBoundingClientRect();
        btn.style.transition = 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)';
      });
      btn.addEventListener('mousemove', function(e) {
        if (!rect) return;
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * 0.32;
        var dy = (e.clientY - cy) * 0.32;
        btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
        btn.style.transform = 'translate(0,0)';
        rect = null;
      });
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { window.initMagneticBtns(); });
  } else {
    setTimeout(function() { window.initMagneticBtns(); }, 500);
  }

  /* ---------------- typewriter for hero tagline ---------------- */
  window.initHeroTypewriter = function(selector, delay) {
    var el = document.querySelector(selector || '.hero-tagline');
    if (!el || el.getAttribute('data-typed')) return;
    el.setAttribute('data-typed', '1');
    var text = el.textContent.trim();
    el.textContent = '';
    el.style.opacity = '1';
    el.style.transform = 'none';
    var i = 0;
    var cursor = document.createElement('span');
    cursor.style.cssText = 'display:inline-block;width:2px;height:1em;background:currentColor;vertical-align:-0.1em;margin-left:1px;animation:twCaret 0.7s steps(1) infinite;opacity:0.7;';
    var styleId = 'twCaretStyle';
    if (!document.getElementById(styleId)) {
      var s = document.createElement('style');
      s.id = styleId;
      s.textContent = '@keyframes twCaret{0%,49%{opacity:1}50%,100%{opacity:0}}';
      document.head.appendChild(s);
    }
    function type() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        el.appendChild(cursor);
        i++;
        setTimeout(type, 38 + Math.random() * 22);
      } else {
        setTimeout(function() { try { cursor.remove(); } catch(e){} }, 1800);
      }
    }
    setTimeout(type, delay || 800);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { window.initHeroTypewriter(); });
  } else {
    setTimeout(function() { window.initHeroTypewriter(); }, 300);
  }

  /* ---------------- ambient always-on particles ---------------- */
  window.initAmbientParticles = function() {
    if (document.getElementById('ambientParticles')) return;
    var layer = document.createElement('div');
    layer.id = 'ambientParticles';
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1;overflow:hidden;';
    document.body.appendChild(layer);
    var colors = ['rgba(255,143,171,0.45)', 'rgba(232,193,126,0.35)', 'rgba(255,211,224,0.4)', 'rgba(255,93,143,0.3)'];
    var particles = [];
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    document.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    for (var i = 0; i < 22; i++) {
      var p = document.createElement('div');
      var size = 3 + Math.random() * 5;
      p.style.cssText = 'position:absolute;border-radius:50%;width:' + size + 'px;height:' + size + 'px;background:' + colors[i % colors.length] + ';box-shadow:0 0 ' + (size * 3) + 'px ' + size + 'px ' + colors[i % colors.length] + ';will-change:transform;';
      layer.appendChild(p);
      particles.push({
        el: p,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.012
      });
    }
    (function tick() {
      particles.forEach(function(p) {
        p.phase += p.speed;
        var pull = 0.00006;
        p.vx += (mx - p.x) * pull + Math.sin(p.phase) * 0.08;
        p.vy += (my - p.y) * pull + Math.cos(p.phase * 0.7) * 0.08;
        p.vx *= 0.97; p.vy *= 0.97;
        p.x += p.vx; p.y += p.vy;
        var W = window.innerWidth, H = window.innerHeight;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
        p.el.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px) scale(' + (0.7 + Math.sin(p.phase * 2) * 0.3) + ')';
      });
      requestAnimationFrame(tick);
    })();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { window.initAmbientParticles(); });
  } else {
    window.initAmbientParticles();
  }

  /* ---------------- karaoke-style word highlight ---------------- */
  window.attachKaraoke = function(el, text, getPlaying) {
    if (!el) return;
    var timer = null;
    var idx = 0;
    function words() { return text.split(/\s+/); }
    function render() {
      var arr = words();
      var html = '';
      for (var i = 0; i < arr.length; i++) {
        var w = arr[i].replace(/[\u2014\u2026.,!?;:\-]/g, '');
        if (i <= idx) {
          html += '<span class="karaoke-live">' + w + '</span> ';
        } else {
          html += '<span class="karaoke-dim">' + w + '</span> ';
        }
      }
      el.innerHTML = html.trim();
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function tick() {
      if (!getPlaying()) { stop(); return; }
      if (idx >= words().length - 1) { stop(); return; }
      idx += 2;
      render();
    }
    window.addEventListener('karaokeStart', function() {
      if (timer) return;
      idx = 0;
      render();
      timer = setInterval(tick, 650);
    });
    window.addEventListener('karaokeStop', stop);
    if (getPlaying()) {
      setTimeout(function() {
        window.dispatchEvent(new Event('karaokeStart'));
      }, 100);
    }
  };
})();
