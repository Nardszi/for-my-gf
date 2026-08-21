(function(){
"use strict";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const scene = $("#scene");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const saved = JSON.parse(localStorage.getItem("animalfarm") || "{}");
const state = {
  feedCount: saved.feedCount || 0,
  day: saved.day !== undefined ? saved.day : true,
  earned: saved.earned || {},
  notesFound: saved.notesFound || [],
  namedAnimals: saved.namedAnimals || {}
};

function saveState(){
  localStorage.setItem("animalfarm", JSON.stringify({
    feedCount: state.feedCount, day: state.day, earned: state.earned,
    notesFound: state.notesFound, namedAnimals: state.namedAnimals
  }));
}

const ANIMAL_NAMES = {
  cow: ["Bessie","Daisy","Buttercup","Clover","Milky","Rosie","Patches","Bella"],
  capybara: ["Chill","Zen","Mochi","Bento","Soba","Cozy","Luna","Hazel"],
  rabbit: ["Floppy","Thumper","Honey","Cotton","Clover","Snowball","Biscuit","Pepper"],
  pig: ["Hamlet","Truffle","Snorty","Oink","Babe","Rosie","Curly","Pippin"],
  goat: ["Billy","Nanzy","Capricorn","Stickers","Ginger","Scamp","Cocoa","Maverick"],
  duck: ["Quackers","Waddles","Donald","Daisy","Mallory","Puddles","Sunny","Drake"],
  sheep: ["Woolly","Baa-bra","Fluffy","Shaun","Lamby","Cloud","Patch","Cotton"],
  cat: ["Whiskers","Mittens","Luna","Simba","Nala","Ginger","Patches","Smokey"]
};

const ANIMAL_EMOJI = {
  cow:"\u{1F404}", capybara:"\u{1F43F}", rabbit:"\u{1F407}", pig:"\u{1F437}",
  goat:"\u{1F410}", duck:"\u{1F986}", sheep:"\u{1F411}", cat:"\u{1F431}"
};

const ANIMAL_TOASTS = {
  cow:["\u{1F404} Moo moo!","\u{1F404} *happy cow noises*","\u{1F404} Moooo!"],
  capybara:["\u{1F43F} *chill capybara sounds*","\u{1F43F} So relaxed...","\u{1F43F} Capybara vibes~"],
  rabbit:["\u{1F407} *hop hop!*","\u{1F407} Thump thump!","\u{1F407} Squeak!"],
  pig:["\u{1F437} Oink oink!","\u{1F437} *happy pig snorts*","\u{1F437} Snorty!"],
  goat:["\u{1F410} Baaa!","\u{1F410} *head shake*","\u{1F410} Maa~"],
  duck:["\u{1F986} Quack quack!","\u{1F986} *waddle waddle*","\u{1F986} Quaaack!"],
  sheep:["\u{1F411} Baaaa~","\u{1F411} *fluffy sounds*","\u{1F411} Baa baa!"],
  cat:["\u{1F431} Meow~","\u{1F431} *purrrr*","\u{1F431} Mrrrp!"]
};

function randomToast(type){
  const msgs = ANIMAL_TOASTS[type];
  return ANIMAL_EMOJI[type]+" "+msgs[Math.floor(Math.random()*msgs.length)];
}

const LOVE_NOTES=[
  {emoji:"\u{1F495}",text:"Every moment with you feels like a beautiful dream I never want to wake up from."},
  {emoji:"\u{1F33F}",text:"You are the sunshine that brightens my darkest days."},
  {emoji:"\u2764\uFE0F",text:"I fall in love with you a little more every single day."},
  {emoji:"\u{1F331}",text:"You are my today and all of my tomorrows."},
  {emoji:"\u{1F31F}",text:"In a sea of people, my eyes will always search for you."},
  {emoji:"\u{1F33B}",text:"You make ordinary moments feel magical."},
  {emoji:"\u{1F496}",text:"My heart is and always will be yours."},
  {emoji:"\u{1F30D}",text:"I love you not only for who you are, but for who I am when I am with you."},
  {emoji:"\u2615",text:"You are my cup of tea... no, my whole cafe."},
  {emoji:"\u{1F334}",text:"You are the palm tree in my garden of life."},
  {emoji:"\u{1F319}",text:"Even the moon is jealous of how you light up my night."},
  {emoji:"\u{1F49C}",text:"You are my favorite notification."},
  {emoji:"\u{1F9E1}",text:"I love you more than pizza... and that says a lot."},
  {emoji:"\u{1F4AB}",text:"You give me butterflies even after all this time."},
  {emoji:"\u{1F33F}",text:"You are the reason I believe in love."},
  {emoji:"\u{1F499}",text:"I choose you, and I will choose you over and over."},
  {emoji:"\u2600\uFE0F",text:"You are my sunshine on a rainy day."},
  {emoji:"\u{1F30A}",text:"Our love is deeper than the ocean."},
  {emoji:"\u{1F48E}",text:"You are my precious diamond."},
  {emoji:"\u{1F382}",text:"Every day with you is a gift I unwrap with joy."},
  {emoji:"\u{1F495}",text:"You are the plot twist I never saw coming but always needed."},
  {emoji:"\u{1F338}",text:"You are my cherry blossom in a world of thorns."},
  {emoji:"\u{1F525}",text:"You set my heart on fire with just a smile."},
  {emoji:"\u{1F30C}",text:"I found my universe in your eyes."}
];

const ACHS = [
  {id:"first_feed",icon:"\u{1F33E}",title:"First Feed",desc:"Fed the animals for the first time"},
  {id:"friend_1",icon:"\u{1F31F}",title:"First Friend",desc:"Made your first animal friend"},
  {id:"friend_4",icon:"\u{1F3D7}\uFE0F",title:"Barnyard Buddies",desc:"Made 4 animal friends"},
  {id:"friend_8",icon:"\u{1F451}",title:"Farm Besties",desc:"Befriended all 8 animals"},
  {id:"feed_25",icon:"\u{1F33E}",title:"Farmhand",desc:"Fed 25 times"},
  {id:"feed_100",icon:"\u{1F3C6}",title:"Legendary Farmer",desc:"Fed 100 times"}
];

function toast(msg){
  const t=document.createElement("div");t.className="toast";t.innerHTML=msg;
  document.body.appendChild(t);setTimeout(()=>t.remove(),2500);
}

function showAch(id){
  if(state.earned[id]) return;
  state.earned[id]=true;
  const a=ACHS.find(x=>x.id===id);if(!a)return;
  const d=document.createElement("div");d.className="achievement";
  d.innerHTML='<span class="ach-icon">'+a.icon+'</span><div class="ach-title">'+a.title+'</div><div class="ach-desc">'+a.desc+'</div>';
  document.body.appendChild(d);setTimeout(()=>d.remove(),3000);
  audio.play("golden");
  saveState();
}

function showLoveNote(note){
  if(state.notesFound.length>=LOVE_NOTES.length) state.notesFound=[];
  const idx=LOVE_NOTES.indexOf(note);
  if(!state.notesFound.includes(idx)) state.notesFound.push(idx);
  const d=document.createElement("div");d.className="love-note-modal";
  d.innerHTML='<div class="love-note-card"><span class="note-num">'+state.notesFound.length+'/'+LOVE_NOTES.length+'</span><span class="note-emoji">'+note.emoji+'</span><div class="note-text">"'+note.text+'"</div><div class="note-from">-- With love from the farm</div><button class="note-close">Close</button></div>';
  document.body.appendChild(d);
  d.querySelector(".note-close").addEventListener("click",()=>d.remove());
  d.addEventListener("click",e=>{if(e.target===d) d.remove()});
}

let muted = localStorage.getItem("animalfarm_muted") === "true";
const soundBtn = $("#soundToggle");
soundBtn.innerHTML = muted ? "\u{1F507}" : "\u{1F50A}";
soundBtn.classList.toggle("muted", muted);
soundBtn.addEventListener("click", ()=>{
  muted = !muted;
  localStorage.setItem("animalfarm_muted", muted);
  soundBtn.innerHTML = muted ? "\u{1F507}" : "\u{1F50A}";
  soundBtn.classList.toggle("muted", muted);
});

const starsEl = $("#stars");
const frag = document.createDocumentFragment();
for(let i=0;i<60;i++){const s=document.createElement("div");s.className="star";s.style.cssText="left:"+Math.random()*100+"%;top:"+Math.random()*50+"%;animation-delay:"+Math.random()*3+"s";frag.appendChild(s)}
starsEl.appendChild(frag);

const audio={ctx:null,listeners:[],init(){if(this.ctx)return;this.ctx=new(window.AudioContext||window.webkitAudioContext)();document.removeEventListener("touchstart",this.listeners[0]);document.removeEventListener("click",this.listeners[1])},play(t){if(!this.ctx||muted)return;try{if(this.ctx.state==="suspended")this.ctx.resume();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.connect(g);g.connect(this.ctx.destination);const n=this.ctx.currentTime;
if(t==="feed"){o.type="triangle";o.frequency.setValueAtTime(800,n);o.frequency.exponentialRampToValueAtTime(300,n+.15);g.gain.setValueAtTime(.07,n);g.gain.exponentialRampToValueAtTime(.001,n+.18);o.start(n);o.stop(n+.18)}
else if(t==="heart"){o.type="sine";o.frequency.setValueAtTime(600,n);o.frequency.exponentialRampToValueAtTime(800,n+.1);g.gain.setValueAtTime(.08,n);g.gain.exponentialRampToValueAtTime(.001,n+.15);o.start(n);o.stop(n+.15)}
else if(t==="golden"){o.type="sine";[523,659,784,1047].forEach((f,i)=>{o.frequency.setValueAtTime(f,n+i*.1)});g.gain.setValueAtTime(.12,n);g.gain.exponentialRampToValueAtTime(.001,n+.5);o.start(n);o.stop(n+.5)}
else if(t==="moo"){o.type="sawtooth";o.frequency.setValueAtTime(150,n);o.frequency.exponentialRampToValueAtTime(120,n+.4);g.gain.setValueAtTime(.06,n);g.gain.exponentialRampToValueAtTime(.001,n+.5);o.start(n);o.stop(n+.5)}
else if(t==="chill"){o.type="sine";o.frequency.setValueAtTime(300,n);o.frequency.exponentialRampToValueAtTime(280,n+.3);g.gain.setValueAtTime(.04,n);g.gain.exponentialRampToValueAtTime(.001,n+.35);o.start(n);o.stop(n+.35)}
else if(t==="squeak"){o.type="sine";o.frequency.setValueAtTime(900,n);o.frequency.exponentialRampToValueAtTime(1200,n+.05);g.gain.setValueAtTime(.07,n);g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.1)}
else if(t==="oink"){o.type="square";o.frequency.setValueAtTime(350,n);o.frequency.exponentialRampToValueAtTime(200,n+.08);g.gain.setValueAtTime(.06,n);g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.12)}
else if(t==="bleat"){o.type="sawtooth";o.frequency.setValueAtTime(250,n);o.frequency.linearRampToValueAtTime(350,n+.07);o.frequency.linearRampToValueAtTime(280,n+.15);g.gain.setValueAtTime(.06,n);g.gain.exponentialRampToValueAtTime(.001,n+.2);o.start(n);o.stop(n+.2)}
else if(t==="quack"){o.type="square";o.frequency.setValueAtTime(400,n);o.frequency.exponentialRampToValueAtTime(200,n+.1);g.gain.setValueAtTime(.06,n);g.gain.exponentialRampToValueAtTime(.001,n+.12);o.start(n);o.stop(n+.15)}
else if(t==="baa"){o.type="sawtooth";o.frequency.setValueAtTime(180,n);o.frequency.linearRampToValueAtTime(220,n+.1);o.frequency.linearRampToValueAtTime(180,n+.2);g.gain.setValueAtTime(.05,n);g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25)}
else if(t==="purr"){o.type="sine";o.frequency.setValueAtTime(220,n);g.gain.setValueAtTime(.03,n);g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3)}
}catch(e){}}
};
audio.listeners=[()=>audio.init(),()=>audio.init()];
document.addEventListener("touchstart",audio.listeners[0]);
document.addEventListener("click",audio.listeners[1]);

