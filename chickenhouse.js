(function(){
"use strict";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const scene = $("#scene");
const chickensEl = $("#chickens");

// Load saved state
const saved = JSON.parse(localStorage.getItem("chickenhouse") || "{}");
const state = {
  eggs: saved.eggs || 0, gold: saved.gold || 0, day: saved.day !== undefined ? saved.day : true,
  earned: saved.earned || {}, feedCount: saved.feedCount || 0,
  rain: saved.rain || false, notesFound: saved.notesFound || [],
  chicks: [{el:$("#bc1"),x:20,bY:31},{el:$("#bc2"),x:70,bY:32},{el:$("#bc3"),x:45,bY:30}],
  namedChickens: saved.namedChickens || {}, totalEggs: saved.totalEggs || 0,
  hatchedCount: saved.hatchedCount || 0, flyingMsgs: []
};

function saveState(){
  localStorage.setItem("chickenhouse", JSON.stringify({
    eggs:state.eggs, gold:state.gold, day:state.day, earned:state.earned,
    feedCount:state.feedCount, rain:state.rain, notesFound:state.notesFound,
    namedChickens:state.namedChickens, totalEggs:state.totalEggs, hatchedCount:state.hatchedCount
  }));
}

// Love notes pool
const LOVE_NOTES=[
  {emoji:"&#x1F495;",text:"Every moment with you feels like a beautiful dream I never want to wake up from."},
  {emoji:"&#x1F339;",text:"You are the sunshine that brightens my darkest days."},
  {emoji:"&#x2764;&#xFE0F;",text:"I fall in love with you a little more every single day."},
  {emoji:"&#x1F48D;",text:"You are my today and all of my tomorrows."},
  {emoji:"&#x1F31F;",text:"In a sea of people, my eyes will always search for you."},
  {emoji:"&#x1F33B;",text:"You make ordinary moments feel magical."},
  {emoji:"&#x1F496;",text:"My heart is and always will be yours."},
  {emoji:"&#x1F30D;",text:"I love you not only for who you are, but for who I am when I am with you."},
  {emoji:"&#x2615;",text:"You are my cup of tea... no, my whole café."},
  {emoji:"&#x1F334;",text:"You are the palm tree in my garden of life."},
  {emoji:"&#x1F319;",text:"Even the moon is jealous of how you light up my night."},
  {emoji:"&#x1F49C;",text:"You are my favorite notification."},
  {emoji:"&#x1F9E1;",text:"I love you more than pizza... and that says a lot."},
  {emoji:"&#x1F4AB;",text:"You give me butterflies even after all this time."},
  {emoji:"&#x1F33F;",text:"You are the reason I believe in love."},
  {emoji:"&#x1F499;",text:"I choose you, and I will choose you over and over."},
  {emoji:"&#x2600;&#xFE0F;",text:"You are my sunshine on a rainy day."},
  {emoji:"&#x1F30A;",text:"Our love is deeper than the ocean."},
  {emoji:"&#x1F48E;",text:"You are my precious diamond."},
  {emoji:"&#x1F382;",text:"Every day with you is a gift I unwrap with joy."},
  {emoji:"&#x1F495;",text:"You are the plot twist I never saw coming but always needed."},
  {emoji:"&#x1F338;",text:"You are my cherry blossom in a world of thorns."},
  {emoji:"&#x1F525;",text:"You set my heart on fire with just a smile."},
  {emoji:"&#x1F30C;",text:"I found my universe in your eyes."},
  {emoji:"&#x1F496;",text:"You are the best thing that ever happened to me."}
];

const ACHS = [
  {id:"first",icon:"&#x1F423;",title:"First Egg!",desc:"Collected your first egg"},
  {id:"hunter",icon:"&#x1F426;",title:"Egg Hunter",desc:"Collected 10 eggs"},
  {id:"master",icon:"&#x1F3C1;",title:"Egg Master",desc:"Collected 25 eggs"},
  {id:"golden",icon:"&#x2B50;",title:"Golden Egg",desc:"Found a rare golden egg"},
  {id:"farmer",icon:"&#x1F33E;",title:"Legendary Farmer",desc:"Fed 50 times"},
  {id:"note5",icon:"&#x1F4DD;",title:"Love Writer",desc:"Found 5 love notes"},
  {id:"note15",icon:"&#x1F48C;",title:"Love Collector",desc:"Found 15 love notes"},
  {id:"hatch1",icon:"&#x1F425;",title:"Hatchling",desc:"Hatched your first chick"}
];

const CHICK_NAMES=["Nugget","Clucky","Sunny","Feathers","Pip","Cheep","Goldie","Cocoa","Buttercup","Snowball","Pepper","Cinnamon","Mochi","Tofu","Waffles"];

// Sound mute
let muted = localStorage.getItem("chickenhouse_muted") === "true";
const soundBtn = $("#soundToggle");
soundBtn.innerHTML = muted ? "&#x1F507;" : "&#x1F50A;";
soundBtn.classList.toggle("muted", muted);
soundBtn.addEventListener("click", ()=>{
  muted = !muted;
  localStorage.setItem("chickenhouse_muted", muted);
  soundBtn.innerHTML = muted ? "&#x1F507;" : "&#x1F50A;";
  soundBtn.classList.toggle("muted", muted);
});

// Stars
const starsEl = $("#stars");
const frag = document.createDocumentFragment();
for(let i=0;i<60;i++){const s=document.createElement("div");s.className="star";s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*50}%;animation-delay:${Math.random()*3}s`;frag.appendChild(s)}
starsEl.appendChild(frag);

// Chickens
const chickenDefs = [
  {type:"br",x:35,y:31},{type:"wh",x:55,y:32},{type:"bl",x:72,y:30},{type:"dk",x:18,y:33},
  {type:"br",x:48,y:31},{type:"wh",x:82,y:32},{type:"bl",x:12,y:30},{type:"dk",x:62,y:33}
];

function buildChicken(c,i){
  const d=document.createElement("div");
  d.className="chicken "+c.type+(i===0?" rooster":"")+(i===3?" duck":"");
  d.style.cssText=`left:${c.x}%;bottom:${c.y}%`;
  d.dataset.idx=i;
  d.innerHTML=`<div class="ch"><div class="ch-body"><div class="ch-feather f1"></div><div class="ch-feather f2"></div><div class="ch-feather f3"></div></div><div class="ch-neck"></div><div class="ch-head"><div class="ch-comb"></div><div class="ch-eye"></div><div class="ch-beak"></div><div class="ch-wattle"></div><div class="ch-ear"></div></div><div class="ch-wing"></div><div class="ch-tail"></div><div class="ch-legs"><div class="ch-leg"><div class="ch-foot"><div class="ch-toe"></div><div class="ch-toe"></div><div class="ch-toe"></div></div></div><div class="ch-leg"><div class="ch-foot"><div class="ch-toe"></div><div class="ch-toe"></div><div class="ch-toe"></div></div></div></div><div class="chicken-name"></div></div>`;
  d.addEventListener("click",()=>petChicken(d));
  if(state.namedChickens[i]) nameChicken(d,state.namedChickens[i]);
  return d;
}

chickenDefs.forEach((c,i)=>{chickensEl.appendChild(buildChicken(c,i))});

// Name chicken
function nameChicken(el,name){
  el.classList.add("named");
  el.querySelector(".chicken-name").textContent=name;
}

// Feed tracking per chicken
const chickenFeedCount={};
function petChicken(el){
  el.classList.add("happy");
  setTimeout(()=>el.classList.remove("happy"),500);
  spawnHeart(el,"&#x2764;&#xFE0F;",25);
  audio.play("heart");
  if(navigator.vibrate) navigator.vibrate(15);
  const idx=el.dataset.idx;
  chickenFeedCount[idx]=(chickenFeedCount[idx]||0)+1;
  if(chickenFeedCount[idx]>=8 && !state.namedChickens[idx]){
    const name=CHICK_NAMES[idx % CHICK_NAMES.length];
    state.namedChickens[idx]=name;
    nameChicken(el,name);
    toast(`&#x1F425; ${name} is your friend now!`);
    saveState();
  }
}

