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