function spawnHeart(el, emoji, size){
  if(prefersReducedMotion) return;
  const h=document.createElement("div");h.className="heart-pop";
  h.innerHTML=emoji;
  const rect=el.getBoundingClientRect();
  const sceneRect=scene.getBoundingClientRect();
  const left=((rect.left+rect.width/2-sceneRect.left)/sceneRect.width)*100;
  const bottom=((sceneRect.bottom-(rect.top+rect.height/2))/sceneRect.height)*100;
  h.style.cssText="left:"+left+"%;bottom:"+bottom+"%;font-size:"+(size/10)+"rem;--hx:"+(Math.random()-.5)*30+"px;--hy:-"+(20+Math.random()*20)+"px";
  scene.appendChild(h);
  setTimeout(()=>h.remove(),700);
}

function spawnFeedParticle(x, y){
  const p=document.createElement("div");
  p.className="feed-p";
  p.style.cssText="left:"+(x+(Math.random()-0.5)*8)+"%;bottom:"+(y+2)+"%;--fx:"+(Math.random()-0.5)*20+"px;--fy:"+(-10-Math.random()*15)+"px";
  scene.appendChild(p);
  setTimeout(()=>p.remove(),700);
}

function spawnHeartRain(){
  if(!scene.classList.contains("night")) return;
  const h=document.createElement("div");h.className="heart-rain";
  h.innerHTML=["\u2764\uFE0F","\u{1F495}","\u{1F49C}","\u{1F496}","\u{1F9E1}"][Math.floor(Math.random()*5)];
  h.style.cssText="left:"+Math.random()*100+"%;animation-duration:"+(4+Math.random()*4)+"s;animation-delay:"+Math.random()*2+"s;font-size:"+(.4+Math.random()*.4)+"rem";
  scene.appendChild(h);
  setTimeout(()=>h.remove(),9000);
}
setInterval(spawnHeartRain,1500);