// Roam chickens
function roam(){
  $$(".chicken").forEach(c=>{
    setInterval(()=>{
      const dx=(Math.random()-.5)*8;
      const dy=(Math.random()-.5)*4;
      const x=parseFloat(c.style.left)+dx;
      const y=Math.max(29,Math.min(35,parseFloat(c.style.bottom)+dy));
      c.style.left=Math.max(5,Math.min(92,x))+"%";
      c.style.bottom=y+"%";
      c.classList.add("walk");
      setTimeout(()=>c.classList.remove("walk"),1500);
    },3000+Math.random()*4000);
  });
}
roam();

// Baby chicks wander + tap
function moveChicks(){
  state.chicks.forEach(ch=>{
    ch.x+=((Math.random()-.5)*15);
    ch.x=Math.max(10,Math.min(80,ch.x));
    ch.el.style.left=ch.x+"%";
    ch.el.style.bottom=(ch.bY+(Math.random()-.5)*3)+"%";
  });
}
setInterval(moveChicks,4000);
moveChicks();

$$(".baby-chick").forEach(bc=>{
  bc.addEventListener("click",()=>{
    spawnHeart(bc,"&#x1F496;",20);
    audio.play("heart");
    toast("&#x1F423; Cheep cheep!");
  });
});

// Chikoy mood system
const hour=new Date().getHours();
let chikoyMood="happy";
if(hour>=22||hour<5) chikoyMood="sleepy";
else if(hour>=5&&hour<7) chikoyMood="excited";
else if(hour>=17&&hour<19) chikoyMood="excited";

