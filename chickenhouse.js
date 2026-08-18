(function(){
"use strict";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const scene = $("#scene");
const chickensEl = $("#chickens");

const state = {
  eggs: 0, gold: 0, day: true, earned: {},
  chicks: [{el:$("#bc1"),x:20,bY:72},{el:$("#bc2"),x:70,bY:74},{el:$("#bc3"),x:45,bY:76}]
};

const ACHS = [
  {id:"first",icon:"&#x1F423;",title:"First Egg!",desc:"Collected your first egg"},
  {id:"hunter",icon:"&#x1F426;",title:"Egg Hunter",desc:"Collected 10 eggs"},
  {id:"master",icon:"&#x1F3C1;",title:"Egg Master",desc:"Collected 25 eggs"},
  {id:"golden",icon:"&#x2B50;",title:"Golden Egg",desc:"Found a rare golden egg"},
  {id:"farmer",icon:"&#x1F33E;",title:"Legendary Farmer",desc:"Fed 50 times"}
];

let feedCount = 0;

// Stars
const starsEl = $("#stars");
for(let i=0;i<60;i++){const s=document.createElement("div");s.className="star";s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*50}%;animation-delay:${Math.random()*3}s`;starsEl.appendChild(s)}

// Chickens
const chickenDefs = [
  {type:"br",x:35,y:68},{type:"wh",x:55,y:70},{type:"bl",x:72,y:67},{type:"dk",x:18,y:71},
  {type:"br",x:48,y:73},{type:"wh",x:82,y:69},{type:"bl",x:12,y:74},{type:"dk",x:62,y:72}
];

function buildChicken(c,i){
  const d=document.createElement("div");
  d.className="chicken "+c.type+(i===0?" rooster":"")+(i===3?" duck":"");
  d.style.cssText=`left:${c.x}%;bottom:${c.y}%`;
  d.innerHTML=`<div class="ch"><div class="ch-body"></div><div class="ch-head"></div><div class="ch-comb"></div><div class="ch-eye"></div><div class="ch-beak"></div><div class="ch-wattle"></div><div class="ch-tail"></div><div class="ch-wing"></div><div class="ch-legs"><div class="ch-leg"></div><div class="ch-leg"></div></div></div>`;
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
      const y=Math.max(64,Math.min(78,parseFloat(c.style.bottom)+dy));
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
  toast("&#x1F496; Chikoy loves you!");
}

// Baby chicks wander
function moveChicks(){
  state.chicks.forEach(ch=>{
    ch.x+=((Math.random()-.5)*15);
    ch.x=Math.max(10,Math.min(80,ch.x));
    ch.el.style.left=ch.x+"%";
    ch.el.style.bottom=ch.bY+"%";
  });
}
setInterval(moveChicks,4000);
moveChicks();

// Eggs
function spawnEggs(){
  const eggs=$$(".egg");
  eggs.forEach(e=>{
    e.classList.remove("got");
    if(Math.random()<.08) e.classList.add("golden");
    else e.classList.remove("golden");
  });
  state.earned.eggs=true;
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
  });
});

// Feed All
const feedLocations=[
  {x:30,y:68},{x:42,y:70},{x:58,y:69},{x:75,y:71},{x:20,y:73},{x:50,y:72},{x:65,y:67},{x:38,y:75}
];

function feedAll(){
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
  feedCount++;
  if(feedCount>=50) showAch("farmer");
  audio.play("feed");
  $$(".chicken").forEach(c=>{c.classList.add("peck");setTimeout(()=>c.classList.remove("peck"),1200)});
  toast("&#x1F33E; Nom nom nom!");
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
}

// Day/Night
$("#dayToggle").addEventListener("click",()=>{
  state.day=!state.day;
  scene.classList.toggle("night",!state.day);
  $("#dayToggle").innerHTML=state.day?"&#x2600;&#xFE0F;":"&#x1F319;";
});

// Toast
function toast(msg){
  const t=document.createElement("div");t.className="toast";t.innerHTML=msg;
  document.body.appendChild(t);setTimeout(()=>t.remove(),2500);
}

// Picture card
const picImg=$("#picImg");
const sources=["chickenhouse-photos/1.jpg","chickenhouse-banner.jpg","float-photos/chickoy.png","float-photos/chickoy-back.png"];
let loaded=false;
sources.forEach(src=>{if(!loaded){const i=new Image();i.onload=()=>{picImg.src=src;loaded=true};i.onerror=()=>{};i.src=src}});
$("#picCard").addEventListener("click",()=>picImg.requestFullscreen?.());

// Web Audio
const audio={ctx:null,listeners:[],init(){if(this.ctx)return;this.ctx=new(window.AudioContext||window.webkitAudioContext)();document.removeEventListener("touchstart",this.listeners[0]);document.removeEventListener("click",this.listeners[1])},play(t){if(!this.ctx)return;try{if(this.ctx.state==="suspended")this.ctx.resume();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.connect(g);g.connect(this.ctx.destination);const n=this.ctx.currentTime;
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
