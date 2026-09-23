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
const musicCurrentTime = document.getElementById('musicCurrentTime');
const musicDuration = document.getElementById('musicDuration');
const formatTime = seconds => {
  if(!Number.isFinite(seconds)) return '00:00';
  const m=Math.floor(seconds/60).toString().padStart(2,'0');
  const sec=Math.floor(seconds%60).toString().padStart(2,'0');
  return `${m}:${sec}`;
};
if(song && musicVolume) song.volume=Number(musicVolume.value);
musicVolume?.addEventListener('input',()=>{ if(song) song.volume=Number(musicVolume.value); });

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
  song.addEventListener('loadedmetadata', () => {
    if(musicDuration) musicDuration.textContent=formatTime(song.duration);
    if(musicCurrentTime) musicCurrentTime.textContent='00:00';
  });
  song.addEventListener('timeupdate', () => {
    if(song.duration) musicProgress.style.width=(song.currentTime/song.duration*100)+'%';
    if(musicCurrentTime) musicCurrentTime.textContent=formatTime(song.currentTime);
    if(musicDuration) musicDuration.textContent=formatTime(song.duration);
  });
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

// Secret Sakura Mode: click the sakura companion three times.
const companion=document.getElementById('sakuraCompanion');
let companionClicks=0;
let companionTimer=null;
let sakuraMode=localStorage.getItem('lavdyxaSakuraMode')==='1';
if(sakuraMode) document.body.classList.add('sakura-mode');
function showSakuraToast(text){
  let toast=document.getElementById('sakuraToast');
  if(!toast){ toast=document.createElement('div'); toast.id='sakuraToast'; toast.className='sakura-toast'; document.body.appendChild(toast); }
  toast.textContent=text; toast.classList.add('show');
  clearTimeout(toast._timer); toast._timer=setTimeout(()=>toast.classList.remove('show'),1800);
}
companion?.addEventListener('click',()=>{
  companionClicks++;
  companion.classList.add('mode-ready');
  clearTimeout(companionTimer);
  companionTimer=setTimeout(()=>{companionClicks=0;companion.classList.remove('mode-ready')},1200);
  if(companionClicks===3){
    sakuraMode=!sakuraMode;
    document.body.classList.toggle('sakura-mode',sakuraMode);
    localStorage.setItem('lavdyxaSakuraMode',sakuraMode?'1':'0');
    showSakuraToast(sakuraMode?'🌸 Sakura Mode enabled ♡':'🌙 Sakura Mode disabled');
    document.body.animate([{filter:'brightness(1)'},{filter:'brightness(1.22)'},{filter:'brightness(1)'}],{duration:700});
    companionClicks=0;
    companion.classList.remove('mode-ready');
  }
});


