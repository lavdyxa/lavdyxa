const pages=[...document.querySelectorAll('.page')];
const links=[...document.querySelectorAll('[data-page]')];
const sidebar=document.getElementById('sidebar');

function showPage(id){
  const target=document.getElementById(id)||document.getElementById('home');
  pages.forEach(p=>p.classList.toggle('active',p===target));
  links.forEach(a=>a.classList.toggle('active',a.dataset.page===target.id));
  sidebar.classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
}
function route(){
  showPage(location.hash.replace('#','')||'home');
}
links.forEach(a=>a.addEventListener('click',e=>{
  const id=a.dataset.page;
  if(location.hash.slice(1)!==id) location.hash=id;
  else showPage(id);
}));
window.addEventListener('hashchange',route);
route();

// Live local clock — uses the visitor's own computer timezone.
const clockTime = document.getElementById('clockTime');
const clockDate = document.getElementById('clockDate');
function updateClock(){
  const now = new Date();
  if(clockTime) clockTime.textContent = now.toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false});
  if(clockDate) clockDate.textContent = now.toLocaleDateString('ru-RU', {day:'2-digit', month:'2-digit', year:'numeric'});
}
updateClock();
setInterval(updateClock, 1000);

document.getElementById('menuBtn').addEventListener('click',()=>sidebar.classList.toggle('open'));
document.getElementById('themeToggle').addEventListener('click',()=>{
  document.body.classList.toggle('night');
  document.getElementById('themeToggle').textContent=document.body.classList.contains('night')?'☀':'☾';
});

// Subtle cursor parallax for the background atmosphere
document.addEventListener('pointermove', (e)=>{
  const x=(e.clientX/window.innerWidth-.5)*2;
  const y=(e.clientY/window.innerHeight-.5)*2;
  document.body.style.setProperty('--mx', `${x*14}px`);
  document.body.style.setProperty('--my', `${y*14}px`);
});

const petalBox=document.querySelector('.petals');
for(let i=0;i<22;i++){
  const p=document.createElement('span');
  p.className='petal';
  p.textContent=['✿','❀','✧'][Math.floor(Math.random()*3)];
  p.style.left=Math.random()*100+'%';
  p.style.fontSize=(8+Math.random()*13)+'px';
  p.style.animationDuration=(8+Math.random()*12)+'s';
  p.style.animationDelay=(-Math.random()*15)+'s';
  p.style.setProperty('--x',(Math.random()*240-120)+'px');
  petalBox.appendChild(p);
}
let secretClicks=0;
document.querySelector('.brand').addEventListener('click',()=>{
  secretClicks++;
  if(secretClicks>=5){
    document.body.animate([{filter:'brightness(1)'},{filter:'brightness(1.35)'},{filter:'brightness(1)'}],{duration:800});
    secretClicks=0;
  }
});


// Favorite song player
const song = document.getElementById('favoriteSong');
const playMusic = document.getElementById('playMusic');
const restartMusic = document.getElementById('restartMusic');
const stopMusic = document.getElementById('stopMusic');
const musicProgress = document.getElementById('musicProgress');
const vinyl = document.getElementById('vinyl');
const equalizer = document.getElementById('equalizer');
const musicVolume = document.getElementById('musicVolume');

if(song){ song.volume = musicVolume ? Number(musicVolume.value) : 0.75; }
if(musicVolume && song){ musicVolume.value = String(song.volume); musicVolume.addEventListener('input', () => { song.volume = Number(musicVolume.value); }); }

if(song && playMusic){
  playMusic.addEventListener('click', async () => {
    try {
      if(song.paused){
        await song.play();
        playMusic.textContent='Ⅱ';
        playMusic.setAttribute('aria-label','Поставить на паузу');
        playMusic.classList.add('is-playing');
        vinyl.classList.add('is-playing');
      } else {
        song.pause();
        playMusic.textContent='▶';
        playMusic.setAttribute('aria-label','Включить музыку');
        playMusic.classList.remove('is-playing');
        vinyl.classList.remove('is-playing');
      }
    } catch(e) {
      alert('Файл music.mp3 не найден. Положи его рядом с index.html.');
    }
  });
  restartMusic.addEventListener('click', () => { song.currentTime=0; song.play().catch(()=>{}); });
  stopMusic.addEventListener('click', () => {
    song.pause(); song.currentTime=0; musicProgress.style.width='0%';
    playMusic.textContent='▶'; playMusic.classList.remove('is-playing'); vinyl.classList.remove('is-playing'); equalizer?.classList.remove('playing');
  });
  song.addEventListener('timeupdate', () => { if(song.duration) musicProgress.style.width=(song.currentTime/song.duration*100)+'%'; });
  song.addEventListener('ended', () => { playMusic.textContent='▶'; playMusic.classList.remove('is-playing'); vinyl.classList.remove('is-playing'); equalizer?.classList.remove('playing'); musicProgress.style.width='0%'; });
}


