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

  /* ---------------- tiny pet cat ---------------- */
  var pet = document.createElement('div');
  pet.id = 'tinyPet';
  pet.textContent = '\uD83D\uDC31';
  pet.setAttribute('aria-hidden', 'true');
  pet.style.cssText = 'position:fixed;z-index:80000;pointer-events:none;font-size:26px;left:-60px;top:-60px;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.4));transition:none;';
  document.body.appendChild(pet);
  var petX = -60, petY = -60;
  document.addEventListener('mousemove', function(e) { petX = e.clientX; petY = e.clientY; });
  document.addEventListener('touchmove', function(e) {
    var t = e.touches && e.touches[0];
    if (t) { petX = t.clientX; petY = t.clientY; }
  }, { passive: true });
  (function petLoop() {
    var curX = parseFloat(pet.style.left) || -60;
    var curY = parseFloat(pet.style.top) || -60;
    var nx = curX + (petX - curX) * 0.16;
    var ny = curY + (petY - curY) * 0.16 + Math.sin(Date.now() / 260) * 1.4;
    pet.style.left = nx + 'px';
    pet.style.top = ny + 'px';
    var flip = petX < curX ? -1 : 1;
    pet.style.transform = 'scaleX(' + flip + ') scaleY(1) rotate(' + Math.sin(Date.now() / 380) * 4 + 'deg)';
    requestAnimationFrame(petLoop);
  })();
  document.addEventListener('click', function() {
    pet.style.transition = 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)';
    pet.style.transform = 'scaleX(1) scale(1.35) rotate(12deg)';
    setTimeout(function() { pet.style.transform = 'scaleX(1) scale(1) rotate(0deg)'; pet.style.transition = 'none'; }, 220);
  });

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
