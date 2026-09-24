import * as THREE from 'three';

export function createRenderer(canvas){
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
}
export function createScene(){
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x82c9ef);
  scene.fog=new THREE.Fog(0x82c9ef,80,180);
  scene.add(new THREE.HemisphereLight(0xdaf2ff,0x48643d,1.6));
  const sun=new THREE.DirectionalLight(0xffffff,1.7); sun.position.set(30,70,20); scene.add(sun);
  return scene;
}
export function resize(renderer,camera){
  camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight,false);
}
