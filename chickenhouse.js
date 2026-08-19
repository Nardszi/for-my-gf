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
  chicks: [{el:$("#bc1"),x:20,bY:31},{el:$("#bc2"),x:70,bY:32},{el:$("#bc3"),x:45,bY:30}]
};

function saveState(){
  localStorage.setItem("chickenhouse", JSON.stringify({
    eggs:state.eggs, gold:state.gold, day:state.day,
    earned:state.earned, feedCount:state.feedCount
  }));
}

const ACHS = [
  {id:"first",icon:"&#x1F423;",title:"First Egg!",desc:"Collected your first egg"},
  {id:"hunter",icon:"&#x1F426;",title:"Egg Hunter",desc:"Collected 10 eggs"},
  {id:"master",icon:"&#x1F3C1;",title:"Egg Master",desc:"Collected 25 eggs"},
  {id:"golden",icon:"&#x2B50;",title:"Golden Egg",desc:"Found a rare golden egg"},
  {id:"farmer",icon:"&#x1F33E;",title:"Legendary Farmer",desc:"Fed 50 times"}
];

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
  d.innerHTML=`<div class="ch"><div class="ch-body"><div class="ch-feather f1"></div><div class="ch-feather f2"></div><div class="ch-feather f3"></div></div><div class="ch-neck"></div><div class="ch-head"><div class="ch-comb"></div><div class="ch-eye"></div><div class="ch-beak"></div><div class="ch-wattle"></div><div class="ch-ear"></div></div><div class="ch-wing"></div><div class="ch-tail"></div><div class="ch-legs"><div class="ch-leg"><div class="ch-foot"><div class="ch-toe"></div><div class="ch-toe"></div><div class="ch-toe"></div></div></div><div class="ch-leg"><div class="ch-foot"><div class="ch-toe"></div><div class="ch-toe"></div><div class="ch-toe"></div></div></div></div></div>`;
  d.addEventListener("click",()=>petChicken(d));
  return d;
}

chickenDefs.forEach((c,i)=>{chickensEl.appendChild(buildChicken(c,i))});

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

// Pet chicken
function petChicken(el){
  el.classList.add("happy");
  setTimeout(()=>el.classList.remove("happy"),500);
  spawnHeart(el,"&#x2764;&#xFE0F;",25);
  audio.play("heart");
  if(navigator.vibrate) navigator.vibrate(15);
}

// Baby chicks wander
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

// Baby chicks tap
$$(".baby-chick").forEach(bc=>{
  bc.addEventListener("click",()=>{
    spawnHeart(bc,"&#x1F496;",20);
    audio.play("heart");
    toast("&#x1F423; Cheep cheep!");
  });
});

// Chikoy roaming - avoid coop (center 42-58%)
const chikoyEl=$("#chikoy");
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

// Eggs
function spawnEggs(){
  const eggs=$$(".egg");
  eggs.forEach(e=>{
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
    if(e.classList.contains("golden")){state.gold++;showAch("golden");toast("&#x2B50; Golden Egg found!")}
    $("#eggC").textContent=state.eggs;
    $("#goldC").textContent=state.gold;
    spawnEggPop(e,"&#x1F423;");
    if(state.eggs===1) showAch("first");
    if(state.eggs>=10) showAch("hunter");
    if(state.eggs>=25) showAch("master");
    audio.play("egg");
    if(navigator.vibrate) navigator.vibrate(15);
    saveState();
  });
});

// Init counters from saved state
$("#eggC").textContent=state.eggs;
$("#goldC").textContent=state.gold;

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
  toast(feedMessages[Math.floor(Math.random()*feedMessages.length)]);
  if(navigator.vibrate) navigator.vibrate(15);
  saveState();
}

$("#feedBtn").addEventListener("click",feedAll);
$("#bucket").addEventListener("click",()=>{$("#bucket").classList.add("shake");setTimeout(()=>$("#bucket").classList.remove("shake"),400);feedAll()});

document.addEventListener("keydown",e=>{if(e.key==="f"||e.key==="F")feedAll()});

