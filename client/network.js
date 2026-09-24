export class Network{
  constructor(){this.ws=null;this.connected=false;this.listeners={};this.url=''}
  on(type,fn){(this.listeners[type]??=[]).push(fn)}
  emit(type,data){for(const f of this.listeners[type]||[])f(data)}
  connect(url){this.url=url;return new Promise((resolve,reject)=>{try{this.ws=new WebSocket(url);this.ws.onopen=()=>{this.connected=true;this.emit('open');resolve()};this.ws.onmessage=e=>{try{this.emit('message',JSON.parse(e.data))}catch{}};this.ws.onclose=()=>{this.connected=false;this.emit('close')};this.ws.onerror=reject}catch(e){reject(e)}})}
  send(type,data){if(this.ws?.readyState===1)this.ws.send(JSON.stringify({type,...data}))}
}