const month=new Date().getMonth();
function spawnSeasonal(){
  if(prefersReducedMotion) return;
  const particles=[];
  if(month>=2&&month<=4) particles.push("\u{1F338}","\u{1F33A}");
  else if(month>=5&&month<=7) particles.push("\u{1F33B}","\u{1F331}");
  else if(month>=8&&month<=10) particles.push("\u{1F342}","\u{1F341}");
  else particles.push("\u2744\uFE0F","\u{1F328}\uFE0F");
  if(!particles.length) return;
  const p=document.createElement("div");p.className="season-particle";
  p.innerHTML=particles[Math.floor(Math.random()*particles.length)];
  p.style.cssText="left:"+Math.random()*100+"%;animation-duration:"+(5+Math.random()*5)+"s;font-size:"+(.4+Math.random()*.4)+"rem";
  scene.appendChild(p);
  setTimeout(()=>p.remove(),11000);
}
setInterval(spawnSeasonal,2500);

function spawnFirefly(){
  if(!scene.classList.contains("night")||prefersReducedMotion) return;
  const f=document.createElement("div");f.className="firefly";
  f.style.cssText="left:"+(Math.random()*80+10)+"%;bottom:"+(30+Math.random()*30)+"%;--ffx:"+(Math.random()-0.5)*40+"px;--ffy:"+(-20+Math.random()*40)+"px;animation-delay:"+Math.random()*2+"s;animation-duration:"+(2+Math.random()*3)+"s";
  scene.appendChild(f);
  setTimeout(()=>f.remove(),6000);
}
setInterval(spawnFirefly,2000);

