import http from 'node:http';
import {WebSocketServer} from 'ws';
import {readFile} from 'node:fs/promises';
import {createReadStream,existsSync} from 'node:fs';
import path from 'node:path';
const PORT=Number(process.env.PORT||3001), ROOT=process.cwd(), players=new Map(), rooms=new Map([['lobby',new Set()]]);
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
  let u=new URL(req.url,`http://${req.headers.host}`).pathname;
  if(u==='/health'){res.writeHead(200,{'content-type':'application/json'});return res.end(JSON.stringify({ok:true,players:players.size,rooms:rooms.size}))}
  let file=path.join(ROOT,u==='/'?'index.html':u);
  if(!existsSync(file))file=path.join(ROOT,'index.html');
  try{const data=await readFile(file);res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream'});res.end(data)}catch{res.writeHead(404);res.end('Not found')}}
);
const wss=new WebSocketServer({server,path:'/ws'});
function broadcast(room,msg,except){for(const ws of rooms.get(room)||[])if(ws!==except&&ws.readyState===1)ws.send(JSON.stringify(msg))}
wss.on('connection',(ws,req)=>{
  const id=crypto.randomUUID();const player={id,ws,room:'lobby',x:0,y:20,z:0,name:'Player-'+id.slice(0,4)};players.set(id,player);rooms.get('lobby').add(ws);
  ws.send(JSON.stringify({type:'welcome',id,room:'lobby'}));broadcast('lobby',{type:'join',player:{id,name:player.name,x:0,y:20,z:0}},ws);
  ws.on('message',raw=>{try{const m=JSON.parse(raw);if(m.type==='move'){player.x=Number(m.x)||0;player.y=Number(m.y)||0;player.z=Number(m.z)||0;broadcast(player.room,{type:'move',id,x:player.x,y:player.y,z:player.z},ws)}else if(m.type==='chat'){const text=String(m.text||'').replace(/[<>]/g,'').slice(0,200);broadcast(player.room,{type:'chat',id,name:player.name,text})}else if(m.type==='room'){const r=String(m.room||'lobby').slice(0,32);rooms.get(player.room)?.delete(ws);if(!rooms.has(r))rooms.set(r,new Set());player.room=r;rooms.get(r).add(ws);ws.send(JSON.stringify({type:'room',room:r}))}}catch{}}});
  ws.on('close',()=>{rooms.get(player.room)?.delete(ws);players.delete(id);broadcast(player.room,{type:'leave',id})});
});
setInterval(()=>{for(const [name,set] of rooms)if(set.size===0&&name!=='lobby')rooms.delete(name)},5000);
server.listen(PORT,()=>console.log(`VOXELVERSE server listening on ${PORT}`));