const chikoyEl=$("#chikoy");
chikoyEl.classList.add(chikoyMood);

// Chikoy roaming
let chikoyX=12,chikoyTargetX=12,chikoyTimer=null;

function chikoyRoam(){
  const targets=[12,20,30,68,78];
  chikoyTargetX=targets[Math.floor(Math.random()*targets.length)];
  const dist=Math.abs(chikoyTargetX-chikoyX);
  const dur=Math.max(1500,dist*80);
  chikoyEl.classList.add("walking");
  if(chikoyTargetX<chikoyX) chikoyEl.querySelector(".chikoy").style.transform="rotateY(5deg) scaleX(-1)";
  else chikoyEl.querySelector(".chikoy").style.transform="rotateY(-5deg)";
  chikoyEl.style.left=chikoyTargetX+"%";
  chikoyX=chikoyTargetX;
  setTimeout(()=>{chikoyEl.classList.remove("walking")},dur);
  chikoyTimer=setTimeout(chikoyRoam,4000+Math.random()*5000);
}
setTimeout(chikoyRoam,2000);

// Tap Chikoy for mood
chikoyEl.addEventListener("click",()=>{
  chikoyEl.classList.remove("sleeping","excited");
  if(chikoyMood==="happy"){chikoyMood="excited";chikoyEl.classList.add("excited")}
  else if(chikoyMood==="excited"){chikoyMood="sleepy";chikoyEl.classList.add("sleeping")}
  else{chikoyMood="happy"}
  toast(`&#x1F60A; Chikoy is ${chikoyMood}`);
});

// Eggs
function spawnEggs(){
  $$(".egg").forEach(e=>{
    e.classList.remove("got");
    if(Math.random()<.08) e.classList.add("golden");
    else e.classList.remove("golden");
  });
}
spawnEggs();
setInterval(spawnEggs,7000);

$$(".egg").forEach(e=>{
  e.addEventListener("click",()=>{
    if(e.classList.contains("got")) return;
    e.classList.add("got");
    state.eggs++;
    state.totalEggs++;
    if(e.classList.contains("golden")){state.gold++;showAch("golden");toast("&#x2B50; Golden Egg found!")}
    $("#eggC").textContent=state.eggs;
    $("#goldC").textContent=state.gold;
    $("#eggTotal").textContent=state.totalEggs;
    audio.play("egg");
    if(navigator.vibrate) navigator.vibrate(15);
    // Love note inside egg
    const note=LOVE_NOTES[Math.floor(Math.random()*LOVE_NOTES.length)];
    showLoveNote(note);
    if(state.totalEggs===1) showAch("first");
    if(state.totalEggs>=10) showAch("hunter");
    if(state.totalEggs>=25) showAch("master");
    // Check hatching
    if(state.totalEggs%20===0 && state.totalEggs>0) hatchEgg();
    saveState();
  });
});

