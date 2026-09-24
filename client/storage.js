const DB='voxelverse',VERSION=1;
export function openSave(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,VERSION);r.onupgradeneeded=()=>r.result.createObjectStore('worlds');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
export async function saveWorld(name,data){const db=await openSave();return new Promise((res,rej)=>{const tx=db.transaction('worlds','readwrite');tx.objectStore('worlds').put({version:1,checksum:simpleHash(JSON.stringify(data)),data},name);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)})}
export async function loadWorld(name){const db=await openSave();return new Promise((res,rej)=>{const tx=db.transaction('worlds');const r=tx.objectStore('worlds').get(name);r.onsuccess=()=>{const v=r.result;if(v&&v.checksum===simpleHash(JSON.stringify(v.data)))res(v.data);else res(null)};r.onerror=()=>rej(r.error)})}
function simpleHash(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0}
