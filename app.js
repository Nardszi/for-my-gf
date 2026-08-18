(function() {
  'use strict';

  document.documentElement.setAttribute('data-theme', 'dark');
  try { localStorage.removeItem('forMyGf_theme'); } catch(e) {}

  var PAGE = location.pathname.split('/').pop() || 'lovepage.html';
  var YOUR_NAME = 'Nard';
  var HER_NAME = 'Rezil';
  var START_DATE = '2024-09-10';

  var storageOk = false;
  try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); storageOk = true; } catch (e) {}

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
    ribbon.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0%;z-index:99998;background:linear-gradient(90deg,#e0567c,#ff8fab,#e8c17e);box-shadow:0 0 8px rgba(255,143,171,0.6);transition:width 0.1s linear;pointer-events:none;touch-action:none;border-radius:0 2px 2px 0;';
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
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none !important;z-index:1;overflow:hidden;touch-action:none;';
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

  /* ---- 3:33 AM MIDNIGHT MODE ---- */
  (function(){
    var now=new Date();
    var h=now.getHours();
    var m=now.getMinutes();
    if(h===3&&m>=30&&m<=36){
      var style=document.createElement('style');
      style.textContent=''+
        'body::before{content:"";position:fixed;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(100,120,200,0.15),transparent 70%);pointer-events:none;z-index:99999}'+
        '.page,.page-container,.screen,.finale-inner{position:relative;z-index:1}'+
        '@keyframes moonGlow{0%,100%{box-shadow:0 0 40px rgba(200,210,255,0.3)}50%{box-shadow:0 0 80px rgba(200,210,255,0.5)}}'+
        'header h1,.finale-title{animation:moonGlow 4s ease-in-out infinite!important}';
      document.head.appendChild(style);
      var moon=document.createElement('div');
      moon.textContent='\uD83C\uDF19';
      moon.style.cssText='position:fixed;top:20px;right:20px;font-size:2rem;z-index:100000;animation:moonGlow 3s ease-in-out infinite;filter:drop-shadow(0 0 12px rgba(200,210,255,0.6))';
      document.body.appendChild(moon);
      var msg=document.createElement('div');
      msg.textContent='3:33 \u2014 the moon is watching over us';
      msg.style.cssText='position:fixed;bottom:40px;left:50%;transform:translateX(-50%);font-family:Georgia,serif;font-size:0.75rem;color:rgba(200,210,255,0.7);z-index:100000;letter-spacing:0.12em;text-align:center;white-space:nowrap';
      document.body.appendChild(msg);
      setTimeout(function(){msg.style.transition='opacity 2s';msg.style.opacity='0';setTimeout(function(){msg.remove()},2500)},5000);
    }
  })();

  /* ---- TILT UPSIDE DOWN SECRET (timecapsule) ---- */
  (function(){
    if(PAGE!=='timecapsule.html')return;
    var revealed=false;
    function triggerTilt(){
      if(revealed)return;
      revealed=true;
      var chest=document.getElementById('chest3d');
      if(chest){chest.classList.add('chest-shake');}
      var toast=document.createElement('div');
      toast.innerHTML='<div style="font-size:1.2rem;margin-bottom:0.4rem">\uD83D\uDD2E</div><div style="font-size:0.8rem">The capsule trembles...</div><div style="font-size:0.65rem;margin-top:0.3rem;opacity:0.6">something stirs inside</div>';
      toast.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(26,15,20,0.95);color:#e8c17e;padding:1.2rem 1.8rem;border-radius:18px;font-family:Georgia,serif;z-index:10000;border:1px solid rgba(232,193,126,0.4);text-align:center';
      document.body.appendChild(toast);
      setTimeout(function(){toast.remove()},3500);
      if(navigator.vibrate)try{navigator.vibrate([30,50,30,50,30])}catch(e){}
    }
    function handleOrientation(e){
      if(revealed)return;
      if(e.beta!==null&&Math.abs(e.beta)>150)triggerTilt();
    }
    function enableTilt(){
      if(window.DeviceOrientationEvent){
        if(typeof DeviceOrientationEvent.requestPermission==='function'){
          DeviceOrientationEvent.requestPermission().then(function(state){
            if(state==='granted')window.addEventListener('deviceorientation',handleOrientation);
          }).catch(function(){});
        }else{
          window.addEventListener('deviceorientation',handleOrientation);
        }
      }
    }
    document.addEventListener('touchstart',function reqPerm(){
      enableTilt();
      document.removeEventListener('touchstart',reqPerm);
    },{once:true,passive:true});
    enableTilt();
    /* also trigger on desktop: press U key */
    document.addEventListener('keydown',function(e){
      if((e.key==='u'||e.key==='U')&&!revealed)triggerTilt();
    });
  })();

  /* ---- TAP HEART 50X SECRET (finale) ---- */
  (function(){
    if(PAGE!=='finale.html')return;
    var tapCount=0;
    var tapTimer=null;
    var heart=document.getElementById('foreverHeart');
    if(!heart)return;
    heart.addEventListener('click',function(){
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer=setTimeout(function(){tapCount=0},2000);
      if(tapCount>=50){
        tapCount=0;
        var hidden=document.createElement('div');
        hidden.innerHTML='<div style="max-width:400px;text-align:center;padding:2rem"><div style="font-size:2rem;margin-bottom:0.8rem">\uD83D\uDC95</div><div style="font-family:Georgia,serif;font-size:1.3rem;color:#e8c17e;margin-bottom:1rem">You found it.</div><div style="font-size:0.9rem;line-height:1.8;color:rgba(255,247,238,0.85);font-family:Georgia,serif">This is the secret ending. The one only the most persistent heart finds.<br><br>If you tapped 50 times, it means you care enough to keep going. That\'s the kind of love I have for you \u2014 relentless, patient, and always worth the effort.<br><br>You are my forever, Rezil. And I\'ll keep tapping for you, every single day.</div><div style="margin-top:1.2rem;font-size:0.75rem;color:rgba(255,143,171,0.6);font-style:italic">\u2014 Nard, to the girl who never gives up</div><button onclick="this.closest(\'div\').parentElement.remove()" style="margin-top:1.5rem;background:linear-gradient(135deg,#ff8fab,#e0567c);border:none;color:#fff;padding:0.6rem 1.5rem;border-radius:999px;font-size:0.85rem;cursor:pointer;font-family:inherit">close with love</button></div>';
        hidden.style.cssText='position:fixed;inset:0;background:rgba(10,6,18,0.92);z-index:100000;display:flex;align-items:center;justify-content:center;padding:1rem';
        document.body.appendChild(hidden);
        /* confetti burst */
        for(var i=0;i<80;i++){
          (function(delay){
            setTimeout(function(){
              var p=document.createElement('div');
              p.textContent=['\u2665','\u2661','\u2726','\u2B50'][Math.floor(Math.random()*4)];
              p.style.cssText='position:fixed;font-size:'+(12+Math.random()*18)+'px;left:'+(Math.random()*100)+'vw;top:-20px;pointer-events:none;z-index:100001;color:'+( ['#ff8fab','#e8c17e','#ffd3e0','#b8a0ff'][Math.floor(Math.random()*4)])+';animation:burstFloat '+(2+Math.random()*2)+'s ease-out forwards';
              document.body.appendChild(p);
              setTimeout(function(){p.remove()},4500);
            },delay);
          })(i*30);
        }
        if(navigator.vibrate)try{navigator.vibrate([50,30,50])}catch(e){}
      }
    });
  })();

  /* ---- DOUBLE-TAP SHOOTING STARS (stars) ---- */
  (function(){
    if(PAGE!=='stars.html')return;
    var lastTap=0;
    document.addEventListener('touchend',function(e){
      var now=Date.now();
      if(now-lastTap<350){
        for(var i=0;i<12;i++){
          (function(delay){
            setTimeout(function(){
              var star=document.createElement('div');
              star.textContent='\u2B50';
              star.style.cssText='position:fixed;font-size:'+(10+Math.random()*14)+'px;pointer-events:none;z-index:10;color:#e8c17e;left:'+(Math.random()*100)+'vw;top:'+(Math.random()*40)+'vh;opacity:0;animation:burstFloat '+(1.5+Math.random()*1.5)+'s ease-out forwards';
              document.body.appendChild(star);
              setTimeout(function(){star.remove()},3500);
            },delay);
          })(i*80);
        }
        if(navigator.vibrate)try{navigator.vibrate(30)}catch(e){}
      }
      lastTap=now;
    },{passive:true});
    document.addEventListener('click',function(e){
      var now=Date.now();
      if(now-lastTap<350){
        for(var i=0;i<12;i++){
          (function(delay){
            setTimeout(function(){
              var star=document.createElement('div');
              star.textContent='\u2B50';
              star.style.cssText='position:fixed;font-size:'+(10+Math.random()*14)+'px;pointer-events:none;z-index:10;color:#e8c17e;left:'+(Math.random()*100)+'vw;top:'+(Math.random()*40)+'vh;opacity:0;animation:burstFloat '+(1.5+Math.random()*1.5)+'s ease-out forwards';
              document.body.appendChild(star);
              setTimeout(function(){star.remove()},3500);
            },delay);
          })(i*80);
        }
        if(navigator.vibrate)try{navigator.vibrate(30)}catch(e){}
      }
      lastTap=now;
    });
  })();

  /* ---- SWIPE NAVIGATION BETWEEN PAGES ---- */
  (function(){
    var pages=['lovepage.html','aurora.html','chikoy-room.html','chickenhouse.html','letters.html','diary.html','stars.html','reasons.html','scratch.html','story.html','timecapsule.html','photovault.html','lovejar.html','finale.html','hidden.html','visitors.html'];
    var idx=pages.indexOf(PAGE);
    if(idx===-1)return;
    var startX=0,startY=0,swiping=false,toast=null;
    var hint=document.createElement('div');
    hint.style.cssText='position:fixed;bottom:12px;right:12px;font-size:0.65rem;color:rgba(255,247,238,0.35);z-index:99995;pointer-events:none;font-family:Georgia,serif;transition:opacity 1s';
    hint.textContent='\u2190 swipe to navigate \u2192';
    document.body.appendChild(hint);
    setTimeout(function(){hint.style.opacity='0';setTimeout(function(){hint.remove()},1200);},4000);

    document.addEventListener('touchstart',function(e){
      if(e.touches.length!==1)return;
      startX=e.touches[0].clientX;
      startY=e.touches[0].clientY;
      swiping=true;
    },{passive:true});

    document.addEventListener('touchend',function(e){
      if(!swiping)return;
      swiping=false;
      var dx=e.changedTouches[0].clientX-startX;
      var dy=e.changedTouches[0].clientY-startY;
      if(Math.abs(dx)<60||Math.abs(dy)>Math.abs(dx)*0.8)return;
      var dir=dx<0?1:-1;
      var next=idx+dir;
      if(next<0||next>=pages.length)return;
      var overlay=document.createElement('div');
      overlay.style.cssText='position:fixed;inset:0;z-index:99997;display:flex;align-items:center;justify-content:center;background:rgba(10,6,18,0.85);opacity:0;transition:opacity 0.25s';
      overlay.innerHTML='<div style="text-align:center;color:#e8c17e;font-family:Georgia,serif"><div style="font-size:0.7rem;opacity:0.5;margin-bottom:0.4rem">'+(dir<0?'swipe right':'swipe left')+'</div><div style="font-size:1.1rem">'+pages[next].replace('.html','')+'</div></div>';
      document.body.appendChild(overlay);
      requestAnimationFrame(function(){overlay.style.opacity='1';});
      if(navigator.vibrate)try{navigator.vibrate(15)}catch(e){}
      setTimeout(function(){window.location.href=pages[next];},400);
    },{passive:true});
  })();

  /* ---- PULL DOWN TO REVEAL SECRET ---- */
  (function(){
    var pulled=false,started=false,startY=0;
    var msg=document.createElement('div');
    msg.style.cssText='position:fixed;top:0;left:0;right:0;height:60px;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,rgba(255,143,171,0.15),transparent);z-index:99996;pointer-events:none;opacity:0;transition:opacity 0.3s;font-family:Georgia,serif;font-size:0.8rem;color:#e8c17e';
    msg.textContent='\u2193 pull down for a secret \u2193';
    document.body.appendChild(msg);

    document.addEventListener('touchstart',function(e){
      if(window.scrollY<=0&&e.touches.length===1){
        startY=e.touches[0].clientY;
        started=true;
      }
    },{passive:true});

    document.addEventListener('touchmove',function(e){
      if(!started)return;
      var dy=e.touches[0].clientY-startY;
      if(dy>40&&window.scrollY<=0){
        msg.style.opacity='1';
        msg.style.transform='translateY('+Math.min(dy-40,40)+'px)';
      }
    },{passive:true});

    document.addEventListener('touchend',function(){
      if(!started)return;
      started=false;
      if(msg.style.opacity==='1'&&!pulled){
        pulled=true;
        var loveMessages=[
          'Nard loves you more than words can say',
          'You are the reason I smile every day',
          'My heart beats only for you',
          'Forever and always, Rezil',
          'You are my today and all of my tomorrows'
        ];
        var secret=document.createElement('div');
        secret.textContent=loveMessages[Math.floor(Math.random()*loveMessages.length)];
        secret.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.8);background:rgba(26,15,20,0.96);color:#e8c17e;padding:1.2rem 1.8rem;border-radius:18px;font-family:Georgia,serif;font-size:0.85rem;z-index:99997;text-align:center;max-width:80vw;border:1px solid rgba(232,193,126,0.4);opacity:0;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1)';
        document.body.appendChild(secret);
        requestAnimationFrame(function(){secret.style.opacity='1';secret.style.transform='translate(-50%,-50%) scale(1)';});
        if(navigator.vibrate)try{navigator.vibrate([20,30,20])}catch(e){}
        setTimeout(function(){secret.style.opacity='0';secret.style.transform='translate(-50%,-50%) scale(0.8)';setTimeout(function(){secret.remove()},400);},3000);
      }
      msg.style.opacity='0';
      msg.style.transform='';
      setTimeout(function(){pulled=false;},3000);
    },{passive:true});
  })();

  /* ---- RANDOM TOAST NOTIFICATIONS ---- */
  (function(){
    var messages=[
      'Nard is thinking of you right now...',
      'You are loved more than you know',
      'This moment, this breath, I love you',
      'You make everything better just by existing',
      'I fall in love with you more every day',
      'You are my favorite notification',
      'Missing you is my full-time job',
      'You are the best thing that ever happened to me',
      'Can\'t wait to see you again',
      'You are my sunshine on a cloudy day',
      'My heart is always where you are',
      'You are enough, always have been, always will be',
      'Just a reminder: you are amazing',
      'I choose you, today and every day',
      'You are my favorite place to be'
    ];
    function showToast(){
      var t=document.createElement('div');
      t.textContent=messages[Math.floor(Math.random()*messages.length)];
      t.style.cssText='position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-20px);background:rgba(26,15,20,0.95);color:#e8c17e;padding:0.7rem 1.4rem;border-radius:999px;font-family:Georgia,serif;font-size:0.75rem;z-index:99998;border:1px solid rgba(232,193,126,0.3);opacity:0;transition:all 0.5s cubic-bezier(0.34,1.56,0.64,1);pointer-events:none';
      document.body.appendChild(t);
      requestAnimationFrame(function(){t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';});
      setTimeout(function(){t.style.opacity='0';t.style.transform='translateX(-50%) translateY(-20px)';setTimeout(function(){t.remove();},600);},3500);
      if(navigator.vibrate)try{navigator.vibrate(10)}catch(e){}
    }
    function scheduleNext(){
      var delay=300000+Math.random()*300000;
      setTimeout(function(){
        if(document.visibilityState==='visible')showToast();
        scheduleNext();
      },delay);
    }
    scheduleNext();
  })();

  /* ---- LONG PRESS MENU ---- */
  (function(){
    var pressTimer=null,menuOpen=false;
    var menu=document.createElement('div');
    menu.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(80px);background:rgba(26,15,20,0.97);border:1px solid rgba(255,143,171,0.3);border-radius:18px;padding:0.6rem;z-index:99999;display:flex;gap:0.3rem;opacity:0;transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);pointer-events:none;backdrop-filter:blur(10px)';
    menu.innerHTML='<button class="lp-btn" data-action="love" style="background:none;border:none;font-size:1.5rem;padding:0.5rem 0.7rem;cursor:pointer;border-radius:12px;transition:background 0.2s">\uD83D\uDC95</button><button class="lp-btn" data-action="share" style="background:none;border:none;font-size:1.5rem;padding:0.5rem 0.7rem;cursor:pointer;border-radius:12px;transition:background 0.2s">\uD83D\uDCE4</button><button class="lp-btn" data-action="home" style="background:none;border:none;font-size:1.5rem;padding:0.5rem 0.7rem;cursor:pointer;border-radius:12px;transition:background 0.2s">\uD83C\uDFE0</button><button class="lp-btn" data-action="top" style="background:none;border:none;font-size:1.5rem;padding:0.5rem 0.7rem;cursor:pointer;border-radius:12px;transition:background 0.2s">\u2B06\uFE0F</button><button class="lp-btn" data-action="close" style="background:none;border:none;font-size:1rem;padding:0.5rem 0.7rem;cursor:pointer;border-radius:12px;transition:background 0.2s;color:#ff8fab">\u2715</button>';
    document.body.appendChild(menu);
    var btns=menu.querySelectorAll('.lp-btn');
    btns.forEach(function(b){
      b.addEventListener('touchstart',function(){b.style.background='rgba(255,143,171,0.15)';},{passive:true});
      b.addEventListener('touchend',function(){b.style.background='none';},{passive:true});
    });

    document.addEventListener('touchstart',function(e){
      if(e.touches.length!==1)return;
      if(e.target.closest('button,a,input,.lp-btn'))return;
      pressTimer=setTimeout(function(){
        if(navigator.vibrate)try{navigator.vibrate(20)}catch(e){}
        menu.style.opacity='1';
        menu.style.transform='translateX(-50%) translateY(0)';
        menu.style.pointerEvents='auto';
        menuOpen=true;
      },500);
    },{passive:true});

    document.addEventListener('touchend',function(){
      if(pressTimer){clearTimeout(pressTimer);pressTimer=null;}
    },{passive:true});

    document.addEventListener('touchmove',function(){
      if(pressTimer){clearTimeout(pressTimer);pressTimer=null;}
    },{passive:true});

    function closeMenu(){
      menu.style.opacity='0';
      menu.style.transform='translateX(-50%) translateY(80px)';
      menu.style.pointerEvents='none';
      menuOpen=false;
    }

    btns.forEach(function(b){
      b.addEventListener('click',function(){
        var action=b.getAttribute('data-action');
        closeMenu();
        if(action==='love'){
          var heart=document.createElement('div');
          heart.textContent='\u2764\uFE0F';
          heart.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);font-size:4rem;z-index:99999;transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
          document.body.appendChild(heart);
          requestAnimationFrame(function(){heart.style.transform='translate(-50%,-50%) scale(1)';});
          setTimeout(function(){heart.style.transform='translate(-50%,-50%) scale(0)';setTimeout(function(){heart.remove();},500);},1500);
          if(navigator.vibrate)try{navigator.vibrate([30,50,30])}catch(e){}
        }else if(action==='share'){
          var url=location.href;
          if(navigator.share)navigator.share({title:'Our Love Story',text:'I love you \u2764\uFE0F',url:url}).catch(function(){});
          else{window.open('https://wa.me/?text='+encodeURIComponent('I love you \u2764\uFE0F '+url));}
        }else if(action==='home'){
          window.location.href='lovepage.html';
        }else if(action==='top'){
          window.scrollTo({top:0,behavior:'smooth'});
        }
      });
    });

    document.addEventListener('click',function(e){
      if(menuOpen&&!e.target.closest('.lp-btn'))closeMenu();
    });
  })();

  /* ---- DOUBLE TAP ANY PHOTO -> FLOATING HEART ---- */
  (function(){
    var lastTap=0;
    document.addEventListener('dblclick',function(e){
      var img=e.target;
      if(!img.matches('img,.photo,.gallery-item img,[style*="background-image"]'))return;
      var rect=img.getBoundingClientRect();
      var heart=document.createElement('div');
      heart.textContent='\u2764\uFE0F';
      heart.style.cssText='position:fixed;font-size:2rem;z-index:99999;pointer-events:none;left:'+(rect.left+rect.width/2-16)+'px;top:'+(rect.top+rect.height/2-16)+'px;transform:scale(0);transition:all 0.6s cubic-bezier(0.34,1.56,0.64,1)';
      document.body.appendChild(heart);
      requestAnimationFrame(function(){heart.style.transform='scale(1) translateY(-40px)';heart.style.opacity='0';});
      setTimeout(function(){heart.remove();},700);
      if(navigator.vibrate)try{navigator.vibrate(15)}catch(e){}
    });
    var lastTouch=0;
    document.addEventListener('touchend',function(e){
      var now=Date.now();
      if(now-lastTouch<300){
        var t=e.target;
        if(!t.matches('img,.photo,.gallery-item img,[style*="background-image"]'))return;
        var rect=t.getBoundingClientRect();
        var heart=document.createElement('div');
        heart.textContent='\u2764\uFE0F';
        heart.style.cssText='position:fixed;font-size:2rem;z-index:99999;pointer-events:none;left:'+(rect.left+rect.width/2-16)+'px;top:'+(rect.top+rect.height/2-16)+'px;transform:scale(0);transition:all 0.6s cubic-bezier(0.34,1.56,0.64,1)';
        document.body.appendChild(heart);
        requestAnimationFrame(function(){heart.style.transform='scale(1) translateY(-40px)';heart.style.opacity='0';});
        setTimeout(function(){heart.remove();},700);
        if(navigator.vibrate)try{navigator.vibrate(15)}catch(e){}
      }
      lastTouch=now;
    },{passive:true});
  })();

})();
})();
