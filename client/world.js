import * as THREE from 'three';

export const BLOCKS={
 AIR:{id:0,name:'Air',color:0x000000,solid:false},
 GRASS:{id:1,name:'Grass',color:0x57a84f,solid:true},
 DIRT:{id:2,name:'Dirt',color:0x8b5a35,solid:true},
 STONE:{id:3,name:'Stone',color:0x7b7f82,solid:true},
 SAND:{id:4,name:'Sand',color:0xd8c17a,solid:true},
 WOOD:{id:5,name:'Wood',color:0x9a693f,solid:true},
 LEAF:{id:6,name:'Leaf',color:0x2f8b45,solid:true},
 WATER:{id:7,name:'Water',color:0x429bd0,solid:false},
 GLASS:{id:8,name:'Glass',color:0x9bdff5,solid:true}
};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function hash(x,z,seed=1337){let h=(x*374761393+z*668265263+seed*1442695041)|0;h=(h^(h>>>13))*1274126177;return ((h^(h>>>16))>>>0)/4294967296}
export function heightAt(x,z,seed=1337){const a=Math.sin((x+seed)*.035)*5, b=Math.cos((z-seed)*.028)*4, c=Math.sin((x+z)*.018)*7;return clamp(Math.floor(12+a+b+c+hash(x,z,seed)*5),3,28)}
export function generateWorld(scene,seed=1337,radius=30){
  const group=new THREE.Group(); group.name='VoxelWorld';
  const geo=new THREE.BoxGeometry(1,1,1);
  const mats=new Map();
  const getMat=id=>mats.get(id)||mats.set(id,new THREE.MeshLambertMaterial({color:BLOCKS[id].color,transparent:id===7||id===8,opacity:id===7 ? 0.65 : id===8 ? 0.45 : 1})).get(id);
  const blocks=new Map();
  const put=(x,y,z,id)=>{blocks.set(`${x},${y},${z}`,id); const m=new THREE.Mesh(geo,getMat(id));m.position.set(x,y,z);m.userData.block={x,y,z,id};group.add(m)};
  for(let x=-radius;x<=radius;x++)for(let z=-radius;z<=radius;z++){
    const h=heightAt(x,z,seed);
    for(let y=0;y<=h;y++) put(x,y,z,y===h?BLOCKS.GRASS.id:y>h-3?BLOCKS.DIRT.id:BLOCKS.STONE.id);
    if(h>10 && hash(x,z,seed)>.92){for(let ty=1;ty<=4;ty++)put(x,h+ty,z,BLOCKS.WOOD.id);for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=3;dy<=5;dy++)if(Math.abs(dx)+Math.abs(dz)+Math.abs(dy-4)<5)put(x+dx,h+dy,z+dz,BLOCKS.LEAF.id)}
  }
  scene.add(group); return {group,blocks,seed, radius};
}
export function removeBlock(world,mesh){if(!mesh?.userData.block)return; const b=mesh.userData.block;world.blocks.delete(`${b.x},${b.y},${b.z}`);world.group.remove(mesh);mesh.geometry.dispose?.()}
export function addBlock(world,x,y,z,id=BLOCKS.DIRT.id){
  const key=`${x},${y},${z}`; if(world.blocks.has(key))return null;
  const geo=new THREE.BoxGeometry(1,1,1);const mat=new THREE.MeshLambertMaterial({color:BLOCKS[id].color});
  const mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,y,z);mesh.userData.block={x,y,z,id};world.blocks.set(key,id);world.group.add(mesh);return mesh;
}
export function raycastBlock(camera,scene,distance=8){
  const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(0,0),camera);
  return ray.intersectObjects(scene.getObjectByName('VoxelWorld')?.children||[],false)[0];
}
