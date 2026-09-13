/* Magnet growth-3d-1. Procedural models; locally bundled Three.js. */
'use strict';
const $=id=>document.getElementById(id), T=THREE, VERSION='growth-3d-1', DT=1/120;
const scene=new T.Scene();scene.background=new T.Color('#b8cbc3');scene.fog=new T.Fog('#b8cbc3',35,100);
let renderer;
try{renderer=new T.WebGLRenderer({canvas:$('world'),antialias:true});}catch(e){$('card').innerHTML='<h1>3D unavailable</h1><p>This prototype needs a browser with WebGL enabled.</p>';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const camera=new T.PerspectiveCamera(52,innerWidth/innerHeight,.05,150);
scene.add(new T.HemisphereLight(0xe9f5df,0x576c69,2.4));
const sun=new T.DirectionalLight(0xffe0a2,3.2);sun.position.set(-12,25,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-28,right:28,top:28,bottom:-28,near:1,far:70});sun.shadow.bias=-.0003;sun.shadow.normalBias=.025;scene.add(sun);
const matCache={};function mat(color,metal=.1){const key=color+':'+metal;return matCache[key]||(matCache[key]=new T.MeshStandardMaterial({color,metalness:metal,roughness:metal>.4?.32:.76}));}
const palette={steel:'#9caeb4',dark:'#354b53',gold:'#f0be4e',red:'#c9694f',green:'#4d8078',wood:'#b29164',cream:'#ece0b7'};
const boxGeo=new T.BoxGeometry(1,1,1),cylGeo=new T.CylinderGeometry(1,1,1,12),sphereGeo=new T.SphereGeometry(1,24,16),ringGeo=new T.TorusGeometry(1,.23,8,16);
function mesh(geo,color,pos,scale,parent,metal=.1){const m=new T.Mesh(geo,mat(color,metal));m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(parent,color,x,y,z,w,h,d,metal=.1){return mesh(boxGeo,color,[x,y,z],[w,h,d],parent,metal)}
function cylinder(parent,color,x,y,z,r,h,metal=.6){return mesh(cylGeo,color,[x,y,z],[r,h,r],parent,metal)}
const room=new T.Group();scene.add(room);
box(room,'#7e9691',0,-.18,0,52,.35,44);
// Large floor tiles and bright workshop architecture give perspective and scale.
for(let x=-24;x<=24;x+=4)box(room,'#718c86',x,.002,0,.025,.006,42);
for(let z=-20;z<=20;z+=4)box(room,'#718c86',0,.003,z,50,.006,.025);
box(room,'#7b9690',0,3.3,-21.4,52,6.6,.5);box(room,'#8da69c',-25.4,3.3,0,.5,6.6,43);
for(let x=-20;x<=20;x+=10){box(room,'#c5ded0',x,4.4,-21.08,6,3,.08);box(room,'#5a7873',x,4.4,-20.99,.12,3,.08);box(room,'#5a7873',x,4.4,-20.99,6,.12,.08)}
// Keep the roof open so the follow camera is never hidden by rafters.
// Ramp from tabletop to floor. Top is at y=2, bottom at x=13.
const ramp=new T.BufferGeometry();ramp.setAttribute('position',new T.Float32BufferAttribute([5,2,-1.4,5,2,1.4,13,0,1.4,5,2,-1.4,13,0,1.4,13,0,-1.4],3));ramp.computeVertexNormals();const rampMesh=new T.Mesh(ramp,mat('#c4a66a'));rampMesh.receiveShadow=true;scene.add(rampMesh);
for(let x=5.3;x<13;x+=.5)box(room,'#9d814f',x,2-(x-5)/4+.015,0,.05,.025,2.8);
// Floor route marks and decorative nonmetal crates along the perimeter.
for(let x=14;x<21;x+=1.5)box(room,'#dccb84',x,.012,0,.65,.02,.16);
for(let i=0;i<9;i++){let x=-22+i*5;box(room,'#aa885b',x,.6,-18,1.3,1.2,1.2);box(room,'#745f45',x,.62,-17.38,.08,1.2,.04)}
function textSprite(text,color='#f8e9b9',size=256){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#24433ce0';ctx.roundRect(0,0,512,128,22);ctx.fill();ctx.font='bold 42px Arial';ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(text,256,80);const map=new T.CanvasTexture(c);const s=new T.Sprite(new T.SpriteMaterial({map,depthWrite:false}));s.scale.set(2.4,.6,1);return s;}
const signs=[];function sign(text,x,y,z){const s=textSprite(text);s.position.set(x,y,z);scene.add(s);signs.push(s);return s;}
sign('SMALL BEGINNINGS',-3,3.1,-3.4);sign('DOWN TO THE FLOOR →',9,2.5,-2);const benchSign=sign('COME BACK BIGGER',0,4.1,-.2);
const ball=new T.Group();scene.add(ball);const rolling=new T.Group();ball.add(rolling);const shell=mesh(sphereGeo,'#e6b842',[0,0,0],[.32,.32,.32],rolling,.65);
for(let i=0;i<3;i++){const stripe=mesh(ringGeo,i===1?'#e7e0bb':'#466b6b',[0,0,0],[.279,.279,.279],rolling,.5);stripe.rotation.set(i*Math.PI/2,i===2?Math.PI/2:0,0)}
const field=new T.Mesh(new T.TorusGeometry(1,.012,6,80),new T.MeshBasicMaterial({color:'#b8f4e0',transparent:true,opacity:.5,depthWrite:false}));field.rotation.x=Math.PI/2;scene.add(field);
let objects=[],attachments=[],p=new T.Vector3(-3,2.32,.6),velocity=new T.Vector3(),radius=.32,mass=0,state='start',elapsed=0,count=0,yaw=0,pitch=.62,keys=new Set(),last=0,acc=0,toastTimer=0,repelCooldown=0,floorReached=false,lastStage=0,storageOK=true,best=null,frameMs=0;
try{best=JSON.parse(localStorage.getItem(VERSION)||'null')}catch{storageOK=false}
const defs={bolt:{need:0,mass:.45,size:.14,label:'BOLTS',color:palette.steel},can:{need:.48,mass:1.4,size:.25,label:'CANS',color:palette.red},tool:{need:.64,mass:3,size:.4,label:'TOOLS',color:palette.steel},wheel:{need:.85,mass:6,size:.55,label:'WHEELS',color:palette.dark},stool:{need:1.05,mass:10,size:.65,label:'STOOLS',color:palette.gold},locker:{need:1.35,mass:20,size:1,label:'LOCKERS',color:palette.green},bench:{need:1.8,mass:180,size:2.7,label:'THE WORKBENCH',color:palette.wood}};
function model(kind){const g=new T.Group(),d=defs[kind];
if(kind==='bolt'){cylinder(g,palette.steel,0,0,0,.045,.22);cylinder(g,palette.cream,0,.12,0,.105,.05)}
if(kind==='can'){cylinder(g,palette.red,0,0,0,.16,.4);cylinder(g,palette.steel,0,.21,0,.16,.025);box(g,palette.cream,0,0,.157,.17,.18,.02)}
if(kind==='tool'){box(g,palette.steel,0,0,0,.13,.09,.6,.7);const head=mesh(ringGeo,palette.steel,[0,0,-.3],[.16,.16,.16],g,.7);head.rotation.x=Math.PI/2;box(g,palette.red,0,0,.12,.15,.11,.26)}
if(kind==='wheel'){const tire=mesh(ringGeo,palette.dark,[0,0,0],[.43,.43,.43],g);cylinder(g,palette.steel,0,0,0,.18,.13).rotation.x=Math.PI/2;for(let i=0;i<4;i++){const spoke=box(g,palette.steel,0,0,0,.055,.68,.07,.6);spoke.rotation.z=i*Math.PI/4}}
if(kind==='stool'){cylinder(g,palette.gold,0,.35,0,.48,.12);for(let x of [-.28,.28])for(let z of [-.28,.28])box(g,palette.dark,x,-.1,z,.065,.85,.065);}
if(kind==='locker'){box(g,palette.green,0,0,0,1.1,1.8,.65,.5);for(let y of [-.4,.1,.6])box(g,palette.cream,.28,y,.34,.12,.06,.045);for(let y of [.55,.65,.75])box(g,palette.dark,-.14,y,.34,.4,.025,.03)}
if(kind==='bench'){box(g,palette.wood,0,0,0,10,.25,6);box(g,palette.gold,0,-.3,0,9.4,.4,5.4);for(let x of [-4.5,4.5])for(let z of [-2.5,2.5])box(g,palette.green,x,-1.1,z,.25,2,.25);box(g,palette.green,-2,-.6,2.8,3,.7,.4);}
return g;}
function addObject(kind,x,y,z){const d=defs[kind],obj={id:objects.length,kind,...d,pos:new T.Vector3(x,y,z),mesh:model(kind),collected:false,cool:0,vel:new T.Vector3()};obj.mesh.position.copy(obj.pos);if(kind!=='bench')obj.mesh.rotation.y=(objects.length*2.399)%6.28;scene.add(obj.mesh);objects.push(obj);return obj;}
function terrain(x,z){if(!objects.find(o=>o.kind==='bench')?.collected&&x>=-5&&x<=5&&Math.abs(z)<=3)return 2;if(x>=5&&x<=13&&Math.abs(z)<=1.4)return 2-(x-5)/4;return 0;}
function reset(start=true){for(const o of objects)scene.remove(o.mesh);for(const a of attachments)rolling.remove(a.mesh);objects=[];attachments=[];p.set(-3,2.32,.6);velocity.set(0,0,0);rolling.quaternion.identity();radius=.32;mass=0;elapsed=0;count=0;repelCooldown=0;floorReached=false;lastStage=0;yaw=0;keys.clear();acc=0;state=start?'play':'start';shell.scale.setScalar(radius);benchSign.visible=true;
addObject('bench',0,1.875,0);
for(let i=0;i<24;i++){const x=-3.8+(i%8)*.91,z=-1.8+Math.floor(i/8)*1.55;addObject('bolt',x,2.14,z)}
for(let i=0;i<6;i++)addObject('can',1.2+(i%3)*1.15,2.22,-1.2+Math.floor(i/3)*2.2);
for(let i=0;i<3;i++)addObject('tool',3.2,2.1,-1.8+i*1.7);
// Every later tier has surplus on the floor, including recovery-sized scrap.
for(let i=0;i<16;i++){let a=i*2.399,r=4+(i%5)*2;addObject('bolt',12+Math.cos(a)*r*.65,.14,Math.sin(a)*r)}
for(let i=0;i<16;i++){let a=i*2.399;addObject('can',Math.cos(a)*12,.22,Math.sin(a)*11+2)}
for(let i=0;i<13;i++){let a=i*2.399+.7;addObject('tool',Math.cos(a)*15,.12,Math.sin(a)*13)}
for(let i=0;i<12;i++){let a=i*Math.PI/6;addObject('wheel',Math.cos(a)*17,.55,Math.sin(a)*14)}
for(let i=0;i<8;i++){let a=i*Math.PI/4+.2;addObject('stool',Math.cos(a)*19,.6,Math.sin(a)*16)}
for(let i=0;i<4;i++)addObject('locker',-18+i*11,.92,-16);
camera.position.set(-3,7.5,9);message('Start small. Roll into the bolts.');panel();draw(0);}
function message(text){$('toast').textContent=text;toastTimer=3;}
function grow(){radius=.32*Math.cbrt(1+mass/1.2);shell.scale.setScalar(radius*.9);for(const a of attachments)a.mesh.position.copy(a.dir).multiplyScalar(radius*.98+a.size*.55);}
let audio=null,sound=false,lastSound=0;function ping(size){if(!sound||!audio||audio.currentTime-lastSound<.07)return;lastSound=audio.currentTime;const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(320+500/(size+1),lastSound);o.frequency.exponentialRampToValueAtTime(140,lastSound+.12);g.gain.setValueAtTime(.04,lastSound);g.gain.exponentialRampToValueAtTime(.001,lastSound+.2);o.connect(g).connect(audio.destination);o.start();o.stop(lastSound+.22);}
function collect(o){if(o.collected)return;o.collected=true;count++;mass+=o.mass;
const dir=o.pos.clone().sub(p);if(dir.length()<.01)dir.set(0,0,1);dir.normalize().applyQuaternion(rolling.quaternion.clone().invert());scene.remove(o.mesh);rolling.add(o.mesh);o.mesh.quaternion.premultiply(rolling.quaternion.clone().invert());const a={...o,dir};attachments.push(a);grow();ping(o.size);
if(o.kind==='bench'){benchSign.visible=false;state='result';keys.clear();if(!best||elapsed<best.time){best={time:elapsed,count};try{localStorage.setItem(VERSION,JSON.stringify(best))}catch{storageOK=false}}panel();return;}
const stage=radius>=1.8?5:radius>=1.35?4:radius>=.85?3:radius>=.64?2:radius>=.48?1:0;if(stage>lastStage){lastStage=stage;message(['','Cans are on the menu.','Tools? Yours now.','Bring on the wheels.','You can eat lockers.','Go back. Eat the workbench.'][stage]);}}
function repel(){if(state!=='play'||repelCooldown>0)return;repelCooldown=1.4;const removed=attachments.splice(Math.max(0,attachments.length-5));let i=0;for(const a of removed){rolling.remove(a.mesh);scene.add(a.mesh);const o=objects[a.id];o.collected=false;mass-=o.mass;count--;const angle=yaw+Math.PI+(i++-removed.length/2)*.45;o.pos.copy(p).add(new T.Vector3(Math.sin(angle),.3,Math.cos(angle)).multiplyScalar(radius+o.size+1));o.vel.set(Math.sin(angle)*6,3,Math.cos(angle)*6);o.cool=2;o.mesh.position.copy(o.pos);}
grow();velocity.x+=Math.sin(yaw)*5;velocity.z-=Math.cos(yaw)*5;velocity.y=3;message(removed.length?'Scrap burst! Roll on.':'Magnetic burst!');}
function step(input){if(state!=='play')return;const dx=input?.x??((keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)),dz=input?.z??((keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0)),attract=input?.attract??keys.has('Space');
if(keys.has('KeyQ'))yaw+=DT*1.4;if(keys.has('KeyE'))yaw-=DT*1.4;
const move=new T.Vector3(dx,0,dz);if(move.length()>1)move.normalize();move.applyAxisAngle(T.Object3D.DEFAULT_UP,yaw);const speed=4.8+Math.min(radius*2.1,4.5),blend=1-Math.exp(-9*DT);velocity.x=T.MathUtils.lerp(velocity.x,move.x*speed,blend);velocity.z=T.MathUtils.lerp(velocity.z,move.z*speed,blend);velocity.y-=15*DT;
const before=p.clone();p.addScaledVector(velocity,DT);p.x=T.MathUtils.clamp(p.x,-24+radius,24-radius);p.z=T.MathUtils.clamp(p.z,-20+radius,20-radius);
const floor=terrain(p.x,p.z),oldFloor=terrain(before.x,before.z);if(floor>oldFloor+.15&&p.y-radius<floor-.18){p.x=before.x;p.z=before.z;velocity.x*=.3;velocity.z*=.3;}
const ground=terrain(p.x,p.z)+radius;if(p.y<ground){p.y=ground;velocity.y=0;}if(p.y-radius<.15&&!floorReached){floorReached=true;message('The floor is a feast. Keep growing.');}
const travel=new T.Vector3(p.x-before.x,0,p.z-before.z),distance=travel.length();if(distance>.00001){const axis=new T.Vector3(travel.z,0,-travel.x).normalize();rolling.quaternion.premultiply(new T.Quaternion().setFromAxisAngle(axis,distance/radius));}
repelCooldown=Math.max(0,repelCooldown-DT);elapsed+=DT;let nearest=null,nd=Infinity;
for(const o of objects){if(o.collected)continue;o.cool=Math.max(0,o.cool-DT);if(o.vel.lengthSq()>.002){o.vel.y-=15*DT;o.pos.addScaledVector(o.vel,DT);const surface=terrain(o.pos.x,o.pos.z)+(o.kind==='tool'?.12:o.size);if(o.pos.y<surface){o.pos.y=surface;o.vel.y=0;}o.vel.x*=Math.exp(-3*DT);o.vel.z*=Math.exp(-3*DT);o.pos.x=T.MathUtils.clamp(o.pos.x,-23,23);o.pos.z=T.MathUtils.clamp(o.pos.z,-19,19);}
const delta=p.clone().sub(o.pos),d=delta.length(),eligible=radius+.0001>=o.need;
if(o.kind==='bench'){if(eligible&&Math.abs(p.x)<5+radius&&Math.abs(p.z)<3+radius&&p.y<3+radius){collect(o);break;}continue;}
if(d<nd){nd=d;nearest=o;}if(eligible&&o.cool<=0){const reach=radius+o.size+(attract?2+radius*.7:.22);if(d<reach){if(d<radius+o.size*.75+.16){collect(o);continue;}o.pos.addScaledVector(delta,Math.min(1,DT*(attract?9:4)));}}
else if(d<radius+o.size*.75&&Math.abs(p.y-o.pos.y)<radius+o.size){const away=p.clone().sub(o.pos);away.y=0;if(away.length()>.01){away.normalize();p.addScaledVector(away,(radius+o.size*.75-d)*.6);}}
o.mesh.position.copy(o.pos);}
if(nearest&&nd<radius+3)$('target').textContent=radius>=nearest.need?nearest.label+' · pull it in':nearest.label+' · grow to '+(nearest.need*2).toFixed(1)+' m';else $('target').textContent=radius>=1.8?'THE WORKBENCH IS SMALL ENOUGH NOW.':'Collect metal to grow. Space extends your pull.';
}
function panel(){const show=state!=='play';$('overlay').hidden=!show;if(!show)return;const title=state==='result'?'You ate<br>the workbench.':state==='paused'?'Hold that<br>appetite.':'Small beginnings.<br>Huge appetite.';const subtitle=state==='result'?'From loose bolts to the whole bench. '+count+' objects in '+Math.floor(elapsed/60)+':'+String(Math.floor(elapsed%60)).padStart(2,'0')+'. Try another route.':state==='paused'?'The workshop is paused.':'Roll into metal. Grow a clattering ball of everything. What blocks you now becomes lunch later.';$('card').innerHTML='<div class="eyebrow">MAGNET / 3D GROWTH PROTOTYPE</div><h1>'+title+'</h1><p>'+subtitle+'</p><button id="go">'+(state==='result'?'Get enormous again':state==='paused'?'Keep rolling':'Let’s roll')+'</button><p class="fine">WASD to roll · Space to attract · Q / E to orbit<br>No deliveries. No timer to beat. Just get bigger.</p>';$('go').onclick=()=>{if(state==='paused'){state='play';panel()}else reset()};}
function pause(){if(state==='play'){state='paused';keys.clear();panel()}else if(state==='paused'){state='play';keys.clear();panel()}}
function draw(delta){const start=performance.now();ball.position.copy(p);const target=p.clone().add(new T.Vector3(0,radius*.25,0)),dist=5.8+radius*3.8,desired=target.clone().add(new T.Vector3(Math.sin(yaw)*Math.cos(pitch)*dist,Math.sin(pitch)*dist,Math.cos(yaw)*Math.cos(pitch)*dist));camera.position.lerp(desired,delta===0?1:1-Math.exp(-5*delta));camera.lookAt(target);
field.position.set(p.x,Math.max(terrain(p.x,p.z)+.035,p.y-radius+.035),p.z);field.scale.setScalar(radius+(keys.has('Space')?2+radius*.7:.35));field.visible=state==='play';field.material.opacity=keys.has('Space')?.48:.13;
toastTimer=Math.max(0,toastTimer-delta);$('toast').style.opacity=toastTimer>0?1:0;
$('size').firstChild.textContent=radius*2<1?(radius*200).toFixed(0)+' cm':(radius*2).toFixed(2)+' m';$('phase').textContent=radius>=1.8?'WORKBENCH EATER':radius>=1.05?'WORKSHOP MENACE':radius>=.64?'SCRAP SNOWBALL':'TABLETOP TINY';$('bar').style.width=Math.min(100,(radius-.32)/(1.8-.32)*100)+'%';$('progress').textContent=count+' objects stuck · '+(radius>=1.8?'The workbench is ready.':'Grow to 3.6 m to eat the workbench.');$('objective').textContent=state==='result'?'Workshop swallowed':radius>=1.8?'Eat the workbench':'Outgrow the workbench';benchSign.visible=state!=='result'&&floorReached;benchSign.material.opacity=radius>=1.8?1:.7;
renderer.render(scene,camera);frameMs=performance.now()-start;$('debug').textContent=VERSION+'\n'+objects.length+' total / '+attachments.length+' attached\nradius '+radius.toFixed(3)+' / mass '+mass.toFixed(2)+'\nrender '+frameMs.toFixed(2)+' ms / calls '+renderer.info.render.calls+'\nposition '+p.toArray().map(n=>n.toFixed(2)).join(', ')+'\nstorage '+storageOK;}
function frame(now){const delta=Math.min(.067,(now-last)/1000||0);last=now;if(state==='play'){acc+=delta;let n=0;while(acc>=DT&&n++<8){step();acc-=DT}if(n>8)acc=0;}draw(delta);requestAnimationFrame(frame);}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}window.addEventListener('resize',resize);resize();
document.addEventListener('keydown',e=>{if(e.target.tagName==='BUTTON'&&e.code==='Space')return;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.repeat)return;if(e.code==='Enter'&&state!=='play'){state==='paused'?pause():reset();return}if(e.code==='Escape'){pause();return}if(e.code==='KeyR'){reset();return}if(e.code==='ShiftLeft'||e.code==='ShiftRight'){repel();return}if(e.code==='F3'){e.preventDefault();$('debug').style.display=$('debug').style.display==='block'?'none':'block';return}keys.add(e.code)});document.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{if(state==='play')pause();keys.clear()});document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')pause()});
let dragging=false;const canvas=$('world');canvas.addEventListener('pointerdown',e=>{dragging=true;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointermove',e=>{if(dragging){yaw-=e.movementX*.006;pitch=T.MathUtils.clamp(pitch+e.movementY*.004,.25,1.2)}});
$('pause').onclick=()=>{pause();$('pause').blur()};$('restart').onclick=()=>{reset();$('restart').blur()};$('sound').onclick=()=>{try{audio=audio||new AudioContext();audio.resume();sound=!sound;$('sound').textContent=sound?'Sound on':'Sound off'}catch{}$('sound').blur()};
window.Magnet3D={reset,step,repel,pause,draw,snapshot:()=>({version:VERSION,state,radius,mass,count,total:objects.length,elapsed,floorReached,position:p.toArray(),velocity:velocity.toArray(),attached:attachments.length,frameMs}),get objects(){return objects},get position(){return p},get camera(){return camera},get renderer(){return renderer}};
reset(false);requestAnimationFrame(frame);
