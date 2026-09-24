export function initUI(game){
  const bar=document.querySelector('#hotbar');
  const names=['Grass','Dirt','Stone','Wood','Leaf','Sand','Water','Glass','Tool'];
  bar.innerHTML=names.map((n,i)=>`<div class="slot ${i===0?'sel':''}" data-slot="${i}">${n}<small>${i+1}</small></div>`).join('');
  bar.addEventListener('click',e=>{const s=e.target.closest('.slot');if(s){game.selected=+s.dataset.slot;bar.querySelectorAll('.slot').forEach(x=>x.classList.remove('sel'));s.classList.add('sel')}})
  const load=(n,t)=>{document.querySelector('#load-bar').style.width=n+'%';document.querySelector('#load-text').textContent=t};
  load(100,'Ready');setTimeout(()=>{document.querySelector('#loading').style.opacity='0';setTimeout(()=>document.querySelector('#loading').remove(),500)},200);
  setInterval(()=>{document.querySelector('#fps').textContent=`${game.fps||0} FPS`;document.querySelector('#status').textContent=`♥ ${game.health}  ◈ ${game.hunger}  XP ${game.xp}`},250);
  document.querySelector('#menu-btn').onclick=()=>game.toggleMenu();
  document.querySelectorAll('[data-menu]').forEach(b=>b.onclick=()=>{const a=b.dataset.menu;if(a==='resume'||a==='close')document.querySelector('#menu').classList.add('hidden');if(a==='save')localStorage.setItem('voxelverse:lastSeed',String(game.seed));if(a==='settings')document.querySelector('#menu-output').textContent='Performance: AUTO\\nControls: pointer lock + touch drag\\nAccessibility: scalable HUD';if(a==='achievements')document.querySelector('#menu-output').textContent='First Steps • Explorer • Builder • Survivor';if(a==='servers')document.querySelector('#menu-output').textContent='Local server: '+location.host});
}