if(!state.day){scene.classList.add("night");$("#dayToggle").innerHTML="\u{1F319}"}
const dayBtn=$("#dayToggle");
dayBtn.addEventListener("click",()=>{
  state.day=!state.day;
  scene.classList.toggle("night",!state.day);
  dayBtn.innerHTML=state.day?"\u2600\uFE0F":"\u{1F319}";
  saveState();
});

const ANIMAL_SOUNDS = {
  cow:"moo", capybara:"chill", rabbit:"squeak", pig:"oink",
  goat:"bleat", duck:"quack", sheep:"baa", cat:"purr"
};

const ANIMAL_TAP_ANIMS = {
  cow:"happy", capybara:"happy", rabbit:"hop", pig:"happy",
  goat:"happy", duck:"happy", sheep:"happy", cat:"happy"
};

const ANIMAL_TYPES = ["cow","capybara","rabbit","pig","goat","duck","sheep","cat"];

const animalTapCount = {};
const animals = {};

function setupAnimal(type){
  const el = $("#"+type);
  if(!el) return;
  animalTapCount[type] = 0;

  if(state.namedAnimals[type]){
    el.classList.add("named");
    el.querySelector(".animal-name").textContent = state.namedAnimals[type];
  }

  el.addEventListener("click", ()=>{
    const anim = ANIMAL_TAP_ANIMS[type];
    el.classList.remove(anim);
    void el.offsetWidth;
    el.classList.add(anim);
    setTimeout(()=>el.classList.remove(anim), 500);

    spawnHeart(el, "\u2764\uFE0F", 25);
    audio.play(ANIMAL_SOUNDS[type]);
    if(navigator.vibrate) navigator.vibrate(15);
    toast(randomToast(type));

    animalTapCount[type]++;
    if(animalTapCount[type] >= 5 && !state.namedAnimals[type]){
      const names = ANIMAL_NAMES[type];
      const name = names[Math.floor(Math.random()*names.length)];
      state.namedAnimals[type] = name;
      el.classList.add("named");
      el.querySelector(".animal-name").textContent = name;
      toast("\u{1F31F} "+name+" is your friend now!");
      audio.play("golden");
      const friendCount = Object.keys(state.namedAnimals).length;
      if(friendCount===1) showAch("friend_1");
      if(friendCount>=4) showAch("friend_4");
      if(friendCount>=8) showAch("friend_8");
      saveState();
    }
  });

  animals[type] = el;
}