// Love note modal
function showLoveNote(note){
  if(state.notesFound.length>=LOVE_NOTES.length) state.notesFound=[];
  const idx=LOVE_NOTES.indexOf(note);
  if(!state.notesFound.includes(idx)) state.notesFound.push(idx);
  const d=document.createElement("div");d.className="love-note-modal";
  d.innerHTML=`<div class="love-note-card"><span class="note-num">${state.notesFound.length}/${LOVE_NOTES.length}</span><span class="note-emoji">${note.emoji}</span><div class="note-text">"${note.text}"</div><div class="note-from">-- With love from Chikoy</div><button class="note-close">Close</button></div>`;
  document.body.appendChild(d);
  d.querySelector(".note-close").addEventListener("click",()=>d.remove());
  d.addEventListener("click",e=>{if(e.target===d) d.remove()});
}

// Egg hatching
function hatchEgg(){
  state.hatchedCount++;
  const d=document.createElement("div");d.className="hatch-overlay";
  d.innerHTML=`<div class="hatch-card"><span class="hatch-egg">&#x1F423;</span><div class="hatch-text">A new chick hatched!</div><button class="hatch-btn">Welcome!</button></div>`;
  document.body.appendChild(d);
  d.querySelector(".hatch-btn").addEventListener("click",()=>d.remove());
  d.addEventListener("click",e=>{if(e.target===d) d.remove()});
  audio.play("golden");
  showAch("hatch1");
  saveState();
}

// Init counters
$("#eggC").textContent=state.eggs;
$("#goldC").textContent=state.gold;
$("#eggTotal").textContent=state.totalEggs;

// Feed All
let feeding=false;
const feedLocations=[
  {x:30,y:31},{x:42,y:32},{x:58,y:31},{x:75,y:33},{x:20,y:30},{x:50,y:32},{x:65,y:31},{x:38,y:33}
];
const feedMessages=["&#x1F33E; Nom nom nom!","&#x1F425; Cluck cluck!","&#x1F33E; Yummy feed!","&#x1F425; Tasty!","&#x1F33E; More please!","&#x1F425; Delicious!"];

function feedAll(){
  if(feeding) return;
  feeding=true;
  setTimeout(()=>{feeding=false},1500);
  feedLocations.forEach(f=>{
    setTimeout(()=>{
      for(let i=0;i<3;i++){
        const p=document.createElement("div");
        p.className="feed-p";
        p.style.cssText=`left:${f.x+(Math.random()-0.5)*8}%;bottom:${f.y+2}%;--fx:${(Math.random()-0.5)*20}px;--fy:${-10-Math.random()*15}px`;
        scene.appendChild(p);
        setTimeout(()=>p.remove(),700);
      }
    },Math.random()*400);
  });
  state.feedCount++;
  if(state.feedCount>=50) showAch("farmer");
  audio.play("feed");
  audio.play("cluck");
  $$(".chicken").forEach(c=>{c.classList.add("peck");setTimeout(()=>c.classList.remove("peck"),1200)});
  // New animals react to feeding
  ["cow","capybara","rabbit","pig"].forEach(type=>{
    const el=$("#"+type) || $$(".farm-animal."+(type==="capybara"?"capybara":type))[0];
    if(el){el.classList.add("happy");setTimeout(()=>el.classList.remove("happy"),500)}
  });
  toast(feedMessages[Math.floor(Math.random()*feedMessages.length)]);
  if(navigator.vibrate) navigator.vibrate(15);
  saveState();
}

$("#feedBtn").addEventListener("click",feedAll);
$("#bucket").addEventListener("click",()=>{$("#bucket").classList.add("shake");setTimeout(()=>$("#bucket").classList.remove("shake"),400);feedAll()});
document.addEventListener("keydown",e=>{if(e.key==="f"||e.key==="F")feedAll()});

