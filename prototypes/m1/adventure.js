/* Magnet districts: fixed core, compound scrap and forgiving navigation. */
'use strict';
const CORE=.32, SAVE=VERSION+'.save', OPTIONS=VERSION+'.options';
const root=new T.Group(),rolling=new T.Group();root.add(rolling);scene.add(root);
const core=mesh(sphereGeo,palette.gold,[0,0,0],[CORE,CORE,CORE],rolling,.65);
for(let i=0;i<3;i++){const band=mesh(ringGeo,i===1?palette.cream:palette.green,[0,0,0],[.28,.28,.28],rolling,.5);band.rotation.set(i*Math.PI/2,i===2?Math.PI/2:0,0);}
const pile=new MagneticPile(T,rolling,CORE);
const field=new T.Mesh(new T.TorusGeometry(1,.012,6,80),new T.MeshBasicMaterial({color:'#cdf3df',transparent:true,opacity:.25,depthWrite:false}));field.rotation.x=Math.PI/2;scene.add(field);
const arrow=new T.ArrowHelper(new T.Vector3(1,0,0),new T.Vector3(),2,0xffd263,.55,.3);scene.add(arrow);
let pickupFlash=0,autosaveEnabled=true;
const compass=$('target');
const regions=[
 {name:'THE WORKSHOP',goal:'bench',hint:'Gather tools and furniture, then take the workbench.',exit:25,spawn:[17,0,8]},
 {name:'SALVAGE YARD',goal:'forklift',hint:'Turn barrels, bikes and skips into forklift-sized trouble.',exit:94,spawn:[40,0,0]},
 {name:'MAIN STREET',goal:'bus',hint:'Parked cars and vans build enough pull for the bus.',exit:211,spawn:[111,0,0]},
 {name:'CITY PLAZA',goal:'sculpture',hint:'Collect the tram and street furniture. Take the skyline spire.',exit:410,spawn:[229,0,0]},
 {name:'THE RAILWORKS',goal:'locomotive',hint:'Gather tank wagons and excavators. Take the locomotive.',exit:650,spawn:[438,0,0]},
 {name:'THE DRY DOCKS',goal:'freighter',hint:'Collect tugboats and dock cranes. Bring home the freighter.',exit:1020,spawn:[685,0,0]},
 {name:'MERIDIAN AIRFIELD',goal:'airliner',hint:'Gather ground equipment and aircraft. Take the airliner.',exit:1530,spawn:[1052,0,0]},
 {name:'ORBITAL LAUNCH COMPLEX',goal:'rocket',hint:'Gather spacecraft and launch machinery. Take the orbital rocket.',exit:WORLD_END,spawn:[1560,0,0]}
];
let objects=[],geoCache={},goals=new Set(),seen=new Set(),stage=0,state='start',p=new T.Vector3(-3,2.32,.7),v=new T.Vector3(),yaw=0,pitch=.68,elapsed=0,cooldown=0,nudgeCooldown=0,stuck=0,nudges=0,rescues=0,last=0,acc=0,stepNumber=0,toastTimer=0,saveTimer=0,storageOK=true,saveData=null,frameMs=0,physicsMs=0,power=CORE,keys=new Set(),dirtyUI=true;
let settings={sound:false,reduced:false,quality:'high',invert:false,autoHelp:true,fieldToggle:false},audio=null,lastSound=0,fieldLatched=false;
try{settings={...settings,...JSON.parse(localStorage.getItem(OPTIONS)||'{}')};saveData=JSON.parse(localStorage.getItem(SAVE)||'null');}catch{storageOK=false;}
function sound(size){if(!settings.sound)return;try{audio=audio||new AudioContext();if(audio.state==='suspended')audio.resume();if(audio.currentTime-lastSound<.09)return;lastSound=audio.currentTime;const o=audio.createOscillator(),g=audio.createGain();o.type='triangle';o.frequency.setValueAtTime(160+380/(size+1),lastSound);o.frequency.exponentialRampToValueAtTime(70,lastSound+.14);g.gain.setValueAtTime(.035,lastSound);g.gain.exponentialRampToValueAtTime(.001,lastSound+.2);o.connect(g).connect(audio.destination);o.start();o.stop(lastSound+.22);}catch{}}
function message(text){$('toast').textContent=text;toastTimer=3.2;}
function terrain(x,z){if(!objects[0]?.collected&&x>=-5&&x<=5&&Math.abs(z)<=3)return 2;if(x>=5&&x<=13&&Math.abs(z)<=2)return 2-(x-5)/4;return 0;}
function addObject(kind,x,y,z,region,extra={}){
 const item={id:objects.length,kind,...defs[kind],region,...extra,mesh:model(kind),pos:new T.Vector3(x,y,z),vel:new T.Vector3(),cool:0,collected:false};
 if(!geoCache[kind])geoCache[kind]=pile.describe(item.mesh);item.geometryInfo=geoCache[kind];item.bound=item.geometryInfo.bound;if(y===null)item.pos.y=item.geometryInfo.size.y/2-item.geometryInfo.center.y+.03;item.mesh.position.copy(item.pos);if(kind!=='bench')item.mesh.rotation.y=(item.id*2.399)%6.28;scene.add(item.mesh);objects.push(item);return item;
}
function refreshPile(){pile.rebuild();power=CORE*Math.cbrt(1+pile.mass/1.2);dirtyUI=true;}
function reset(play=true){
 for(const item of objects)item.mesh.removeFromParent();pile.clear();objects=[];goals.clear();seen.clear();stage=0;elapsed=0;p.set(-3,2.32,.7);v.set(0,0,0);yaw=0;pitch=.68;cooldown=0;nudgeCooldown=0;stuck=0;nudges=0;rescues=0;stepNumber=0;saveTimer=0;keys.clear();fieldLatched=false;acc=0;state=play?'play':'start';
 autosaveEnabled=true;FieldNotes.reset();makeLayout(addObject);refreshPile();camera.position.set(-3,7,9);root.position.copy(p);message('The core stays small. Your scrap does the growing.');panel();render(0);
}
function save(){
 if(!objects.length||!autosaveEnabled)return;
 const data={version:VERSION,packing:2,found:FieldNotes.save(),p:p.toArray(),q:rolling.quaternion.toArray(),yaw,pitch,stage,goals:[...goals],seen:[...seen],elapsed,parts:pile.parts.map(a=>({id:a.item.id,crushed:!!a.item.crushed,p:a.item.mesh.position.toArray(),q:a.item.mesh.quaternion.toArray()})),free:objects.filter(o=>!o.collected).map(o=>({id:o.id,crushed:!!o.crushed,p:o.pos.toArray()}))};
 try{localStorage.setItem(SAVE,JSON.stringify(data));saveData=data;}catch{storageOK=false;}
}
function restore(){
 const data=saveData;if(!data||data.version!==VERSION)return reset();reset();
 try{
 for(const f of data.free){if(objects[f.id]&&f.p.every(Number.isFinite)){if(f.crushed)CrushWorkshop.apply(objects[f.id]);objects[f.id].pos.fromArray(f.p);objects[f.id].mesh.position.copy(objects[f.id].pos);}}
 const packing=data.packing===2?1:.75;
 for(const a of data.parts){const item=objects[a.id];if(!item||item.collected)continue;if(a.crushed)CrushWorkshop.apply(item);item.collected=true;item.mesh.removeFromParent();rolling.add(item.mesh);item.mesh.position.fromArray(a.p).multiplyScalar(packing);item.mesh.quaternion.fromArray(a.q);const cells=item.geometryInfo.cells.map(c=>({center:c.center.clone().applyQuaternion(item.mesh.quaternion).add(item.mesh.position),r:c.r,id:item.id}));pile.parts.push({item,position:item.mesh.position.clone(),quaternion:item.mesh.quaternion.clone(),cells});}
 stage=T.MathUtils.clamp(data.stage,0,regions.length-1);goals=new Set(data.goals);while(stage<regions.length-1&&goals.has(regions[stage].goal))stage++;seen=new Set(data.seen);FieldNotes.restore(data.found||data.parts.map(a=>a.id));elapsed=data.elapsed;p.fromArray(data.p);rolling.quaternion.fromArray(data.q);yaw=data.yaw;pitch=data.pitch;refreshPile();v.set(0,0,0);message('Back to your pile.');render(0);
 }catch{reset();message('Could not restore that run. Started fresh.');}
}
function collect(item){
 if(item.collected)return;const impact=item.pos.clone().sub(p);item.collected=true;seen.add(item.kind);if(CrushWorkshop.apply(item,!settings.reduced))message(item.label+" — crumpled into the pile.");pile.attach(item,impact);refreshPile();sound(item.bound);pickupFlash=.2;FieldNotes.collect(item);
 if(item.goal&&!goals.has(item.kind)){
   goals.add(item.kind);
   if(stage<regions.length-1&&regions[stage].goal===item.kind){stage++;message(regions[stage].name+' — the way ahead is open.');}
   else if(item.kind===regions.at(-1).goal){state='result';keys.clear();fieldLatched=false;message('One little magnet. Eight districts of metal.');panel();}
   save();
 } else if(item.landmark)message('The tram is yours. Find the skyline spire.');
}
function nudge(automatic=false){if(nudgeCooldown>0||state!=='play')return;nudgeCooldown=1.1;v.y=Math.max(v.y,3.5+Math.min(pile.rollRadius,4));rolling.quaternion.premultiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),.24));nudges++;if(!automatic)message('A little lift. Keep rolling.');}
function recover(){if(state!=='play'&&state!=='paused')return;const location=regions[stage].spawn;p.set(location[0],Math.max(2,pile.extent),location[2]);v.set(0,0,0);rescues++;stuck=0;message('Back in the clear — every piece kept.');save();}
function travelTo(index){if(!['play','paused'].includes(state)||!Number.isInteger(index)||index<0||index>stage)return false;const location=regions[index].spawn;p.set(location[0],Math.max(3,pile.extent),location[2]);v.set(0,0,0);stuck=0;message(regions[index].name+' — every piece kept.');save();return true;}
function repel(){
 if(state!=='play'||cooldown>0)return;cooldown=1.5;
 const removed=pile.detach(Math.min(5,pile.parts.length));let i=0;
 for(const a of removed){const item=a.item,worldQ=rolling.quaternion.clone().multiply(item.mesh.quaternion);item.mesh.removeFromParent();scene.add(item.mesh);item.mesh.quaternion.copy(worldQ);item.collected=false;const angle=yaw+Math.PI+(i++-removed.length/2)*.4;item.pos.copy(p).add(new T.Vector3(Math.sin(angle),.1,Math.cos(angle)).multiplyScalar(pile.extent+item.bound+2));item.pos.x=T.MathUtils.clamp(item.pos.x,-23,WORLD_END-5);item.pos.z=T.MathUtils.clamp(item.pos.z,-areaWidth(item.pos.x)+3,areaWidth(item.pos.x)-3);item.vel.set(Math.sin(angle)*7,4,Math.cos(angle)*7);item.cool=2;item.mesh.position.copy(item.pos);}
 refreshPile();v.y=4;v.x+=Math.sin(yaw)*4;v.z-=Math.cos(yaw)*4;message(removed.length?'Loose again. Your scrap is still out there.':'Magnetic burst.');
}
function areaWidth(x){return x<25?21:x<94?34:x<211?43:x<410?73:x<650?108:x<1020?140:x<1530?195:240;}
const tmp=new T.Vector3();
function support(proxies){let h=CORE;for(const c of proxies){const floor=terrain(p.x+c.center.x,p.z+c.center.z);if(floor<p.y+.35)h=Math.max(h,floor+c.r-c.center.y);}return h;}
function obstacleCollision(proxies,move){
 let hits=0;
 for(const o of obstacles){
   if(Math.abs(p.x-o.x)>pile.extent+o.w/2+1||Math.abs(p.z-o.z)>pile.extent+o.d/2+1)continue;
   for(const c of proxies){const x=p.x+c.center.x,y=p.y+c.center.y,z=p.z+c.center.z;if(y-c.r>o.top||y+c.r<o.y)continue;
    const cx=T.MathUtils.clamp(x,o.x-o.w/2,o.x+o.w/2),cz=T.MathUtils.clamp(z,o.z-o.d/2,o.z+o.d/2);let dx=x-cx,dz=z-cz,d=Math.hypot(dx,dz);if(d>=c.r*.86)continue;
    let penetration=c.r*.86-d;
    if(d<.001){dx=x-o.x;dz=z-o.z;if(o.w/2-Math.abs(dx)<o.d/2-Math.abs(dz)){penetration=c.r*.86+o.w/2-Math.abs(dx);dx=Math.sign(dx)||1;dz=0;}else{penetration=c.r*.86+o.d/2-Math.abs(dz);dz=Math.sign(dz)||1;dx=0;}d=1;}
    const amount=Math.min(.045,penetration);if(amount>0){p.x+=dx/d*amount;p.z+=dz/d*amount;hits++;}
   }
 }
 return hits;
}
function step(input){
 if(state!=='play')return;const begin=performance.now();
 const dx=input?.x??((keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0));
 const dz=input?.z??((keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0));
 const attract=input?.attract??(settings.fieldToggle?fieldLatched:keys.has('Space'));
 if(keys.has('KeyQ'))yaw+=DT*1.4;if(keys.has('KeyE'))yaw-=DT*1.4;
 const move=new T.Vector3(dx,0,dz);if(move.length()>1)move.normalize();move.applyAxisAngle(T.Object3D.DEFAULT_UP,yaw);
 const speed=5+Math.min(power*2.4,14),blend=1-Math.exp(-8*DT);v.x=T.MathUtils.lerp(v.x,move.x*speed,blend);v.z=T.MathUtils.lerp(v.z,move.z*speed,blend);v.y-=18*DT;
 const before=p.clone();p.addScaledVector(v,DT);
 // Only the core is constrained by broad district boundaries; open gates are generous.
 p.x=T.MathUtils.clamp(p.x,-24,regions[stage].exit-1);p.z=T.MathUtils.clamp(p.z,-areaWidth(p.x),areaWidth(p.x));
 const floor=terrain(p.x,p.z),oldFloor=terrain(before.x,before.z);
 if(floor>oldFloor+.18&&p.y-CORE<floor-.15){p.x=before.x;p.z=before.z;}
 const travel=tmp.set(p.x-before.x,0,p.z-before.z).length();
 if(travel>1e-6){const axis=new T.Vector3(p.z-before.z,0,-(p.x-before.x)).normalize();rolling.quaternion.premultiply(new T.Quaternion().setFromAxisAngle(axis,travel/Math.max(.32,pile.rollRadius)));}
 const proxies=pile.worldProxies();const ground=support(proxies);if(p.y<ground){p.y=ground;v.y=0;}
 const hits=obstacleCollision(proxies,move);
 // Detect an input that makes almost no progress; a modest hop/turn releases caught edges.
 const actual=Math.hypot(p.x-before.x,p.z-before.z);stuck=move.lengthSq()>.2&&(actual<speed*DT*.15||hits>2)?stuck+DT:Math.max(0,stuck-DT*2);
 if(settings.autoHelp&&stuck>.8){nudge(true);stuck=.2;}
 cooldown=Math.max(0,cooldown-DT);nudgeCooldown=Math.max(0,nudgeCooldown-DT);elapsed+=DT;stepNumber++;saveTimer+=DT;
 let nearest=null,nearestDist=Infinity;
 for(const item of objects){
   if(item.collected)continue;item.cool=Math.max(0,item.cool-DT);
   if(item.vel.lengthSq()>.001){item.vel.y-=18*DT;item.pos.addScaledVector(item.vel,DT);const surface=terrain(item.pos.x,item.pos.z)-item.geometryInfo.center.y+item.geometryInfo.size.y/2;if(item.pos.y<surface){item.pos.y=surface;item.vel.y=0;}item.vel.x*=Math.exp(-3*DT);item.vel.z*=Math.exp(-3*DT);item.pos.x=T.MathUtils.clamp(item.pos.x,-23,WORLD_END-5);item.pos.z=T.MathUtils.clamp(item.pos.z,-areaWidth(item.pos.x)+1,areaWidth(item.pos.x)-1);}
   if(item.region>stage){item.mesh.position.copy(item.pos);continue;}
   item.mesh.position.copy(item.pos);const centerDistance=item.pos.distanceTo(p);if(centerDistance>pile.extent+item.bound+8){continue;}
   // Pickups contact the nearest attached object, not an invisible growing sphere.
   let gap=Infinity,contact=null;
   for(const c of proxies){const delta=new T.Vector3(p.x+c.center.x,p.y+c.center.y,p.z+c.center.z).sub(item.pos);const g=delta.length()-c.r-item.bound*.55;if(g<gap){gap=g;contact=delta;}}
   if(gap<nearestDist){nearestDist=gap;nearest=item;}
   const eligible=power+.00001>=item.need;
   if(eligible&&item.cool<=0){
     if(gap<.17){collect(item);if(state!=='play')break;continue;}
     else if(gap<(attract?2+Math.min(power,5):.22)&&item.kind!=='bench')item.pos.addScaledVector(contact,Math.min(.5,DT*(attract?6:3)));
   }else if(!eligible&&gap<-.1&&item.kind!=='bench'){
     const away=p.clone().sub(item.pos);away.y=0;if(away.lengthSq()>.001){away.normalize();p.addScaledVector(away,Math.min(.04,-gap*.1));}
   }
   item.mesh.position.copy(item.pos);
 }
 if(nearest&&nearestDist<4)compass.textContent=power>=nearest.need?nearest.label+' · ready to collect':nearest.label+' · gather more metal first';else compass.textContent=regions[stage].hint;
 if(saveTimer>20){save();saveTimer=0;}
 physicsMs=performance.now()-begin;
}
function panel(){
 $('overlay').hidden=state==='play';if(state==='play')return;
 const result=state==='result',paused=state==='paused';
 $('card').innerHTML='<div class="eyebrow">MAGNET / EIGHT DISTRICTS. ONE TINY CORE.</div><h1>'+(result?'That escalated<br>beautifully.':paused?'Hold that<br>thought.':'Small core.<br>Huge mess.')+'</h1><p>'+(result?'From the workbench to the launchpad. '+pile.parts.length+' objects, all built around the same little magnet.':paused?'Your pile is saved locally. Keep rolling whenever you’re ready.':'Make a lopsided rolling pile of real objects. Start in the workshop, spill into the yard, and take the city piece by piece.')+'</p><button id="go">'+(result?'Keep exploring':paused?'Keep rolling':'Start a new pile')+'</button>'+(!paused&&!result&&saveData?'<button id="continue">Continue saved pile</button>':'')+'<p class="fine">WASD roll · Space attract · F nudge · Shift shed<br>Eight milestones, no time pressure. Backspace gets you unstuck.</p>';
 $('go').onclick=()=>{if(paused||result){state='play';keys.clear();panel();}else reset();};if($('continue'))$('continue').onclick=restore;
}
function pause(){if(state==='play'){state='paused';keys.clear();fieldLatched=false;save();panel();}else if(state==='paused'){state='play';keys.clear();panel();}}
function updateHUD(){
 if($('travel')){for(const o of $('travel').options)if(o.value!=='')o.disabled=Number(o.value)>stage;}
 $('size').firstChild.textContent=(pile.extent*2<1?(pile.extent*200).toFixed(0)+' cm':(pile.extent*2).toFixed(1)+' m')+' pile';$('phase').textContent=(stage+1)+'/'+regions.length+' · '+regions[stage].name;
 const target=objects.find(o=>o.kind===regions[stage].goal),ready=power>=target.need;
 $('objective').textContent=goals.has(regions.at(-1).goal)?'The launch complex is yours':(ready?'Take the ':'Build up for the ')+target.label.toLowerCase();
 $('progress').textContent=pile.parts.length+' objects · core stays 64 cm · '+goals.size+'/'+regions.length+' milestones';$('bar').style.width=Math.min(100,power/target.need*100)+'%';
 $('collection').textContent=seen.size+' / '+Object.keys(defs).length+' kinds found';
 $('clearSave').textContent=autosaveEnabled?'Clear saved run':'Save current run';
 if(!$('catalog').hidden)$('catalog').innerHTML=Object.entries(defs).map(([kind,d])=>'<div class="'+(seen.has(kind)?'found':'missing')+'">'+(seen.has(kind)?'✓ ':power>=d.need?'○ ':'· ')+d.label+'</div>').join('');
 const map=$('map').getContext('2d');map.clearRect(0,0,260,92);map.fillStyle='#203e36';map.fillRect(0,0,260,92);const widths=[15,20,27,32,34,38,42,52],colors=['#bba76d','#9da86f','#849a9b','#aaa39b','#a7957d','#76a7b1','#9cabb5','#9d8fa5'];let x=0;for(let i=0;i<regions.length;i++){map.fillStyle=colors[i];map.globalAlpha=i<=stage?.65:.2;map.fillRect(x+2,15,widths[i]-4,58);x+=widths[i];}map.globalAlpha=1;map.fillStyle='#fbe7a9';map.font='8px Arial';map.fillText('WK YD ST  CITY RAIL DOCK AIR   ORBIT',3,10);const mapX=wx=>{const edges=[-25,25,94,211,410,650,1020,1530,WORLD_END];let i=0,offset=0;while(i<7&&wx>edges[i+1])offset+=widths[i++];return offset+T.MathUtils.clamp((wx-edges[i])/(edges[i+1]-edges[i]),0,1)*widths[i];};const mx=mapX(p.x),mz=44+p.z/245*30;map.beginPath();map.arc(mx,mz,3.4,0,Math.PI*2);map.fill();map.strokeStyle='#fff9d2';map.beginPath();map.arc(mapX(target.pos.x),44+target.pos.z/245*30,5,0,Math.PI*2);map.stroke();
}
function render(delta){
 CrushWorkshop.update(delta);FieldNotes.update();
 const begin=performance.now();root.position.copy(p);
 const target=p.clone().add(new T.Vector3(0,Math.min(3,pile.rollRadius*.25),0)),distance=5.5+pile.extent*2.4;
 if(settings.reduced)target.y=terrain(p.x,p.z)+pile.rollRadius+Math.min(3,pile.rollRadius*.25);
 const desired=target.clone().add(new T.Vector3(Math.sin(yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance));
 // Keep the camera above near scenery instead of looking through a wall.
 for(const o of obstacles){if(Math.abs(desired.x-o.x)<o.w/2+1&&Math.abs(desired.z-o.z)<o.d/2+1)desired.y=Math.max(desired.y,o.top+2);}
 camera.position.lerp(desired,delta===0?1:1-Math.exp(-(settings.reduced?3:5)*delta));camera.lookAt(target);
 for(const entry of districtGates){entry.gate.visible=stage<=entry.index;entry.caption.visible=stage<=entry.index;}
 field.position.set(p.x,terrain(p.x,p.z)+.03,p.z);field.scale.setScalar(pile.rollRadius+((settings.fieldToggle?fieldLatched:keys.has('Space'))?2+Math.min(power,5):.25));field.visible=state==='play'&&!settings.reduced;
 const objective=objects.find(o=>o.kind===regions[stage].goal);const dir=objective.pos.clone().sub(p);dir.y=0;arrow.visible=state==='play'&&!goals.has(regions.at(-1).goal);arrow.position.copy(p).add(new T.Vector3(0,pile.extent+1,0));if(dir.lengthSq()>0)arrow.setDirection(dir.normalize());arrow.setLength(Math.min(5,1.4+power*.5),.5,.28);
 sun.position.set(p.x-20,p.y+40,p.z+16);sun.target.position.copy(p);sun.target.updateMatrixWorld();const span=Math.max(26,pile.extent*3);Object.assign(sun.shadow.camera,{left:-span,right:span,top:span,bottom:-span,far:Math.max(100,pile.extent*4+70)});sun.shadow.camera.updateProjectionMatrix();
 toastTimer=Math.max(0,toastTimer-delta);$('toast').style.opacity=toastTimer>0?1:0;updateHUD();
 pickupFlash=Math.max(0,pickupFlash-delta);core.material.emissive.setHex(pickupFlash>0&&!settings.reduced?0x665015:0);
 WorldArt.update(delta,settings.reduced);GraphicsPass.render();frameMs=performance.now()-begin;
 $('debug').textContent=VERSION+'\ncore radius '+core.scale.x+' (fixed)\nparts '+pile.parts.length+'/'+objects.length+' / proxies '+pile.proxies.length+'\nspan '+(pile.extent*2).toFixed(2)+' / power '+power.toFixed(2)+'\nphysics '+physicsMs.toFixed(2)+' ms / render '+frameMs.toFixed(2)+' ms\nnudges '+nudges+' / recoveries '+rescues+'\n'+p.toArray().map(n=>n.toFixed(2)).join(', ');
}
function frame(now){const delta=Math.min(.067,(now-last)/1000||0);last=now;if(state==='play'){acc+=delta;let count=0;while(acc>=DT&&count++<8){step();acc-=DT;}if(count>8)acc=0;}render(delta);requestAnimationFrame(frame);}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setPixelRatio(settings.quality==='low'?1:Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=settings.quality!=='low';renderer.setSize(innerWidth,innerHeight);}
document.addEventListener('keydown',e=>{
 if(e.target.matches('input,select,button')&&!['Escape','KeyR'].includes(e.code))return;
 if(['Space','Backspace','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.repeat)return;
 if(e.code==='Enter'&&state!=='play'){state==='start'?reset():(state='play',panel());return;}
 if(e.code==='Escape'){pause();return;}if(e.code==='KeyR'){reset();return;}if(e.code==='KeyF'){nudge();return;}if(e.code==='Backspace'){recover();return;}
 if(e.code.startsWith('Shift')){repel();return;}if(e.code==='F3'){e.preventDefault();$('debug').style.display=$('debug').style.display==='block'?'none':'block';return;}
 if(e.code==='Space'&&settings.fieldToggle)fieldLatched=!fieldLatched;keys.add(e.code);
});document.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>{if(state==='play')pause();keys.clear();fieldLatched=false;});document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')pause();});window.addEventListener('resize',resize);
let drag=false;$('world').addEventListener('pointerdown',e=>{drag=true;$('world').setPointerCapture(e.pointerId);});$('world').addEventListener('pointerup',()=>drag=false);$('world').addEventListener('pointermove',e=>{if(drag){yaw-=e.movementX*.005;pitch=T.MathUtils.clamp(pitch+e.movementY*.004*(settings.invert?-1:1),.3,1.25);}});
$('pause').onclick=()=>{pause();$('pause').blur();};$('restart').onclick=()=>{reset();$('restart').blur();};$('sound').onclick=()=>{settings.sound=!settings.sound;settingsChanged();$('sound').blur();};
function settingsChanged(){try{localStorage.setItem(OPTIONS,JSON.stringify(settings));}catch{storageOK=false;}$('sound').textContent=settings.sound?'Sound on':'Sound off';resize();}
const extra=document.createElement('div');extra.id='options';extra.innerHTML='<button id="collection"></button> <button id="optionsToggle">Options</button><button id="inspectModels">Object gallery</button><div id="catalog" hidden></div><div id="optionsPanel" hidden><label><input id="reduced" type="checkbox"> Reduced motion</label><label><input id="autoHelp" type="checkbox"> Gentle unsticking</label><label><input id="fieldToggle" type="checkbox"> Toggle attraction</label><label>Graphics <select id="quality"><option value="high">High</option><option value="low">Low</option></select></label><label>Travel <select id="travel"><option value="">Choose an unlocked district</option></select></label><button id="rescue">Recover pile</button><button id="clearSave">Clear saved run</button></div>';document.body.appendChild(extra);
$('inspectModels').onclick=()=>{if(state==='play')pause();location.href='showroom.html';};
$('travel').innerHTML+=[...regions].map((r,i)=>'<option value="'+i+'">'+r.name+'</option>').join('');$('travel').onchange=()=>{if($('travel').value!=='')travelTo(Number($('travel').value));$('travel').value='';$('travel').blur();};
$('collection').onclick=()=>{$('catalog').hidden=!$('catalog').hidden;$('collection').blur();};
const minimap=document.createElement('canvas');minimap.id='map';minimap.width=260;minimap.height=92;minimap.setAttribute('aria-label','District map: dot is your pile, ring is the next milestone.');document.body.appendChild(minimap);
minimap.title='Click an unlocked district to travel with your pile';minimap.style.cursor='pointer';minimap.onclick=e=>{const rect=minimap.getBoundingClientRect(),x=(e.clientX-rect.left)/rect.width*260;let edge=0;for(const [i,width] of [18,24,34,40,43,48,53].entries()){edge+=width;if(x<edge){if(!travelTo(i))message('Collect the current milestone to open that district.');break;}}};
$('optionsToggle').onclick=()=>{$('optionsPanel').hidden=!$('optionsPanel').hidden;$('optionsToggle').blur();};
for(const name of ['reduced','autoHelp','fieldToggle','quality']){const el=$(name);if(name==='quality')el.value=settings[name];else el.checked=settings[name];el.onchange=()=>{settings[name]=name==='quality'?el.value:el.checked;fieldLatched=false;settingsChanged();el.blur();};}
$('rescue').onclick=()=>{recover();$('rescue').blur();};
$('clearSave').onclick=()=>{
 if(autosaveEnabled){autosaveEnabled=false;try{localStorage.removeItem(SAVE);}catch{}saveData=null;message('Saved run cleared. Autosave off for this run.');}
 else{autosaveEnabled=true;save();message('Pile saved. Autosave back on.');}
 $('clearSave').textContent=autosaveEnabled?'Clear saved run':'Save current run';$('clearSave').blur();
};
window.Magnet3D={reset,step,repel,nudge,recover,pause,save,restore,draw:render,snapshot:()=>({version:VERSION,state,coreRadius:core.scale.x,power,radius:pile.extent,rollRadius:pile.rollRadius,mass:pile.mass,count:pile.parts.length,total:objects.length,elapsed,stage,goals:[...goals],position:p.toArray(),velocity:v.toArray(),nudges,rescues,frameMs,physicsMs}),get objects(){return objects;},get pile(){return pile;},get position(){return p;},get camera(){return camera;},get renderer(){return renderer;}};
FieldNotes.install();reset(false);settingsChanged();requestAnimationFrame(frame);