ANIMAL_TYPES.forEach(type => setupAnimal(type));

setInterval(()=>{
  const rab = animals.rabbit;
  if(rab && Math.random()<.4){
    rab.classList.add("hop");
    setTimeout(()=>rab.classList.remove("hop"),400);
  }
},4000);

setInterval(()=>{
  const cat = animals.cat;
  if(cat && Math.random()<.3){
    cat.style.transform="scaleY(.9)";
    setTimeout(()=>{cat.style.transform=""},2000);
  }
},5000);

setInterval(()=>{
  const capy = animals.capybara;
  if(capy && Math.random()<.3){
    capy.style.transform="scaleY(.9)";
    setTimeout(()=>{capy.style.transform=""},2000);
  }
},5000);

setInterval(()=>{
  const duck = animals.duck;
  if(duck && Math.random()<.3){
    duck.classList.add("happy");
    setTimeout(()=>duck.classList.remove("happy"),500);
  }
},5000);

setInterval(()=>{
  const goat = animals.goat;
  if(goat && Math.random()<.35){
    goat.classList.add("happy");
    setTimeout(()=>goat.classList.remove("happy"),300);
    setTimeout(()=>{goat.classList.add("happy");setTimeout(()=>goat.classList.remove("happy"),300)},400);
  }
},3000);

setInterval(()=>{
  const pig = animals.pig;
  if(pig && Math.random()<.3){
    const p=document.createElement("div");p.className="heart-pop";
    p.innerHTML="\u{1F4A8}";
    const rect=pig.getBoundingClientRect();const sceneRect=scene.getBoundingClientRect();
    const left=((rect.left+rect.width/2-sceneRect.left)/sceneRect.width)*100;
    const bottom=((sceneRect.bottom-(rect.top+rect.height/2))/sceneRect.height)*100;
    p.style.cssText="left:"+left+"%;bottom:"+bottom+"%;--hx:"+(Math.random()-.5)*20+"px;--hy:-20px";
    scene.appendChild(p);setTimeout(()=>p.remove(),700);
  }
},6000);

setInterval(()=>{
  if(!scene.classList.contains("night")) return;
  const cow = animals.cow;
  if(cow && Math.random()<.35){
    const p=document.createElement("div");p.className="heart-pop";
    p.innerHTML="\u{1F4AC}";
    const rect=cow.getBoundingClientRect();const sceneRect=scene.getBoundingClientRect();
    const left=((rect.left+rect.width/2-sceneRect.left)/sceneRect.width)*100;
    const bottom=((sceneRect.bottom-(rect.top+rect.height/2))/sceneRect.height)*100;
    p.style.cssText="left:"+left+"%;bottom:"+bottom+"%;--hx:"+(Math.random()-.5)*15+"px;--hy:-25px;font-size:.5rem";
    scene.appendChild(p);setTimeout(()=>p.remove(),700);
  }
},7000);