// Shake to feed (mobile)
let lastShake=0;
function handleMotion(e){
  const a=e.accelerationIncludingGravity;
  if(!a) return;
  const force=Math.abs(a.x)+Math.abs(a.y)+Math.abs(a.z);
  if(force>30 && Date.now()-lastShake>2000){
    lastShake=Date.now();
    feedAll();
    toast("&#x1F4F1; Shake detected - feeding time!");
  }
}
if(window.DeviceMotionEvent){
  if(typeof DeviceMotionEvent.requestPermission==="function"){
    document.addEventListener("click",()=>{DeviceMotionEvent.requestPermission().then(r=>{if(r==="granted")window.addEventListener("devicemotion",handleMotion)}).catch(()=>{})},{once:true});
  } else {window.addEventListener("devicemotion",handleMotion)}
}

// Heart rain
function spawnHeartRain(){
  if(!scene.classList.contains("night")) return;
  const h=document.createElement("div");h.className="heart-rain";
  h.innerHTML=["&#x2764;&#xFE0F;","&#x1F495;","&#x1F49C;","&#x1F496;","&#x1F9E1;"][Math.floor(Math.random()*5)];
  h.style.cssText=`left:${Math.random()*100}%;animation-duration:${4+Math.random()*4}s;animation-delay:${Math.random()*2}s;font-size:${.4+Math.random()*.4}rem`;
  scene.appendChild(h);
  setTimeout(()=>h.remove(),9000);
}
setInterval(spawnHeartRain,1500);

// Rain system
let rainInterval=null;
const rainBtn=$("#rainToggle");
if(state.rain) startRain();
rainBtn.addEventListener("click",()=>{
  state.rain=!state.rain;
  rainBtn.classList.toggle("active",state.rain);
  if(state.rain) startRain(); else stopRain();
  saveState();
});
function startRain(){
  if(rainInterval) return;
  rainBtn.classList.add("active");
  rainInterval=setInterval(()=>{
    for(let i=0;i<3;i++){
      const r=document.createElement("div");r.className="rain-drop";
      r.style.cssText=`left:${Math.random()*100}%;animation-duration:${.5+Math.random()*.5}s;animation-delay:${Math.random()*.3}s`;
      scene.appendChild(r);
      setTimeout(()=>{const s=document.createElement("div");s.className="rain-splash";s.style.cssText=`left:${r.style.left};bottom:30%`;scene.appendChild(s);setTimeout(()=>s.remove(),400);r.remove()},1200);
    }
  },100);
}
function stopRain(){
  if(rainInterval){clearInterval(rainInterval);rainInterval=null}
  rainBtn.classList.remove("active");
}

// Night mode envelope
function updateEnvelope(){
  $$(".envelope").forEach(e=>e.remove());
  if(!scene.classList.contains("night")) return;
  const env=document.createElement("div");env.className="envelope";
  env.innerHTML="&#x1F48C;";
  env.style.cssText="bottom:22%;left:46%";
  env.addEventListener("click",()=>{
    const note=LOVE_NOTES[Math.floor(Math.random()*LOVE_NOTES.length)];
    showLoveNote(note);
  });
  scene.appendChild(env);
}
const dayBtn=$("#dayToggle");
dayBtn.addEventListener("click",()=>{setTimeout(updateEnvelope,100)});
updateEnvelope();

// Seasonal decorations
const month=new Date().getMonth();
function spawnSeasonal(){
  const particles=[];
  if(month>=2&&month<=4) particles.push("&#x1F338;","&#x1F33A;"); // spring cherry blossoms
  else if(month>=5&&month<=7) particles.push("&#x1F33B;","&#x1F331;"); // summer sunflowers
  else if(month>=8&&month<=10) particles.push("&#x1F342;","&#x1F341;"); // autumn leaves
  else particles.push("&#x2744;&#xFE0F;","&#x1F328;&#xFE0F;"); // winter snow
  if(!particles.length) return;
  const p=document.createElement("div");p.className="season-particle";
  p.innerHTML=particles[Math.floor(Math.random()*particles.length)];
  p.style.cssText=`left:${Math.random()*100}%;animation-duration:${5+Math.random()*5}s;font-size:${.4+Math.random()*.4}rem`;
  scene.appendChild(p);
  setTimeout(()=>p.remove(),11000);
}
setInterval(spawnSeasonal,2500);

