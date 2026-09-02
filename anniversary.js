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
var HER_NAME         = "Rezil";
var OUR_DATE         = "September 10, 2024";
var DAILY_PAGES      = ["lovepage.html","letters.html","chickenhouse.html","finale.html","stars.html","lovejar.html","photovault.html"];

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
  var displayMsg = msg || personalize(ANNIVERSARY_MSG + ", {name}!");
  var displaySub = sub || personalize("September 10, 2024 — {date}. 2 Years Together");
  t.innerHTML = '<div class="at-emoji">'+(emoji||"🥂")+'</div><div class="at-msg">'+displayMsg+'</div><div class="at-sub">'+displaySub+'</div>';
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

  // ── LOVEPAGE: full anniversary transformation ──
  "lovepage.html": function(){
    // Transform the hero section
    var hero = document.getElementById("hero");
    if(hero){
      hero.style.background = "linear-gradient(135deg,rgba(26,15,20,.95),rgba(50,30,15,.9))";
      hero.style.transition = "background 2s ease";
    }
    // Change "Our Love Story" to anniversary message
    var label = document.querySelector(".hero-label");
    if(label){
      label.textContent = "Our Anniversary";
      label.style.color = GOLD_LIGHT;
      label.style.textShadow = "0 0 20px rgba(212,160,23,.6)";
    }
    // Change tagline
    var tagline = document.querySelector(".hero-tagline");
    if(tagline){
      tagline.textContent = personalize("2 years since {date}, {name}. I love you more than words.");
      tagline.style.color = GOLD_LIGHT;
    }
    // Change scroll hint
    var scrollHint = document.querySelector(".scroll-hint span");
    if(scrollHint) scrollHint.textContent = "celebrate";

    // Override CSS variables for full gold theme
    var s = document.createElement("style");
    s.id = "anniversary-lovepage";
    s.textContent =
      ".anniversary .hero{background:linear-gradient(180deg,rgba(26,15,20,.95),rgba(50,30,15,.95))!important}" +
      ".anniversary .section{border-color:rgba(212,160,23,.2)!important}" +
      ".anniversary .section-header .section-label{color:"+GOLD_LIGHT+"!important}" +
      ".anniversary .section-header .section-title{color:"+GOLD_LIGHT+"!important;text-shadow:0 0 30px rgba(212,160,23,.3)}" +
      ".anniversary .time-card{border-color:rgba(212,160,23,.3)!important;background:rgba(50,30,15,.8)!important}" +
      ".anniversary .time-number{color:"+GOLD_LIGHT+"!important}" +
      ".anniversary .time-label{color:rgba(245,215,110,.5)!important}" +
      ".anniversary .forever-note{color:"+GOLD_LIGHT+"!important}" +
      ".anniversary .hero-names,.anniversary #heroNames{color:"+GOLD_LIGHT+"!important}" +
      ".anniversary .shimmer-text{background:linear-gradient(90deg,#d4a017,#f5d76e,#d4a017)!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;background-clip:text!important}" +
      ".anniversary .ampersand{color:"+GOLD_PRIMARY+"!important}" +
      ".anniversary .section-card,.anniversary .card{border-color:rgba(212,160,23,.25)!important}" +
      ".anniversary .scroll-progress{background:"+GOLD_PRIMARY+"!important}" +
      ".anniversary .scroll-progress::-webkit-progress-bar{background:"+GOLD_PRIMARY+"!important}" +
      ".anniversary .music-toggle{border-color:rgba(212,160,23,.4)!important}" +
      ".anniversary .anniv-lock{border-color:rgba(212,160,23,.3)!important}" +
      ".anniversary .anniv-lock-title{color:"+GOLD_LIGHT+"!important}" +
      ".anniversary .anniv-lock-emoji{color:"+GOLD_LIGHT+"!important;font-size:2rem!important;animation:pulse 2s infinite}" +
      "@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}" +
      ".anniversary .anniv-sub{color:rgba(245,215,110,.6)!important}" +
      ".anniversary .lock-title .shimmer{background:linear-gradient(90deg,#d4a017,#f5d76e,#d4a017)!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;background-clip:text!important}" +
      ".anniversary .lock-subtitle{color:rgba(245,215,110,.5)!important}" +
      ".anniversary .hero{position:relative;overflow:hidden}" +
      ".anniversary .hero::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at 50% 30%,rgba(212,160,23,.08),transparent 70%);pointer-events:none;z-index:1}" +
      ".anniversary-hearts .heart{color:"+GOLD_LIGHT+"!important}";
    document.head.appendChild(s);

    // Spawn gold floating hearts in hero
    var heartsContainer = document.getElementById("heartsContainer");
    if(heartsContainer){
      for(var i=0;i<15;i++){
        (function(d){
          setTimeout(function(){
            var h = document.createElement("span");
            h.className = "heart";
            h.textContent = "♥";
            h.style.cssText = "position:absolute;left:"+Math.random()*100+"%;bottom:-20px;font-size:"+(Math.random()*1.5+.5)+"rem;color:"+GOLD_LIGHT+";opacity:.6;animation:annivFall "+(Math.random()*4+4)+"s linear forwards;pointer-events:none";
            heartsContainer.appendChild(h);
            setTimeout(function(){h.remove()},8000);
          }, d);
        })(i * 300);
      }
    }

    // Add "2 Years" badge to hero
    var heroContent = document.querySelector(".hero-content");
    if(heroContent){
      var badge = makeAnnivBadge("2 Years of Loving You ♥");
      badge.style.marginTop = ".8rem";
      heroContent.appendChild(badge);
    }

    // Gold flower gift
    var flowerGift = document.getElementById("flowerGift");
    if(flowerGift){
      flowerGift.style.borderColor = "rgba(212,160,23,0.5)";
      flowerGift.style.background = "rgba(212,160,23,0.1)";
      flowerGift.style.color = GOLD_LIGHT;
    }

    // Banner
    showAnniversaryBanner("🥂 Happy 2nd Anniversary! — Today is OUR day");

    // Auto-open anniversary section
    setTimeout(function(){
      if(typeof window.openAnnivPage === "function") window.openAnnivPage();
    }, 3000);

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
    showAnniversaryBanner("🎆 " + HER_NAME + ", two years of love, laughter, and forever");
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
    showAnniversaryBanner("🌌 " + HER_NAME + ", the sky celebrates our love tonight");
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
    showAnniversaryBanner("🎊 " + HER_NAME + ", Chikoy's room is decorated for our anniversary!");
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
    showAnniversaryBanner("📖 A special entry for today, " + HER_NAME + "...");
    // Pre-fill the diary with an anniversary entry
    setTimeout(function(){
      var ta = document.querySelector("textarea, .diary-input, [contenteditable]");
      if(ta){
        var msg = personalize("Today marks 2 years since {date}. Every day with you, {name}, has been a gift. I love you more than words on this page could ever express. Happy anniversary, my love. ♥");
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
    showAnniversaryBanner("💌 " + HER_NAME + ", a 7th letter appears on our anniversary...");
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
    showAnniversaryBanner("✨ " + HER_NAME + ", the love jar glows gold on our special day");
    // Make the jar glow
    setTimeout(function(){
      var jar = document.querySelector("[class*=jar], .jar, main");
      if(jar) jar.style.filter = "drop-shadow(0 0 30px rgba(212,160,23,.5))";
    }, 1000);
  },

  // ── PHOTO VAULT: auto-unlock + anniversary photos ──
  "photovault.html": function(){
    showAnniversaryBanner("📸 " + HER_NAME + ", the vault opens — anniversary memories inside!");
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
    showAnniversaryBanner("💖 " + HER_NAME + ", 730 days, 730 reasons, infinite love");
    // Add anniversary badge near the counter
    setTimeout(function(){
      var counter = document.querySelector("[class*=counter], [class*=progress], [class*=reason]");
      if(counter) counter.parentElement.appendChild(makeAnnivBadge("Two Years of Loving " + HER_NAME));
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
    showAnniversaryBanner("⭐ " + HER_NAME + ", our stars shine brighter tonight");
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
  },

  // ── FLOWERS: golden petals + 3D bouquet glow ──
  "flowers.html": function(){
    // Staged reveal: tease → reveal → celebrate
    stagedReveal([
      { delay: 500, fn: function(){
        showAnniversaryBanner("💐 " + HER_NAME + ", every flower blooms for you");
      }},
      { delay: 1200, fn: function(){
        // Make all flower heads glow gold
        var heads = document.querySelectorAll(".flower-head");
        heads.forEach(function(h, i){
          setTimeout(function(){
            h.classList.add("active");
            h.style.filter = "drop-shadow(0 0 16px rgba(212,160,23,0.7)) brightness(1.3)";
          }, i * 150);
        });
        // Title gold
        var title = document.querySelector(".flowers-title");
        if(title) title.style.color = GOLD_LIGHT;
        // Change bouquet to gold
        var bouquet = document.getElementById("bouquet");
        if(bouquet) bouquet.style.filter = "drop-shadow(0 10px 30px rgba(212,160,23,0.4))";
      }},
      { delay: 3000, fn: function(){
        // Show special anniversary message
        var flowerName = document.getElementById("flowerName");
        var flowerText = document.getElementById("flowerText");
        var flowerMessage = document.getElementById("flowerMessage");
        if(flowerText && flowerMessage){
          flowerName.textContent = "💐 Happy 2nd Anniversary, " + HER_NAME + "!";
          flowerText.textContent = personalize("Two years of love, two years of us. You are my forever garden, {name}. Every flower here blooms for you, today and always. Since {date}, you have been my everything.");
          flowerText.style.color = GOLD_LIGHT;
          flowerMessage.classList.add("show");
        }
      }}
    ]);
    // Golden petals continuously
    var petalInterval = setInterval(function(){
      var petals = ["🌹","🌻","🌷","🌸","✨","💗","🏵️","💮"];
      var el = document.createElement("span");
      el.className = "falling-petal";
      el.textContent = petals[Math.floor(Math.random() * petals.length)];
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDuration = (Math.random() * 3 + 3) + "s";
      document.body.appendChild(el);
      setTimeout(function(){ el.remove(); }, 6000);
    }, 600);
    // Gold sparkle ring
    var ring = document.querySelector(".sparkle-ring");
    if(ring) ring.style.borderColor = "rgba(212,160,23,0.3)";
  }
};

// ══════════════════════════════════════════════════
// STAGED REVEAL SYSTEM
// ══════════════════════════════════════════════════

function stagedReveal(stages, onComplete){
  // stages: [{ delay, fn }] — runs each stage in sequence
  var i = 0;
  function next(){
    if(i >= stages.length){ if(onComplete) onComplete(); return; }
    var s = stages[i++];
    setTimeout(function(){
      s.fn();
      next();
    }, s.delay || 500);
  }
  next();
}

function personalize(text){
  return text.replace(/\{name\}/g, HER_NAME).replace(/\{date\}/g, OUR_DATE);
}

// ══════════════════════════════════════════════════
// EASTER EGG CHAIN — visit 3+ pages unlocks secret
// ══════════════════════════════════════════════════

function trackPageVisit(){
  var visited = JSON.parse(storeGet("anniv_visited") || "[]");
  var page = getPageName();
  if(visited.indexOf(page) === -1) visited.push(page);
  storeSet("anniv_visited", JSON.stringify(visited));
  return visited;
}

function checkEasterEgg(visited){
  if(visited.length < 3) return;
  if(storeGet("anniv_egg_unlocked") === "1") return;
  storeSet("anniv_egg_unlocked", "1");
  // Secret 17th surprise
  setTimeout(function(){
    showAnniversaryToast(
      " You found the secret, " + HER_NAME + "!",
      "You've visited " + visited.length + " pages — this moment is just for us.",
      "🔮"
    );
    spawnConfetti(20);
    // Floating golden heart
    var heart = document.createElement("div");
    heart.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);z-index:10001;font-size:4rem;pointer-events:none;animation:annivHeartBurst 3s cubic-bezier(.34,1.56,.64,1) forwards";
    heart.textContent = "💛";
    document.body.appendChild(heart);
    setTimeout(function(){ heart.remove(); }, 3500);
    // Add the keyframe
    if(!document.getElementById("anniv-heart-keyframe")){
      var s = document.createElement("style");
      s.id = "anniv-heart-keyframe";
      s.textContent = "@keyframes annivHeartBurst{0%{transform:translate(-50%,-50%) scale(0) rotate(0);opacity:0}30%{transform:translate(-50%,-50%) scale(1.3) rotate(10deg);opacity:1}60%{transform:translate(-50%,-50%) scale(1) rotate(-5deg);opacity:1}100%{transform:translate(-50%,-50%) scale(0.8) rotate(0);opacity:0}}";
      document.head.appendChild(s);
    }
  }, 2000);
}

// ══════════════════════════════════════════════════
// DAILY UNLOCK — one surprise per day Sep 7–13
// ══════════════════════════════════════════════════

function getDailyUnlockDay(){
  var n = new Date();
  if(n.getFullYear() !== 2026 || n.getMonth() !== 8) return -1;
  var day = n.getDate();
  if(day < 7 || day > 13) return -1;
  return day - 7; // 0–6
}

function checkDailyUnlock(){
  var dayIdx = getDailyUnlockDay();
  if(dayIdx < 0) return;
  var unlocked = JSON.parse(storeGet("anniv_daily") || "[]");
  if(unlocked.indexOf(dayIdx) !== -1) return; // already unlocked today
  unlocked.push(dayIdx);
  storeSet("anniv_daily", JSON.stringify(unlocked));

  var dailyMessages = [
    { emoji: "🌸", msg: "3 days until our anniversary, " + HER_NAME + ". I'm counting every moment.", sub: "Day 1 of 7" },
    { emoji: "💛", msg: "2 more days, my love. You are my every heartbeat.", sub: "Day 2 of 7" },
    { emoji: "✨", msg: "Tomorrow is our day, " + HER_NAME + ". I have something special planned.", sub: "Day 3 of 7" },
    { emoji: "🥂", msg: "Today is the day, " + HER_NAME + ". Happy Anniversary, my forever love.", sub: "Day 4 of 7 — Today!" },
    { emoji: "💐", msg: "The celebration continues, " + HER_NAME + ". Every day with you is a gift.", sub: "Day 5 of 7" },
    { emoji: "🔮", msg: "Still celebrating us, " + HER_NAME + ". Our love grows stronger.", sub: "Day 6 of 7" },
    { emoji: "💛", msg: "What a week, " + HER_NAME + ". Here's to forever more.", sub: "Day 7 of 7" }
  ];
  var d = dailyMessages[dayIdx];
  setTimeout(function(){
    showAnniversaryToast(d.msg, d.sub, d.emoji);
    spawnSparkles();
  }, 2000);
}

// ══════════════════════════════════════════════════
// FLOWERS: GOLDEN MESSAGE CARDS
// ══════════════════════════════════════════════════

function spawnGoldenCard(x, y, text){
  var card = document.createElement("div");
  card.style.cssText = "position:fixed;left:"+x+"px;top:"+y+"px;z-index:9998;pointer-events:none;padding:.6rem 1rem;border-radius:10px;background:rgba(13,8,18,.92);border:1px solid rgba(212,160,23,.4);backdrop-filter:blur(8px);font-family:'Cormorant Garamond',serif;font-size:.85rem;color:"+GOLD_LIGHT+";box-shadow:0 0 20px rgba(212,160,23,.2);animation:goldenCardFloat 3s ease-out forwards;max-width:200px;text-align:center";
  card.textContent = text;
  document.body.appendChild(card);
  if(!document.getElementById("golden-card-keyframe")){
    var s = document.createElement("style");
    s.id = "golden-card-keyframe";
    s.textContent = "@keyframes goldenCardFloat{0%{opacity:0;transform:translateY(0) scale(.8)}15%{opacity:1;transform:translateY(-10px) scale(1)}70%{opacity:1;transform:translateY(-40px) scale(1)}100%{opacity:0;transform:translateY(-70px) scale(.9)}}";
    document.head.appendChild(s);
  }
  setTimeout(function(){ card.remove(); }, 3200);
}

// ══════════════════════════════════════════════════
// MAIN INIT
// ══════════════════════════════════════════════════

function init(){
  var page = getPageName();
  var nearDays = daysUntilAnniversary();
  var visited = trackPageVisit();

  // Always apply theme if within 30 days or on anniversary day
  if(isAnniversary() || nearDays <= 30){
    applyAnniversaryTheme();
  }

  // Daily unlock check
  checkDailyUnlock();

  // Countdown bar (30 days before) — skip on flowers page
  if(nearDays <= 30 && !document.getElementById("bouquet")){
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

    // Easter egg check
    checkEasterEgg(visited);

    // Page-specific surprise (staged)
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
  makeBadge: makeAnnivBadge,
  stagedReveal: stagedReveal,
  spawnGoldenCard: spawnGoldenCard,
  personalize: personalize
};

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

})();