// Gallery slider
const galleryItems = [
  {src:'gallery-zero-two.jpg', alt:'Аниме-аватарка', title:'Аниме-аватарка', caption:'♡ Эта аватарка досталась мне от бывшего интересного собеседника.'},
  {src:'gallery-linie.jpg', alt:'Линия', title:'Линия', caption:'✦ Один из персонажей, которые мне понравились — Линия.'},
  {src:'gallery-sensa.jpg', alt:'Зенса', title:'Зенса', caption:'✧ Это персонаж Зенса. Он мне тоже понравился, но не так, как Линия и Ферн.'},
  {src:'gallery-fern.jpg', alt:'Ферн', title:'Ферн', caption:'🌸 А это мой любимый персонаж из аниме «Фрирен» — её зовут Ферн.'}
];
const galleryImage=document.getElementById('galleryImage');
const galleryCurrent=document.getElementById('galleryCurrent');
const galleryTotal=document.getElementById('galleryTotal');
const galleryTitle=document.getElementById('galleryTitle');
const galleryCaption=document.getElementById('galleryCaption');
const galleryDots=document.getElementById('galleryDots');
const galleryPrev=document.getElementById('galleryPrev');
const galleryNext=document.getElementById('galleryNext');
let galleryIndex=0;
galleryTotal.textContent=String(galleryItems.length).padStart(2,'0');
galleryItems.forEach((item,i)=>{
  const dot=document.createElement('button'); dot.type='button'; dot.className='gallery-dot'+(i===0?' active':''); dot.setAttribute('aria-label',`Показать фотографию ${i+1}`);
  dot.addEventListener('click',()=>setGallery(i)); galleryDots.appendChild(dot);
});
function setGallery(index){
  galleryIndex=(index+galleryItems.length)%galleryItems.length; const item=galleryItems[galleryIndex];
  galleryImage.classList.add('gallery-changing');
  setTimeout(()=>{galleryImage.src=item.src; galleryImage.alt=item.alt; galleryTitle.textContent=item.title; galleryCaption.textContent=item.caption; galleryCurrent.textContent=String(galleryIndex+1).padStart(2,'0'); galleryImage.classList.remove('gallery-changing');},120);
  [...galleryDots.children].forEach((d,i)=>d.classList.toggle('active',i===galleryIndex));
  if(galleryLightbox?.classList.contains('open')) syncLightbox();
}
galleryPrev?.addEventListener('click',()=>setGallery(galleryIndex-1));
galleryNext?.addEventListener('click',()=>setGallery(galleryIndex+1));
document.addEventListener('keydown',e=>{
  if(galleryLightbox?.classList.contains('open')){
    if(e.key==='Escape') closeLightbox();
    if(e.key==='ArrowLeft'){setGallery(galleryIndex-1);syncLightbox();}
    if(e.key==='ArrowRight'){setGallery(galleryIndex+1);syncLightbox();}
    return;
  }
  if(document.getElementById('gallery')?.classList.contains('active')){
    if(e.key==='ArrowLeft') setGallery(galleryIndex-1);
    if(e.key==='ArrowRight') setGallery(galleryIndex+1);
    if(e.key==='Enter') openLightbox();
  }
});

// Live clock and date widget.
const clockTime=document.getElementById('clockTime');
const clockDate=document.getElementById('clockDate');
const updateClock=()=>{
  const now=new Date();
  if(clockTime) clockTime.textContent=now.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
  if(clockDate) clockDate.textContent=now.toLocaleDateString('ru-RU',{day:'2-digit',month:'short',year:'numeric'}).replace(' г.','');
};
updateClock(); setInterval(updateClock,1000);

// Fullscreen gallery lightbox.
const galleryLightbox=document.getElementById('galleryLightbox');
const galleryExpand=document.getElementById('galleryExpand');
const lightboxImage=document.getElementById('lightboxImage');
const lightboxTitle=document.getElementById('lightboxTitle');
const lightboxCounter=document.getElementById('lightboxCounter');
const lightboxClose=document.getElementById('lightboxClose');
const lightboxPrev=document.getElementById('lightboxPrev');
const lightboxNext=document.getElementById('lightboxNext');
function syncLightbox(){
  if(!galleryLightbox) return;
  const item=galleryItems[galleryIndex];
  if(lightboxImage){lightboxImage.src=item.src;lightboxImage.alt=item.alt;}
  if(lightboxTitle) lightboxTitle.textContent=item.title;
  if(lightboxCounter) lightboxCounter.textContent=`${String(galleryIndex+1).padStart(2,'0')} / ${String(galleryItems.length).padStart(2,'0')}`;
}
function openLightbox(){
  syncLightbox(); galleryLightbox?.classList.add('open'); galleryLightbox?.setAttribute('aria-hidden','false'); document.body.classList.add('lightbox-open');
}
function closeLightbox(){
  galleryLightbox?.classList.remove('open'); galleryLightbox?.setAttribute('aria-hidden','true'); document.body.classList.remove('lightbox-open');
}
galleryExpand?.addEventListener('click',openLightbox);
galleryImage?.addEventListener('click',openLightbox);
lightboxClose?.addEventListener('click',closeLightbox);
lightboxPrev?.addEventListener('click',()=>{setGallery(galleryIndex-1);syncLightbox();});
lightboxNext?.addEventListener('click',()=>{setGallery(galleryIndex+1);syncLightbox();});

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