// Fireflies at night
function spawnFirefly(){
  if(!scene.classList.contains("night")) return;
  const f=document.createElement("div");f.className="firefly";
  f.style.cssText=`left:${Math.random()*80+10}%;bottom:${30+Math.random()*30}%;--ffx:${(Math.random()-0.5)*40}px;--ffy:${-20+Math.random()*40}px;animation-delay:${Math.random()*2}s;animation-duration:${2+Math.random()*3}s`;
  scene.appendChild(f);
  setTimeout(()=>f.remove(),6000);
}
setInterval(spawnFirefly,2000);

// Love message launcher
const launcherBtn=$("#launcherBtn");
const launcherInput=$("#launcherInput");
launcherBtn.addEventListener("click",()=>{launcherInput.classList.toggle("show");if(launcherInput.classList.contains("show"))launcherInput.focus()});
launcherInput.addEventListener("keydown",e=>{
  if(e.key==="Enter"&&launcherInput.value.trim()){
    launchMessage(launcherInput.value.trim());
    launcherInput.value="";
    launcherInput.classList.remove("show");
  }
  if(e.key==="Escape") launcherInput.classList.remove("show");
});
function launchMessage(text){
  const m=document.createElement("div");m.className="flying-msg";
  m.textContent=text;
  m.style.cssText=`left:5%;bottom:${40+Math.random()*30}%`;
  scene.appendChild(m);
  setTimeout(()=>m.remove(),6500);
}

// Achievement
function showAch(id){
  if(state.earned[id]) return;
  state.earned[id]=true;
  const a=ACHS.find(x=>x.id===id);if(!a)return;
  const d=document.createElement("div");d.className="achievement";
  d.innerHTML=`<span class="ach-icon">${a.icon}</span><div class="ach-title">${a.title}</div><div class="ach-desc">${a.desc}</div>`;
  document.body.appendChild(d);setTimeout(()=>d.remove(),3000);
  audio.play("golden");
  saveState();
}

// Day/Night
if(!state.day){scene.classList.add("night");$("#dayToggle").innerHTML="&#x1F319;"}
dayBtn.addEventListener("click",()=>{
  state.day=!state.day;
  scene.classList.toggle("night",!state.day);
  dayBtn.innerHTML=state.day?"&#x2600;&#xFE0F;":"&#x1F319;";
  saveState();
});

// Coop door
const doorEl=$(".door");
if(doorEl){
  let doorOpen=false;
  doorEl.addEventListener("click",()=>{
    doorOpen=!doorOpen;
    doorEl.classList.toggle("open",doorOpen);
    if(doorOpen){toast("&#x1F425; Welcome inside!");audio.play("cluck")}
    else toast("&#x1F425; Door closed");
  });
}

// Toast
function toast(msg){
  const t=document.createElement("div");t.className="toast";t.innerHTML=msg;
  document.body.appendChild(t);setTimeout(()=>t.remove(),2500);
}

// ── New Animals: Cow, Capybara, Rabbit, Pig ──
const ANIMAL_NAMES={
  cow:["Bessie","Daisy","Buttercup","Clover","Milky"],
  capybara:["Chill","Zen","Mochi","Bento","Soba"],
  rabbit:["Floppy","Thumper","Honey","Cotton","Clover"],
  pig:["Hamlet","Truffle","Snorty","Oink","Babe"]
};