setInterval(()=>{
  const sheep = animals.sheep;
  if(sheep && Math.random()<.3){
    for(let i=0;i<3;i++){
      const p=document.createElement("div");p.className="heart-pop";
      p.innerHTML="\u2B1C";
      const rect=sheep.getBoundingClientRect();const sceneRect=scene.getBoundingClientRect();
      const left=((rect.left+rect.width/2-sceneRect.left)/sceneRect.width)*100;
      const bottom=((sceneRect.bottom-(rect.top+rect.height/2))/sceneRect.height)*100;
      p.style.cssText="left:"+(left+(Math.random()-.5)*8)+"%;bottom:"+(bottom+Math.random()*5)+"%;--hx:"+(Math.random()-.5)*25+"px;--hy:-"+(15+Math.random()*15)+"px;font-size:.35rem";
      scene.appendChild(p);setTimeout(()=>p.remove(),700);
    }
  }
},5000);

let feeding=false;
function feedAll(){
  if(feeding) return;
  feeding=true;
  setTimeout(()=>{feeding=false},1500);

  const feedPositions = {
    cow:{x:12,y:24}, capybara:{x:80,y:22}, rabbit:{x:34,y:30},
    pig:{x:65,y:20}, goat:{x:75,y:28}, duck:{x:18,y:26},
    sheep:{x:54,y:32}, cat:{x:48,y:18}
  };

  ANIMAL_TYPES.forEach(type=>{
    const pos = feedPositions[type];
    if(pos){
      setTimeout(()=>{
        for(let i=0;i<3;i++) spawnFeedParticle(pos.x, pos.y);
      },Math.random()*400);
    }
  });

  state.feedCount++;
  $("#feedC").textContent=state.feedCount;
  audio.play("feed");
  ANIMAL_TYPES.forEach(type=>{
    const el=animals[type];
    if(el){
      el.classList.add("happy");
      setTimeout(()=>el.classList.remove("happy"),500);
    }
  });
  toast(["\u{1F33E} Nom nom nom!","\u{1F411} Yummy feed!","\u{1F986} Tasty!","\u{1F33E} More please!","\u{1F410} Delicious!","\u{1F431} Meow, thanks!"][Math.floor(Math.random()*6)]);
  if(navigator.vibrate) navigator.vibrate(15);
  if(state.feedCount>=25) showAch("feed_25");
  if(state.feedCount>=100) showAch("feed_100");
  if(state.feedCount===1) showAch("first_feed");
  saveState();
}

$("#feedBtn").addEventListener("click",feedAll);
$("#trough").addEventListener("click",feedAll);

const feedC = $("#feedC");
const friendC = $("#friendC");
const noteC = $("#noteC");
feedC.textContent = state.feedCount;
friendC.textContent = Object.keys(state.namedAnimals).length;
noteC.textContent = state.notesFound.length;

setInterval(()=>{
  friendC.textContent = Object.keys(state.namedAnimals).length;
  noteC.textContent = state.notesFound.length;
},1000);

let loveNoteTimer = 0;
setInterval(()=>{
  loveNoteTimer++;
  if(loveNoteTimer%45===0 && Math.random()<.4){
    const note = LOVE_NOTES[Math.floor(Math.random()*LOVE_NOTES.length)];
    showLoveNote(note);
  }
},1000);

const hints=[
  "Tap each animal to make them happy!",
  "Feed animals 5 times to befriend them!",
  "Use Feed All to feed every animal at once",
  "Try day/night mode for a different scene",
  "Cows moo at night \u2014 try tapping them after dark",
  "Rabbits hop randomly \u2014 watch them bounce!",
  "Capybaras are always chill~",
  "Pigs emit snort particles \u{1F4A8}",
  "Ducks waddle around their pen",
  "Goats love head shaking!",
  "Sheep spawn wool puff particles",
  "Cats curl up and purr~",
  "Find all 24 love notes",
  "Befriend all 8 animals for Farm Besties!",
  "Click the trough to feed everyone",
  "Earn all 6 achievements to complete the farm"
];
let hintIdx=0;
function showHint(){$("#hint").textContent=hints[hintIdx%hints.length];hintIdx++}
showHint();
setInterval(showHint,6000);

})();