// Gentle 3D tilt for interactive cards
const tiltCards=[...document.querySelectorAll('.mini-card,.project-card,.anime-card,.social-card,.post,.info-card,.stats-card')];
tiltCards.forEach(card=>{
  card.addEventListener('pointermove',e=>{
    if(window.innerWidth<900) return;
    const r=card.getBoundingClientRect();
    const rx=((e.clientY-r.top)/r.height-.5)*-4;
    const ry=((e.clientX-r.left)/r.width-.5)*5;
    card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave',()=>{card.style.transform='';});
});

// Small secret interaction: click the sakura companion three times.
const companion=document.getElementById('sakuraCompanion');
let companionClicks=0;
companion?.addEventListener('click',()=>{
  companionClicks++;
  if(companionClicks===3){
    document.body.animate([{filter:'brightness(1)'},{filter:'brightness(1.25)'},{filter:'brightness(1)'}],{duration:900});
    companionClicks=0;
  }
});


// Gallery removed in v5+.
// Home dashboard music controls mirror the main player.
const homePlayMusic=document.getElementById('homePlayMusic');
const homeRestartMusic=document.getElementById('homeRestartMusic');
const homeStopMusic=document.getElementById('homeStopMusic');
const homeMusicProgress=document.getElementById('homeMusicProgress');
const homeEqualizer=document.getElementById('homeEqualizer');
function syncHomeMusic(){
  if(!song) return;
  const playing=!song.paused;
  if(homePlayMusic) homePlayMusic.textContent=playing?'Ⅱ':'▶';
  if(homeMusicProgress) homeMusicProgress.style.width=song.duration?(song.currentTime/song.duration*100)+'%':'0%';
  homeEqualizer?.classList.toggle('playing',playing);
}
homePlayMusic?.addEventListener('click',()=>playMusic?.click());
homeRestartMusic?.addEventListener('click',()=>restartMusic?.click());
homeStopMusic?.addEventListener('click',()=>stopMusic?.click());
song?.addEventListener('play',syncHomeMusic); song?.addEventListener('pause',syncHomeMusic); song?.addEventListener('timeupdate',syncHomeMusic); song?.addEventListener('ended',syncHomeMusic); syncHomeMusic();

// Fonts generator — every style keeps unsupported Cyrillic/digits instead of dropping them.
const fontInput = document.getElementById('fontInput');
const fontList = document.getElementById('fontList');
const fontCount = document.getElementById('fontCount');
const fontClear = document.getElementById('fontClear');
const fontFilters = [...document.querySelectorAll('.font-filter')];

const latinUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const latinLower = 'abcdefghijklmnopqrstuvwxyz';
const digits = '0123456789';
const makeMap = (upper, lower, nums='') => { const m={}; [...latinUpper].forEach((c,i)=>m[c]=[...upper][i]||c); [...latinLower].forEach((c,i)=>m[c]=[...lower][i]||c); [...digits].forEach((c,i)=>m[c]=[...nums][i]||c); return m; };
const maps={
  bold: makeMap('𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙','𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳','𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗'),
  italic: makeMap('𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍','𝑎𝑏𝑐𝑑𝑒𝑓𝑔𝒽𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧','0123456789'),
  boldItalic: makeMap('𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁','𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛','0123456789'),
  gothic: makeMap('𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ','𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷','0123456789'),
  gothicBold: makeMap('𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅','𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟','0123456789'),
  mono: makeMap('𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉','𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣','𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'),
  double: makeMap('𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ','𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫','𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡')
};
const applyMap=(text,map)=>[...text].map(ch=>map[ch]||ch).join('');
const decorate=(text,kind)=>{ const f={underline:'\u0332', doubleline:'\u0333', strike:'\u0336', overline:'\u0305', dot:'\u0307', dia:'\u0308'}[kind]; return [...text].map(ch=>ch==='\n'?'\n':ch+f).join(''); };
const spaced=text=>[...text].map((c,i)=>c+(i<text.length-1?' · ':'' )).join('');
const fullwidth=text=>[...text].map(c=>{const n=c.codePointAt(0); if(n>=0x21&&n<=0x7e)return String.fromCodePoint(n+0xfee0); return c;}).join('');
const circled=text=>[...text].map(c=>{const u=c.toUpperCase(); const n=u.charCodeAt(0); if(n>=65&&n<=90)return String.fromCodePoint(0x24B6+n-65); if(n>=97&&n<=122)return String.fromCodePoint(0x24D0+n-97); return c;}).join('');
const square=text=>[...text].map(c=>c===' ' ? '　' : `【${c}】`).join('');
const styles=[
 {id:'bold',name:'Жирный',cat:'simple',fn:t=>applyMap(t,maps.bold)},
 {id:'italic',name:'Курсивный',cat:'simple',fn:t=>applyMap(t,maps.italic)},
 {id:'boldItalic',name:'Жирный курсивный',cat:'simple',fn:t=>applyMap(t,maps.boldItalic)},
 {id:'mono',name:'Моноширинный',cat:'simple',fn:t=>applyMap(t,maps.mono)},
 {id:'double',name:'Двойной контур',cat:'decorative',fn:t=>applyMap(t,maps.double)},
 {id:'gothic',name:'Готический',cat:'decorative',fn:t=>applyMap(t,maps.gothic)},
 {id:'gothicBold',name:'Жирный готический',cat:'decorative',fn:t=>applyMap(t,maps.gothicBold)},
 {id:'underline',name:'Подчёркнутый',cat:'decorative',fn:t=>decorate(t,'underline')},
 {id:'doubleline',name:'Двойное подчёркивание',cat:'decorative',fn:t=>decorate(t,'doubleline')},
 {id:'strike',name:'Перечёркнутый',cat:'decorative',fn:t=>decorate(t,'strike')},
 {id:'overline',name:'Надчёркнутый',cat:'decorative',fn:t=>decorate(t,'overline')},
 {id:'dot',name:'Точечный',cat:'symbols',fn:t=>decorate(t,'dot')},
 {id:'dia',name:'Диакритический',cat:'symbols',fn:t=>decorate(t,'dia')},
 {id:'spaced',name:'Просторный',cat:'symbols',fn:spaced},
 {id:'circled',name:'Кружочки',cat:'symbols',fn:circled},
 {id:'square',name:'Квадратные скобки',cat:'symbols',fn:square},
 {id:'fullwidth',name:'Широкий',cat:'symbols',fn:fullwidth}
];
let activeFontFilter='all';
function renderFonts(){
  if(!fontList||!fontInput)return;
  const text=fontInput.value||'Введите текст ♡';
  if(fontCount) fontCount.textContent=`${fontInput.value.length} / 500`;
  const list=styles.filter(s=>activeFontFilter==='all'||s.cat===activeFontFilter);
  fontList.innerHTML='';
  list.forEach(style=>{
    const row=document.createElement('article'); row.className='font-row glass';
    const left=document.createElement('div');
    const top=document.createElement('div'); top.className='font-row-top';
    const name=document.createElement('span'); name.className='font-name'; name.textContent=style.name;
    top.appendChild(name); left.appendChild(top);
    const preview=document.createElement('div'); preview.className='font-preview'; preview.textContent=style.fn(text); left.appendChild(preview);
    const btn=document.createElement('button'); btn.className='font-copy'; btn.type='button'; btn.textContent='Копировать';
    btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(style.fn(fontInput.value));btn.textContent='Скопировано ✓';btn.classList.add('copied');setTimeout(()=>{btn.textContent='Копировать';btn.classList.remove('copied')},1200)}catch(e){const ta=document.createElement('textarea');ta.value=style.fn(fontInput.value);document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();btn.textContent='Скопировано ✓';setTimeout(()=>btn.textContent='Копировать',1200)}});
    row.append(left,btn); fontList.appendChild(row);
  });
}
fontInput?.addEventListener('input',renderFonts);
fontClear?.addEventListener('click',()=>{fontInput.value='';fontInput.focus();renderFonts()});
fontFilters.forEach(b=>b.addEventListener('click',()=>{activeFontFilter=b.dataset.fontFilter;fontFilters.forEach(x=>x.classList.toggle('active',x===b));renderFonts()}));
renderFonts();
