/* ═══════════════════════════════════════════════════
   Anniversary Surprise System v1.0
   Auto-triggers on September 10, 2026 (2nd anniversary)
   ═══════════════════════════════════════════════════ */
(function(){
"use strict";

var ANNIVERSARY_DATE = new Date(2026, 8, 10); // Sept 10, 2026 (month is 0-indexed)
var ANNIVERSARY_MSG  = "Happy 2nd Anniversary, my love!";
var GOLD_PRIMARY     = "#d4a017";
var GOLD_LIGHT       = "#f5d76e";
var GOLD_BG          = "rgba(212,160,23,0.08)";

// ── Utility ──
function isAnniversary(){
  var n = new Date();
  return n.getMonth()===ANNIVERSARY_DATE.getMonth() && n.getDate()===ANNIVERSARY_DATE.getDate() && n.getFullYear()===ANNIVERSARY_DATE.getFullYear();
}

function isNearAnniversary(){
  var n = new Date();
  var diff = ANNIVERSARY_DATE - n;
  return diff > 0 && diff < 7*24*60*60*1000; // within 7 days
}

function daysUntilAnniversary(){
  var n = new Date();
  var next = new Date(n.getFullYear(), ANNIVERSARY_DATE.getMonth(), ANNIVERSARY_DATE.getDate());
  if(next < n) next = new Date(n.getFullYear()+1, ANNIVERSARY_DATE.getMonth(), ANNIVERSARY_DATE.getDate());
  return Math.ceil((next - n) / 86400000);
}

// ── Theme ──
function applyAnniversaryTheme(){
  document.documentElement.classList.add("anniversary");
  var s = document.createElement("style");
  s.id = "anniversary-theme";
  s.textContent =
    ".anniversary{--rose:"+GOLD_PRIMARY+";--rose-deep:#b8860b;--gold:"+GOLD_LIGHT+";--cream:#fff8e1}" +
    ".anniversary .hero-label,.anniversary .section-label{color:"+GOLD_PRIMARY+"!important}" +
    ".anniversary .lock-title .shimmer{background:linear-gradient(90deg,#d4a017,#f5d76e,#d4a017);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}" +
    ".anniversary-confetti{position:fixed;top:-20px;z-index:9999;pointer-events:none;font-size:1.4rem;animation:annivFall linear forwards}" +
    "@keyframes annivFall{0%{opacity:1;transform:translateY(0) rotate(0) scale(1)}100%{opacity:0;transform:translateY(105vh) rotate(720deg) scale(.4)}}" +
    ".anniversary-toast{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);z-index:10000;padding:1rem 2rem;border-radius:16px;background:rgba(13,8,18,.95);border:2px solid "+GOLD_PRIMARY+";backdrop-filter:blur(16px);text-align:center;font-size:1.2rem;color:"+GOLD_LIGHT+";box-shadow:0 0 60px rgba(212,160,23,.4);animation:annivToast 4s var(--spring) forwards;pointer-events:none}" +
    "@keyframes annivToast{0%{transform:translate(-50%,-50%) scale(0);opacity:0}15%{transform:translate(-50%,-50%) scale(1.1);opacity:1}30%{transform:translate(-50%,-50%) scale(1)}85%{opacity:1}100%{transform:translate(-50%,-50%) scale(.8);opacity:0}}" +
    ".anniversary-toast .at-emoji{font-size:2.5rem;display:block;margin-bottom:.3rem}" +
    ".anniversary-toast .at-msg{font-family:'Cormorant Garamond',Georgia,serif;font-weight:600}" +
    ".anniversary-toast .at-sub{font-size:.7rem;color:rgba(255,247,238,.5);margin-top:.2rem}" +
    ".anniversary-countdown{position:fixed;bottom:0;left:0;right:0;z-index:9998;display:flex;align-items:center;justify-content:center;gap:1.2rem;padding:.8rem 1rem calc(.8rem + env(safe-area-inset-bottom,0px));background:linear-gradient(0deg,rgba(13,8,18,.92),rgba(13,8,18,.7) 80%,transparent);backdrop-filter:blur(8px)}" +
    ".anniversary-countdown .ac-box{text-align:center}" +
    ".anniversary-countdown .ac-num{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.6rem;font-weight:700;color:"+GOLD_LIGHT+";line-height:1}" +
    ".anniversary-countdown .ac-label{font-size:.45rem;color:rgba(255,247,238,.45);text-transform:uppercase;letter-spacing:.08rem}" +
    ".anniversary-countdown .ac-sep{font-size:1.2rem;color:"+GOLD_PRIMARY+";opacity:.5;align-self:flex-start;margin-top:.15rem}" +
    ".anniversary-countdown .ac-title{font-family:'Cormorant Garamond',Georgia,serif;font-size:.7rem;color:"+GOLD_LIGHT+";margin-bottom:.3rem}" +
    ".anniversary-sparkle{position:fixed;pointer-events:none;z-index:9997;width:6px;height:6px;border-radius:50%;background:radial-gradient(circle,"+GOLD_LIGHT+",transparent);animation:sparkleFloat 3s ease-in-out forwards}" +
    "@keyframes sparkleFloat{0%{opacity:0;transform:translateY(0) scale(0)}30%{opacity:1;transform:translateY(-20px) scale(1)}100%{opacity:0;transform:translateY(-80px) scale(0)}}";
  document.head.appendChild(s);
}

// ── Confetti ──
function spawnConfetti(){
  var emojis = ["♥","♥","♥","✦","★","✿","♥","💛","🤍"];
  for(var i=0;i<40;i++){
    (function(delay){
      setTimeout(function(){
        var el = document.createElement("span");
        el.className = "anniversary-confetti";
        el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        el.style.left = Math.random()*100+"vw";
        el.style.fontSize = (Math.random()*1.2+.6)+"rem";
        el.style.animationDuration = (Math.random()*3+3)+"s";
        document.body.appendChild(el);
        setTimeout(function(){el.remove()},7000);
      }, delay);
    })(i * 80);
  }
}

// ── Toast ──
function showAnniversaryToast(){
  var t = document.createElement("div");
  t.className = "anniversary-toast";
  t.innerHTML = '<div class="at-emoji">🥂</div><div class="at-msg">'+ANNIVERSARY_MSG+'</div><div class="at-sub">September 10, 2026 — 2 Years Together</div>';
  document.body.appendChild(t);
  setTimeout(function(){t.remove()},4500);
}

// ── Sparkles ──
function spawnSparkles(){
  for(var i=0;i<15;i++){
    (function(delay){
      setTimeout(function(){
        var s = document.createElement("div");
        s.className = "anniversary-sparkle";
        s.style.left = Math.random()*100+"vw";
        s.style.top = Math.random()*80+10+"vh";
        document.body.appendChild(s);
        setTimeout(function(){s.remove()},3500);
      }, delay);
    })(i * 200);
  }
}

// ── Countdown Bar ──
function buildCountdownBar(){
  var bar = document.createElement("div");
  bar.className = "anniversary-countdown";
  bar.id = "anniversaryCountdown";
  var days = daysUntilAnniversary();
  bar.innerHTML =
    '<div style="text-align:center"><div class="ac-title">Our Anniversary</div><div style="display:flex;align-items:flex-start;gap:.6rem;justify-content:center">' +
    '<div class="ac-box"><div class="ac-num" id="acDays">'+days+'</div><div class="ac-label">Days</div></div>' +
    '<div class="ac-sep">:</div>' +
    '<div class="ac-box"><div class="ac-num" id="acHours">00</div><div class="ac-label">Hours</div></div>' +
    '<div class="ac-sep">:</div>' +
    '<div class="ac-box"><div class="ac-num" id="acMins">00</div><div class="ac-label">Minutes</div></div>' +
    '<div class="ac-sep">:</div>' +
    '<div class="ac-box"><div class="ac-num" id="acSecs">00</div><div class="ac-label">Seconds</div></div>' +
    '</div></div>';
  document.body.appendChild(bar);

  function update(){
    var now = new Date();
    var next = new Date(now.getFullYear(), ANNIVERSARY_DATE.getMonth(), ANNIVERSARY_DATE.getDate());
    if(next < now) next = new Date(now.getFullYear()+1, ANNIVERSARY_DATE.getMonth(), ANNIVERSARY_DATE.getDate());
    var diff = next - now;
    var s = Math.floor(diff/1000);
    var d = Math.floor(s/86400);
    var h = Math.floor((s%86400)/3600);
    var m = Math.floor((s%3600)/60);
    var sec = s%60;
    var de = document.getElementById("acDays");
    var he = document.getElementById("acHours");
    var me = document.getElementById("acMins");
    var se = document.getElementById("acSecs");
    if(de) de.textContent = d;
    if(he) he.textContent = h<10?"0"+h:h;
    if(me) me.textContent = m<10?"0"+m:m;
    if(se) se.textContent = sec<10?"0"+sec:sec;
  }
  update();
  setInterval(update, 1000);
}

// ── Auto-unlock anniversary section (for lovepage.html) ──
function autoUnlockAnniversary(){
  if(typeof window.openAnnivPage === "function"){
    setTimeout(function(){ window.openAnnivPage(); }, 800);
  }
}

// ── Birthday detection ──
function isBirthday(){
  var n = new Date();
  // Check Rezil's birthday or Nard's birthday if known
  // For now just return false — can be customized
  return false;
}

// ── Main init ──
function init(){
  if(isAnniversary()){
    applyAnniversaryTheme();
    document.body.classList.add("anniversary-day");

    // Confetti burst
    spawnConfetti();
    setTimeout(spawnConfetti, 2000);
    setTimeout(spawnConfetti, 4000);

    // Toast
    setTimeout(showAnniversaryToast, 1200);

    // Sparkles
    spawnSparkles();
    setInterval(spawnSparkles, 8000);

    // Auto-unlock lovepage anniversary section
    if(document.getElementById("annivLock")){
      autoUnlockAnniversary();
    }
  } else if(isNearAnniversary()){
    // Pre-anniversary: subtle countdown only
    applyAnniversaryTheme();
  }

  // Countdown bar (show 30 days before anniversary)
  var days = daysUntilAnniversary();
  if(days <= 30){
    applyAnniversaryTheme();
    buildCountdownBar();
  }
}

// Expose for lovepage.js integration
window.Anniversary = {
  isAnniversary: isAnniversary,
  isNearAnniversary: isNearAnniversary,
  daysUntil: daysUntilAnniversary,
  autoUnlock: autoUnlockAnniversary,
  spawnConfetti: spawnConfetti,
  showToast: showAnniversaryToast,
  applyTheme: applyAnniversaryTheme
};

// Run on DOM ready
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

})();