function setupAnimal(el, type, clickAnim, sound, toastMsg, roamArea){
  const savedNames = JSON.parse(localStorage.getItem("chickenhouse_animals") || "{}");
  let tapCount = 0;

  el.addEventListener("click", ()=>{
    el.classList.remove(clickAnim);
    void el.offsetWidth;
    el.classList.add(clickAnim);
    setTimeout(()=>el.classList.remove(clickAnim), 500);

    spawnHeart(el, "&#x2764;&#xFE0F;", 20);
    audio.play(sound);
    if(navigator.vibrate) navigator.vibrate(15);
    toast(toastMsg);

    tapCount++;
    if(tapCount >= 5 && !savedNames[type]){
      const names = ANIMAL_NAMES[type];
      const name = names[Math.floor(Math.random()*names.length)];
      savedNames[type] = name;
      localStorage.setItem("chickenhouse_animals", JSON.stringify(savedNames));
      el.classList.add("named");
      el.querySelector(".animal-name").textContent = name;
      toast("&#x1F31F; " + name + " is your friend now!");
      audio.play("golden");
    }
  });

  // Restore saved name
  if(savedNames[type]){
    el.classList.add("named");
    el.querySelector(".animal-name").textContent = savedNames[type];
  }

  // Idle roaming
  if(roamArea){
    const pen = el.parentElement;
    setInterval(()=>{
      const dx = (Math.random()-.5)*6;
      const cur = parseFloat(pen.style.left) || roamArea.start;
      const next = Math.max(roamArea.min, Math.min(roamArea.max, cur + dx));
      pen.style.left = next + "%";
    }, 3000 + Math.random()*3000);
  }
}

const ANIMAL_TOASTS = {
  cow: ["&#x1F404; Moo moo!","&#x1F404; *happy cow noises*","&#x1F404; Moooo!"],
  capybara: ["&#x1F43F; *chill capybara sounds*","&#x1F43F; So relaxed...","&#x1F43F; Capybara vibes~"],
  rabbit: ["&#x1F407; *hop hop!*","&#x1F407; Thump thump!","&#x1F407; Squeak!"],
  pig: ["&#x1F437; Oink oink!","&#x1F437; *happy pig snorts*","&#x1F437; Snorty!"]
};

function randomToast(type){
  const msgs = ANIMAL_TOASTS[type];
  return msgs[Math.floor(Math.random()*msgs.length)];
}

setupAnimal($("#cow"), "cow", "happy", "moo", randomToast("cow"), {start:3, min:1, max:25});
setupAnimal($("#capybara"), "capybara", "happy", "chill", randomToast("capybara"), {start:70, min:55, max:88});
setupAnimal($("#rabbit"), "rabbit", "hop", "squeak", randomToast("rabbit"), {start:38, min:28, max:52});
setupAnimal($("#pig"), "pig", "happy", "oink", randomToast("pig"), {start:55, min:42, max:68});

// Capybara idle animation: occasionally sit down
setInterval(()=>{
  const capy = $("#capybara");
  if(Math.random()<.3){
    capy.style.transform = "scaleY(.9)";
    setTimeout(()=>{ capy.style.transform = "" }, 2000);
  }
}, 5000);

// Rabbit random hop
setInterval(()=>{
  const rab = $("#rabbit");
  if(Math.random()<.4){
    rab.classList.add("hop");
    setTimeout(()=>rab.classList.remove("hop"), 400);
  }
}, 4000);

// Pig snort particles
setInterval(()=>{
  if(Math.random()<.3){
    const pigPen = $("#pigSty");
    const p = document.createElement("div");
    p.className = "heart-pop";
    p.innerHTML = "&#x1F4A8;";
    p.style.cssText = `left:${pigPen.offsetLeft + 30}px;bottom:22%;--hx:${(Math.random()-.5)*20}px;--hy:-20px`;
    scene.appendChild(p);
    setTimeout(()=>p.remove(), 700);
  }
}, 6000);

// Cow moo particles at night
setInterval(()=>{
  if(!scene.classList.contains("night")) return;
  if(Math.random()<.3){
    const cowPen = $("#cowPen");
    const p = document.createElement("div");
    p.className = "heart-pop";
    p.innerHTML = "&#x1F4AC;";
    p.style.cssText = `left:${cowPen.offsetLeft + 20}px;bottom:20%;--hx:${(Math.random()-.5)*15}px;--hy:-25px;font-size:.5rem`;
    scene.appendChild(p);
    setTimeout(()=>p.remove(), 700);
  }
}, 7000);