// Egg pop animation
function spawnEggPop(el,icon){
  const p=document.createElement("div");p.className="egg-pop";p.innerHTML=icon;
  const r=el.getBoundingClientRect();
  p.style.left=r.left+r.width/2+"px";p.style.top=r.top+"px";
  document.body.appendChild(p);setTimeout(()=>p.remove(),600);
}

// Hearts
function spawnHeart(el,icon,size){
  const p=document.createElement("div");p.className="heart-pop";p.innerHTML=icon;
  p.style.setProperty("--hx",(Math.random()-0.5)*40+"px");
  p.style.setProperty("--hy",(-20-Math.random()*30)+"px");
  const r=el.getBoundingClientRect();
  p.style.left=r.left+r.width/2+"px";p.style.top=r.top+"px";
  document.body.appendChild(p);setTimeout(()=>p.remove(),700);
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
$("#dayToggle").addEventListener("click",()=>{
  state.day=!state.day;
  scene.classList.toggle("night",!state.day);
  $("#dayToggle").innerHTML=state.day?"&#x2600;&#xFE0F;":"&#x1F319;";
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

// Hint cycling
const hints=["Tap chickens to pet them","Tap eggs to collect","Feed all chickens!","Tap the bucket to feed","Try day/night mode","Find the golden egg!","Tap baby chicks","Open the coop door"];
let hintIdx=0;
function showHint(){$("#hint").textContent=hints[hintIdx%hints.length];hintIdx++}
showHint();
setInterval(showHint,6000);

// Picture card
const picImg=$("#picImg");
const sources=["chickenhouse-photos/1.jpg","chickenhouse-banner.jpg"];
let loaded=false;
sources.forEach(src=>{if(!loaded){const i=new Image();i.onload=()=>{picImg.src=src;loaded=true};i.onerror=()=>{};i.src=src}});
$("#picCard").addEventListener("click",()=>{
  if(picImg.requestFullscreen) picImg.requestFullscreen().catch(()=>{});
});

// Web Audio
const audio={ctx:null,listeners:[],init(){if(this.ctx)return;this.ctx=new(window.AudioContext||window.webkitAudioContext)();document.removeEventListener("touchstart",this.listeners[0]);document.removeEventListener("click",this.listeners[1])},play(t){if(!this.ctx||muted)return;try{if(this.ctx.state==="suspended")this.ctx.resume();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.connect(g);g.connect(this.ctx.destination);const n=this.ctx.currentTime;
if(t==="cluck"){o.type="sine";o.frequency.setValueAtTime(400,n);o.frequency.exponentialRampToValueAtTime(250,n+.12);g.gain.setValueAtTime(.1,n);g.gain.exponentialRampToValueAtTime(.001,n+.15);o.start(n);o.stop(n+.15)}
else if(t==="feed"){o.type="triangle";o.frequency.setValueAtTime(800,n);o.frequency.exponentialRampToValueAtTime(300,n+.15);g.gain.setValueAtTime(.07,n);g.gain.exponentialRampToValueAtTime(.001,n+.18);o.start(n);o.stop(n+.18)}
else if(t==="egg"){o.type="sine";o.frequency.setValueAtTime(500,n);o.frequency.exponentialRampToValueAtTime(900,n+.15);g.gain.setValueAtTime(.1,n);g.gain.exponentialRampToValueAtTime(.001,n+.18);o.start(n);o.stop(n+.18)}
else if(t==="golden"){o.type="sine";[523,659,784,1047].forEach((f,i)=>{o.frequency.setValueAtTime(f,n+i*.1)});g.gain.setValueAtTime(.12,n);g.gain.exponentialRampToValueAtTime(.001,n+.5);o.start(n);o.stop(n+.5)}
else if(t==="heart"){o.type="sine";o.frequency.setValueAtTime(600,n);o.frequency.exponentialRampToValueAtTime(800,n+.1);g.gain.setValueAtTime(.08,n);g.gain.exponentialRampToValueAtTime(.001,n+.15);o.start(n);o.stop(n+.15)}
}catch(e){}}
};
audio.listeners=[()=>audio.init(),()=>audio.init()];
document.addEventListener("touchstart",audio.listeners[0]);
document.addEventListener("click",audio.listeners[1]);

})();
