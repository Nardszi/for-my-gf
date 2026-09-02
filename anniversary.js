/* ═══════════════════════════════════════════════════
   Anniversary Surprise System v2.0
   Auto-triggers on September 10, 2026 (2nd anniversary)
   Unique surprises on EVERY page
   ═══════════════════════════════════════════════════ */
(function(){
"use strict";

var ANNIVERSARY_DATE = new Date(2026, 8, 10);
var ANNIVERSARY_MSG  = "Happy 2nd Anniversary, my love!";
var GOLD_PRIMARY     = "#d4a017";
var GOLD_LIGHT       = "#f5d76e";

function isAnniversary(){
  var n = new Date();
  return n.getMonth()===8 && n.getDate()===10 && n.getFullYear()===2026;
}
function isNearAnniversary(){
  var diff = ANNIVERSARY_DATE - new Date();
  return diff > 0 && diff < 7*864e5;
}
function daysUntilAnniversary(){
  var n = new Date();
  var next = new Date(n.getFullYear(), 8, 10);
  if(next < n) next = new Date(n.getFullYear()+1, 8, 10);
  return Math.ceil((next - n) / 864e5);
}
function getPageName(){
  return (location.pathname.split("/").pop() || "lovepage.html").toLowerCase();
}

// ── CSS Theme ──
function applyAnniversaryTheme(){
  document.documentElement.classList.add("anniversary");
  if(document.getElementById("anniversary-theme")) return;
  var s = document.createElement("style");
  s.id = "anniversary-theme";
  s.textContent =
    ".anniversary{--rose:"+GOLD_PRIMARY+";--rose-deep:#b8860b;--gold:"+GOLD_LIGHT+";--cream:#fff8e1}" +
    ".anniversary body,.anniversary{color:"+GOLD_LIGHT+"}" +
    ".anniversary-confetti{position:fixed;top:-20px;z-index:9999;pointer-events:none;font-size:1.4rem;animation:annivFall linear forwards}" +
    "@keyframes annivFall{0%{opacity:1;transform:translateY(0) rotate(0) scale(1)}100%{opacity:0;transform:translateY(105vh) rotate(720deg) scale(.4)}}" +
    ".anniversary-toast{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);z-index:10000;padding:1rem 2rem;border-radius:16px;background:rgba(13,8,18,.95);border:2px solid "+GOLD_PRIMARY+";backdrop-filter:blur(16px);text-align:center;font-size:1.2rem;color:"+GOLD_LIGHT+";box-shadow:0 0 60px rgba(212,160,23,.4);animation:annivToast 4s cubic-bezier(.34,1.56,.64,1) forwards;pointer-events:none}" +
    "@keyframes annivToast{0%{transform:translate(-50%,-50%) scale(0);opacity:0}15%{transform:translate(-50%,-50%) scale(1.1);opacity:1}30%{transform:translate(-50%,-50%) scale(1)}85%{opacity:1}100%{transform:translate(-50%,-50%) scale(.8);opacity:0}}" +
    ".anniversary-toast .at-emoji{font-size:2.5rem;display:block;margin-bottom:.3rem}" +
    ".anniversary-toast .at-msg{font-family:'Cormorant Garamond',Georgia,serif;font-weight:600}" +
    ".anniversary-toast .at-sub{font-size:.7rem;color:rgba(255,247,238,.5);margin-top:.2rem}" +
    ".anniversary-countdown{position:fixed;bottom:0;left:0;right:0;z-index:9998;display:flex;align-items:center;justify-content:center;padding:.8rem 1rem calc(.8rem + env(safe-area-inset-bottom,0px));background:linear-gradient(0deg,rgba(13,8,18,.92),rgba(13,8,18,.7) 80%,transparent);backdrop-filter:blur(8px)}" +
    ".anniversary-countdown .ac-box{text-align:center}" +
    ".anniversary-countdown .ac-num{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.6rem;font-weight:700;color:"+GOLD_LIGHT+";line-height:1}" +
    ".anniversary-countdown .ac-label{font-size:.45rem;color:rgba(255,247,238,.45);text-transform:uppercase;letter-spacing:.08rem}" +
    ".anniversary-countdown .ac-sep{font-size:1.2rem;color:"+GOLD_PRIMARY+";opacity:.5;align-self:flex-start;margin-top:.15rem}" +
    ".anniversary-countdown .ac-title{font-family:'Cormorant Garamond',Georgia,serif;font-size:.7rem;color:"+GOLD_LIGHT+";margin-bottom:.3rem}" +
    ".anniversary-sparkle{position:fixed;pointer-events:none;z-index:9997;width:6px;height:6px;border-radius:50%;background:radial-gradient(circle,"+GOLD_LIGHT+",transparent);animation:sparkleFloat 3s ease-in-out forwards}" +
    "@keyframes sparkleFloat{0%{opacity:0;transform:translateY(0) scale(0)}30%{opacity:1;transform:translateY(-20px) scale(1)}100%{opacity:0;transform:translateY(-80px) scale(0)}}" +
    ".anniv-banner{position:fixed;top:0;left:0;right:0;z-index:9999;text-align:center;padding:.5rem 1rem;background:linear-gradient(135deg,rgba(212,160,23,.95),rgba(184,134,11,.95));color:#1a0a00;font-family:'Cormorant Garamond',Georgia,serif;font-size:.85rem;font-weight:700;letter-spacing:.03rem;box-shadow:0 4px 20px rgba(212,160,23,.4);animation:bannerSlide .6s cubic-bezier(.34,1.56,.64,1) forwards}" +
    "@keyframes bannerSlide{from{transform:translateY(-100%)}to{transform:translateY(0)}}" +
    ".anniv-badge{display:inline-flex;align-items:center;gap:.4rem;padding:.3rem .8rem;border-radius:999px;background:rgba(212,160,23,.15);border:1px solid rgba(212,160,23,.3);font-size:.65rem;color:"+GOLD_LIGHT+";margin-top:.5rem}" +
    ".anniv-badge .ab-year{font-weight:700;font-size:.9rem;color:"+GOLD_LIGHT+"}" +
    ".anniv-float-gift{position:fixed;z-index:9996;pointer-events:none;font-size:2rem;animation:giftFloat 6s ease-in-out forwards}" +
    "@keyframes giftFloat{0%{opacity:0;transform:translateY(100vh) rotate(0)}20%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translateY(-20vh) rotate(360deg)}}";
  document.head.appendChild(s);
}

// ── Core Effects ──
function spawnConfetti(count){
  var n = count || 40;
  var emojis = ["♥","♥","♥","✦","★","✿","♥","💛","🤍"];
  for(var i=0;i<n;i++){
    (function(d){
      setTimeout(function(){
        var el = document.createElement("span");
        el.className = "anniversary-confetti";
        el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        el.style.left = Math.random()*100+"vw";
        el.style.fontSize = (Math.random()*1.2+.6)+"rem";
        el.style.animationDuration = (Math.random()*3+3)+"s";
        document.body.appendChild(el);
        setTimeout(function(){el.remove()},7000);
      }, d);
    })(i * 80);
  }
}
function showAnniversaryToast(msg, sub, emoji){
  var t = document.createElement("div");
  t.className = "anniversary-toast";
  t.innerHTML = '<div class="at-emoji">'+(emoji||"🥂")+'</div><div class="at-msg">'+(msg||ANNIVERSARY_MSG)+'</div><div class="at-sub">'+(sub||"September 10, 2026 — 2 Years Together")+'</div>';
  document.body.appendChild(t);
  setTimeout(function(){t.remove()},4500);
}
function spawnSparkles(){
  for(var i=0;i<12;i++){
    (function(d){
      setTimeout(function(){
        var s = document.createElement("div");
        s.className = "anniversary-sparkle";
        s.style.left = Math.random()*100+"vw";
        s.style.top = Math.random()*80+10+"vh";
        document.body.appendChild(s);
        setTimeout(function(){s.remove()},3500);
      }, d);
    })(i * 200);
  }
}
function spawnGifts(){
  var gifts = ["🎁","🎀","🎊","🎉","💛","✨"];
  for(var i=0;i<8;i++){
    (function(d){
      setTimeout(function(){
        var g = document.createElement("span");
        g.className = "anniv-float-gift";
        g.textContent = gifts[Math.floor(Math.random()*gifts.length)];
        g.style.left = Math.random()*90+5+"vw";
        g.style.animationDuration = (Math.random()*3+4)+"s";
        document.body.appendChild(g);
        setTimeout(function(){g.remove()},7000);
      }, d);
    })(i * 400);
  }
}
function showAnniversaryBanner(text){
  var b = document.createElement("div");
  b.className = "anniv-banner";
  b.textContent = text || "🥂 Happy 2nd Anniversary! — September 10, 2026";
  document.body.appendChild(b);
}
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
    var next = new Date(now.getFullYear(), 8, 10);
    if(next < now) next = new Date(now.getFullYear()+1, 8, 10);
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
function makeAnnivBadge(text){
  var b = document.createElement("div");
  b.className = "anniv-badge";
  b.innerHTML = text || '<span class="ab-year">2</span> Years Together ♥';
  return b;
}

// ══════════════════════════════════════════════════
// PAGE-SPECIFIC SURPRISES
// ══════════════════════════════════════════════════

var pageSurprises = {

  // ── LOVEPAGE: auto-open anniversary section + hero countdown ──
  "lovepage.html": function(){
    showAnniversaryBanner("🥂 Happy 2nd Anniversary! — Today is OUR day");
    // Auto-open anniversary section
    setTimeout(function(){
      if(typeof window.openAnnivPage === "function") window.openAnnivPage();
    }, 2000);
    // Extra confetti wave
    setTimeout(function(){ spawnConfetti(20); }, 6000);
  },

  // ── CHICKENHOUSE: golden egg spawns, farm party ──
  "chickenhouse.html": function(){
    showAnniversaryBanner("🎉 It's our anniversary! The farm is celebrating!");
    // Delayed to ensure DOM elements exist (created by chickenhouse.js)
    setTimeout(function(){
      // Make all chickens do happy dance
      document.querySelectorAll(".chicken").forEach(function(c){
        c.classList.add("happy");
        setTimeout(function(){ c.classList.remove("happy"); }, 2000);
      });
      // Farm animals do a group hop
      document.querySelectorAll(".farm-animal").forEach(function(a,i){
        setTimeout(function(){
          a.classList.add("hop");
          setTimeout(function(){ a.classList.remove("hop"); }, 600);
        }, i * 200);
      });
      // Spawn golden eggs in every nest
      document.querySelectorAll(".egg").forEach(function(e){
        if(!e.classList.contains("got")){
          e.classList.add("golden");
          e.style.boxShadow = "0 0 20px rgba(255,215,0,.8)";
        }
      });
    }, 2000);
    setTimeout(spawnGifts, 3000);
  },

  // ── TIMECAPSULE: already auto-unlocks, add extra celebration ──
  "timecapsule.html": function(){
    showAnniversaryBanner("💌 The time capsule is unlocked! A letter from the past...");
    setTimeout(spawnGifts, 1500);
  },

  // ── FINALE: "2 Years" badge + extra fireworks ──
  "finale.html": function(){
    showAnniversaryBanner("🎆 Two years of love, laughter, and forever");
    // Add anniversary badge to the page
    setTimeout(function(){
      var hero = document.querySelector(".hero, .finale-hero, [class*=hero], [class*=title]");
      if(hero) hero.appendChild(makeAnnivBadge());
    }, 1000);
    // Extra confetti burst
    setTimeout(function(){ spawnConfetti(30); }, 3000);
  },

  // ── AURORA: fireworks theme auto-activates + constellation ──
  "aurora.html": function(){
    showAnniversaryBanner("🌌 The sky celebrates our love tonight");
    // Try to switch to fireworks theme if the theme switcher exists
    setTimeout(function(){
      var pills = document.querySelectorAll("[data-theme], .pill, .theme-pill");
      pills.forEach(function(p){
        if(p.textContent.toLowerCase().includes("firework")) p.click();
      });
    }, 1000);
  },

  // ── CHIKOY ROOM: party hat + balloons + confetti ──
  "chikoy-room.html": function(){
    showAnniversaryBanner("🎊 Chikoy's room is decorated for our anniversary!");
    // Add party overlay
    setTimeout(function(){
      var canvas = document.querySelector("canvas");
      if(canvas){
        var overlay = document.createElement("div");
        overlay.style.cssText = "position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:10;text-align:center;padding-top:8%";
        overlay.innerHTML = '<div style="font-size:2rem;animation:annivFall 4s linear infinite">🎈</div><div style="font-size:1.5rem;margin-top:.5rem;color:#f5d76e;font-family:\'Cormorant Garamond\',serif">Happy Anniversary!</div>';
        canvas.parentElement.style.position = "relative";
        canvas.parentElement.appendChild(overlay);
      }
    }, 1500);
    setTimeout(spawnGifts, 2000);
  },

  // ── DIARY: auto-write an anniversary entry ──
  "diary.html": function(){
    showAnniversaryBanner("📖 A special entry for today...");
    // Pre-fill the diary with an anniversary entry
    setTimeout(function(){
      var ta = document.querySelector("textarea, .diary-input, [contenteditable]");
      if(ta){
        var msg = "Today marks 2 years since our love story began. Every day with you has been a gift. I love you more than words on this page could ever express. Happy anniversary, my love. ♥";
        if(ta.tagName === "TEXTAREA") ta.value = msg;
        else ta.textContent = msg;
        ta.style.borderColor = GOLD_PRIMARY;
        ta.style.boxShadow = "0 0 20px rgba(212,160,23,.3)";
      }
    }, 1500);
    setTimeout(spawnGifts, 2000);
  },

  // ── HIDDEN: special anniversary "eyes only" letter ──
  "hidden.html": function(){
    showAnniversaryBanner("🔒 This secret page has a special anniversary message");
    // Add a golden glow to the letter section
    setTimeout(function(){
      var letter = document.querySelector(".letter, .hidden-letter, [class*=letter], [class*=message], main");
      if(letter) letter.style.border = "1px solid rgba(212,160,23,.3)";
    }, 1000);
  },

  // ── LETTERS: 7th secret letter auto-unlocked ──
  "letters.html": function(){
    showAnniversaryBanner("💌 A 7th letter appears on our anniversary...");
    // Highlight all envelopes with gold glow
    setTimeout(function(){
      document.querySelectorAll("[class*=envelope], [class*=card], [class*=letter]").forEach(function(el){
        el.style.boxShadow = "0 0 30px rgba(212,160,23,.4)";
        el.style.transition = "box-shadow 1s ease";
      });
    }, 1500);
    setTimeout(spawnGifts, 2000);
  },

  // ── LOVE JAR: golden notes + extra sparkles ──
  "lovejar.html": function(){
    showAnniversaryBanner("✨ The love jar glows gold on our special day");
    // Make the jar glow
    setTimeout(function(){
      var jar = document.querySelector("[class*=jar], .jar, main");
      if(jar) jar.style.filter = "drop-shadow(0 0 30px rgba(212,160,23,.5))";
    }, 1000);
  },

  // ── PHOTO VAULT: auto-unlock + anniversary photos ──
  "photovault.html": function(){
    showAnniversaryBanner("📸 The vault opens — anniversary memories inside!");
    // Auto-unlock if there's a lock mechanism
    setTimeout(function(){
      var lock = document.querySelector("[class*=lock], [class*=pattern], .vault-lock");
      if(lock) lock.style.display = "none";
      var gallery = document.querySelector("[class*=gallery], [class*=photos], .vault-content");
      if(gallery) gallery.style.opacity = "1";
    }, 1500);
    setTimeout(spawnGifts, 2000);
  },

  // ── REASONS: "2 Years of Reasons" + special reason ──
  "reasons.html": function(){
    showAnniversaryBanner("💖 730 days, 730 reasons, infinite love");
    // Add anniversary badge near the counter
    setTimeout(function(){
      var counter = document.querySelector("[class*=counter], [class*=progress], [class*=reason]");
      if(counter) counter.parentElement.appendChild(makeAnnivBadge("Two Years of Loving You"));
    }, 1000);
    setTimeout(spawnGifts, 2500);
  },

  // ── SCRATCH: anniversary promise auto-revealed ──
  "scratch.html": function(){
    showAnniversaryBanner("🎁 Scratch to reveal your anniversary promise!");
    // Auto-scratch effect
    setTimeout(function(){
      var canvas = document.querySelector("canvas");
      if(canvas){
        var ctx = canvas.getContext("2d");
        if(ctx){
          // Fade the scratch cover
          ctx.globalCompositeOperation = "destination-out";
          ctx.fillStyle = "rgba(0,0,0,0.3)";
          for(var i=0;i<20;i++){
            ctx.beginPath();
            ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height, 30, 0, Math.PI*2);
            ctx.fill();
          }
        }
      }
    }, 2000);
    setTimeout(spawnGifts, 2500);
  },

  // ── STARS: anniversary constellation + special star ──
  "stars.html": function(){
    showAnniversaryBanner("⭐ Our stars shine brighter tonight");
    // Add a special golden star to the sky
    setTimeout(function(){
      var star = document.createElement("div");
      star.style.cssText = "position:fixed;top:15%;left:50%;transform:translate(-50%,-50%);z-index:9996;font-size:2.5rem;filter:drop-shadow(0 0 20px rgba(212,160,23,.8));pointer-events:none;animation:sparkleFloat 4s ease-in-out infinite";
      star.textContent = "✦";
      star.style.color = GOLD_LIGHT;
      document.body.appendChild(star);
      // Add "2" below
      var num = document.createElement("div");
      num.style.cssText = "position:fixed;top:25%;left:50%;transform:translate(-50%,0);z-index:9996;font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:700;color:"+GOLD_LIGHT+";text-shadow:0 0 30px rgba(212,160,23,.6);pointer-events:none";
      num.textContent = "2";
      document.body.appendChild(num);
    }, 1500);
    setTimeout(spawnGifts, 3000);
  },

  // ── VISITORS: anniversary badge on analytics ──
  "visitors.html": function(){
    showAnniversaryBanner("📊 Anniversary visit logged — 2 years of memories!");
    // Add badge
    setTimeout(function(){
      var main = document.querySelector("main, [class*=container], [class*=content]");
      if(main) main.prepend(makeAnnivBadge("2nd Anniversary Visit ♥"));
    }, 1000);
  }
};

// ══════════════════════════════════════════════════
// MAIN INIT
// ══════════════════════════════════════════════════

function init(){
  var page = getPageName();
  var nearDays = daysUntilAnniversary();

  // Always apply theme if within 30 days or on anniversary day
  if(isAnniversary() || nearDays <= 30){
    applyAnniversaryTheme();
  }

  // Countdown bar (30 days before)
  if(nearDays <= 30){
    buildCountdownBar();
  }

  if(isAnniversary()){
    document.body.classList.add("anniversary-day");

    // Core celebrations on every page
    spawnConfetti();
    setTimeout(spawnConfetti, 2000);
    setTimeout(spawnConfetti, 4000);
    setTimeout(showAnniversaryToast, 1200);
    spawnSparkles();
    setInterval(spawnSparkles, 8000);

    // Page-specific surprise
    if(pageSurprises[page]){
      setTimeout(function(){ pageSurprises[page](); }, 800);
    }
  } else if(isNearAnniversary()){
    // Pre-anniversary: just sparkles
    spawnSparkles();
  }
}

window.Anniversary = {
  isAnniversary: isAnniversary,
  isNearAnniversary: isNearAnniversary,
  daysUntil: daysUntilAnniversary,
  spawnConfetti: spawnConfetti,
  showToast: showAnniversaryToast,
  applyTheme: applyAnniversaryTheme,
  showBanner: showAnniversaryBanner,
  spawnGifts: spawnGifts,
  makeBadge: makeAnnivBadge
};

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

})();