// Hint cycling
const hints=["Tap chickens to pet them","Tap eggs to collect love notes","Feed all chickens!","Tap the bucket to feed","Try day/night mode","Find the golden egg!","Tap baby chicks","Open the coop door","Shake to feed on mobile","Send a love message","Tap Chikoy to change mood","Try rain at night!","Chickens get names when fed","Meet the cow! Tap to pet","The capybara is so chill~","Tap the rabbit to make it hop","The pig loves oink oink!"];
let hintIdx=0;
function showHint(){$("#hint").textContent=hints[hintIdx%hints.length];hintIdx++}
showHint();
setInterval(showHint,6000);

// Picture card
const picImg=$("#picImg");
const sources=["chickenhouse-photos/1.jpg","chickenhouse-banner.jpg"];
let loaded=false;
sources.forEach(src=>{if(!loaded){const i=new Image();i.onload=()=>{picImg.src=src;loaded=true};i.onerror=()=>{};i.src=src}});
$("#picCard").addEventListener("click",()=>{if(picImg.requestFullscreen)picImg.requestFullscreen().catch(()=>{})});

// Web Audio
const audio={ctx:null,listeners:[],init(){if(this.ctx)return;this.ctx=new(window.AudioContext||window.webkitAudioContext)();document.removeEventListener("touchstart",this.listeners[0]);document.removeEventListener("click",this.listeners[1])},play(t){if(!this.ctx||muted)return;try{if(this.ctx.state==="suspended")this.ctx.resume();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.connect(g);g.connect(this.ctx.destination);const n=this.ctx.currentTime;
if(t==="cluck"){o.type="sine";o.frequency.setValueAtTime(400,n);o.frequency.exponentialRampToValueAtTime(250,n+.12);g.gain.setValueAtTime(.1,n);g.gain.exponentialRampToValueAtTime(.001,n+.15);o.start(n);o.stop(n+.15)}
else if(t==="feed"){o.type="triangle";o.frequency.setValueAtTime(800,n);o.frequency.exponentialRampToValueAtTime(300,n+.15);g.gain.setValueAtTime(.07,n);g.gain.exponentialRampToValueAtTime(.001,n+.18);o.start(n);o.stop(n+.18)}
else if(t==="egg"){o.type="sine";o.frequency.setValueAtTime(500,n);o.frequency.exponentialRampToValueAtTime(900,n+.15);g.gain.setValueAtTime(.1,n);g.gain.exponentialRampToValueAtTime(.001,n+.18);o.start(n);o.stop(n+.18)}
else if(t==="golden"){o.type="sine";[523,659,784,1047].forEach((f,i)=>{o.frequency.setValueAtTime(f,n+i*.1)});g.gain.setValueAtTime(.12,n);g.gain.exponentialRampToValueAtTime(.001,n+.5);o.start(n);o.stop(n+.5)}
else if(t==="heart"){o.type="sine";o.frequency.setValueAtTime(600,n);o.frequency.exponentialRampToValueAtTime(800,n+.1);g.gain.setValueAtTime(.08,n);g.gain.exponentialRampToValueAtTime(.001,n+.15);o.start(n);o.stop(n+.15)}
else if(t==="moo"){o.type="sawtooth";o.frequency.setValueAtTime(150,n);o.frequency.exponentialRampToValueAtTime(120,n+.4);g.gain.setValueAtTime(.06,n);g.gain.exponentialRampToValueAtTime(.001,n+.5);o.start(n);o.stop(n+.5)}
else if(t==="oink"){o.type="square";o.frequency.setValueAtTime(350,n);o.frequency.exponentialRampToValueAtTime(200,n+.08);g.gain.setValueAtTime(.06,n);g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.12)}
else if(t==="squeak"){o.type="sine";o.frequency.setValueAtTime(900,n);o.frequency.exponentialRampToValueAtTime(1200,n+.05);g.gain.setValueAtTime(.07,n);g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.1)}
else if(t==="chill"){o.type="sine";o.frequency.setValueAtTime(300,n);o.frequency.exponentialRampToValueAtTime(280,n+.3);g.gain.setValueAtTime(.04,n);g.gain.exponentialRampToValueAtTime(.001,n+.35);o.start(n);o.stop(n+.35)}
}catch(e){}}
};
audio.listeners=[()=>audio.init(),()=>audio.init()];
document.addEventListener("touchstart",audio.listeners[0]);
document.addEventListener("click",audio.listeners[1]);

})();
