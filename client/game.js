import * as THREE from 'three';
import {createRenderer,createScene,resize} from './renderer.js';
import {generateWorld,raycastBlock,removeBlock,addBlock,BLOCKS} from './world.js';

const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export class Game{
  constructor(canvas){
    this.canvas=canvas;this.renderer=createRenderer(canvas);this.scene=createScene();
    this.camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.05,500);
    this.camera.position.set(0,20,10);this.yaw=0;this.pitch=0;
    this.keys=new Set();this.touch={x:0,y:0};this.selected=1;this.health=20;this.hunger=20;this.xp=0;
    this.seed=1337;this.world=generateWorld(this.scene,this.seed,28);this.clock=new THREE.Clock();this.fps=0;this.frames=0;this.fpsT=performance.now();
    this.inventory={Grass:64,Dirt:64,Stone:32,Wood:16};this.setup();
  }
  setup(){
    addEventListener('resize',()=>resize(this.renderer,this.camera));
    addEventListener('keydown',e=>{this.keys.add(e.code);if(/^Digit[1-9]$/.test(e.code))this.selected=+e.code.at(-1)-1;if(e.code==='KeyE')this.toggleMenu()});
    addEventListener('keyup',e=>this.keys.delete(e.code));
    this.canvas.addEventListener('click',()=>this.canvas.requestPointerLock?.());
    addEventListener('mousemove',e=>{if(document.pointerLockElement===this.canvas)this.look(e.movementX,e.movementY)});
    this.canvas.addEventListener('pointerdown',e=>{this.px=e.clientX;this.py=e.clientY});
    this.canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&e.buttons){this.look(e.clientX-this.px,e.clientY-this.py);this.px=e.clientX;this.py=e.clientY}});
    this.canvas.addEventListener('contextmenu',e=>e.preventDefault());
    this.canvas.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'&&e.button===0)this.break();if(e.pointerType!=='touch'&&e.button===2)this.place()});
    document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>this[b.dataset.action]?.()));
  }
  look(dx,dy){this.yaw-=dx*.0022;this.pitch=clamp(this.pitch-dy*.0022,-1.52,1.52)}
  break(){const hit=raycastBlock(this.camera,this.scene);if(hit){removeBlock(this.world,hit.object);this.xp++}}
  place(){const hit=raycastBlock(this.camera,this.scene);if(!hit)return;const n=hit.face.normal.clone();const p=hit.object.position.clone().add(n);addBlock(this.world,Math.round(p.x),Math.round(p.y),Math.round(p.z),[1,2,3,5][this.selected%4])}
  jump(){if(this.camera.position.y<heightAtApprox(this.camera.position.x,this.camera.position.z)+2)this.camera.position.y+=1.2}
  toggleMenu(){document.querySelector('#menu').classList.toggle('hidden')}
  update(dt){
    const dir=new THREE.Vector3((this.keys.has('KeyD')?1:0)-(this.keys.has('KeyA')?1:0),0,(this.keys.has('KeyS')?1:0)-(this.keys.has('KeyW')?1:0));
    if(dir.lengthSq()){dir.normalize();const speed=this.keys.has('ShiftLeft')?10:5;dir.applyAxisAngle(new THREE.Vector3(0,1,0),this.yaw);this.camera.position.addScaledVector(dir,speed*dt)}
    this.camera.rotation.order='YXZ';this.camera.rotation.y=this.yaw;this.camera.rotation.x=this.pitch;
    this.camera.position.y=Math.max(2,this.camera.position.y);
    this.frames++;if(performance.now()-this.fpsT>1000){this.fps=this.frames;this.frames=0;this.fpsT=performance.now()}
  }
  render(){this.renderer.render(this.scene,this.camera)}
  loop(){requestAnimationFrame(()=>this.loop());const dt=Math.min(this.clock.getDelta(),.05);this.update(dt);this.render()}
}
function heightAtApprox(x,z){return 14+Math.sin(x*.035)*5+Math.cos(z*.028)*4}
