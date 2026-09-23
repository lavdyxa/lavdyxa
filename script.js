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
}
galleryPrev?.addEventListener('click',()=>setGallery(galleryIndex-1));
galleryNext?.addEventListener('click',()=>setGallery(galleryIndex+1));
document.addEventListener('keydown',e=>{ if(document.getElementById('gallery')?.classList.contains('active')){ if(e.key==='ArrowLeft') setGallery(galleryIndex-1); if(e.key==='ArrowRight') setGallery(galleryIndex+1); }});

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
