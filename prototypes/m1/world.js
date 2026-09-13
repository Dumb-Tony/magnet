/* Magnet growth-3d-1. Procedural models; locally bundled Three.js. */
'use strict';
const $=id=>document.getElementById(id), T=THREE, VERSION='magnet-districts-1', DT=1/120;
const scene=new T.Scene();scene.background=new T.Color('#b8cbc3');scene.fog=new T.Fog('#b8cbc3',100,520);
let renderer;
try{renderer=new T.WebGLRenderer({canvas:$('world'),antialias:true});}catch(e){$('card').innerHTML='<h1>3D unavailable</h1><p>This prototype needs a browser with WebGL enabled.</p>';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
const camera=new T.PerspectiveCamera(52,innerWidth/innerHeight,.05,700);
scene.add(new T.HemisphereLight(0xe9f5df,0x576c69,2.4));
const sun=new T.DirectionalLight(0xffe0a2,3.2);sun.position.set(-12,25,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-28,right:28,top:28,bottom:-28,near:1,far:70});sun.shadow.bias=-.0003;sun.shadow.normalBias=.025;scene.add(sun);
function mat(color,metal=.1){return ScrapSurfaces.material(color,metal);}
const palette={steel:'#9caeb4',dark:'#354b53',gold:'#f0be4e',red:'#c9694f',green:'#4d8078',wood:'#b29164',cream:'#ece0b7'};
const boxGeo=new T.BoxGeometry(1,1,1),cylGeo=new T.CylinderGeometry(1,1,1,12),sphereGeo=new T.SphereGeometry(1,24,16),ringGeo=new T.TorusGeometry(1,.23,8,16);
function mesh(geo,color,pos,scale,parent,metal=.1){const repeat=scale.map(v=>Math.max(1,Math.round(Math.abs(v)/3)));const material=ScrapSurfaces.material(color,metal,undefined,[repeat[0],scale[1]<.5?repeat[2]:repeat[1]]);const m=new T.Mesh(geo,material);m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(parent,color,x,y,z,w,h,d,metal=.1){return mesh(boxGeo,color,[x,y,z],[w,h,d],parent,metal)}
function cylinder(parent,color,x,y,z,r,h,metal=.6){return mesh(cylGeo,color,[x,y,z],[r,h,r],parent,metal)}

const defs={
  bolt:{need:0,mass:.45,label:'BOLT'},can:{need:.48,mass:1.4,label:'PAINT CAN'},tool:{need:.64,mass:3,label:'WRENCH'},pipe:{need:.72,mass:5,label:'LONG PIPE'},wheel:{need:.85,mass:6,label:'WHEEL'},stool:{need:1.05,mass:10,label:'STOOL'},locker:{need:1.35,mass:20,label:'LOCKER'},bench:{need:1.8,mass:180,label:'WORKBENCH'},
  barrel:{need:1.1,mass:18,label:'OIL DRUM'},cart:{need:1.6,mass:38,label:'HANDCART'},bike:{need:1.8,mass:50,label:'BICYCLE'},skip:{need:2.25,mass:110,label:'SCRAP SKIP'},forklift:{need:3,mass:360,label:'FORKLIFT'},
  hydrant:{need:1.5,mass:35,label:'HYDRANT'},sign:{need:2,mass:70,label:'STREET SIGN'},car:{need:2.6,mass:170,label:'PARKED CAR'},van:{need:3.25,mass:290,label:'DELIVERY VAN'},bus:{need:4.6,mass:950,label:'CITY BUS'},
  kiosk:{need:3.4,mass:330,label:'NEWS KIOSK'},truck:{need:4.2,mass:650,label:'BOX TRUCK'},container:{need:4.8,mass:900,label:'SHIPPING CONTAINER'},tower:{need:5.6,mass:1400,label:'WATER TOWER'},tram:{need:6.8,mass:2600,label:'CITY TRAM'},sculpture:{need:8,mass:4000,label:'SKYLINE SPIRE'}
};
const environment=new T.Group();scene.add(environment);const obstacles=[];const landmarkSigns=[];
const districtGates=[];
function solid(x,y,z,w,h,d,color){const m=box(environment,color,x,y,z,w,h,d);obstacles.push({x,z,y:y-h/2,top:y+h/2,w,d,mesh:m});return m;}
function label(text,x,y,z,width=5){const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='#23413c';ctx.fillRect(0,0,512,96);ctx.fillStyle='#fff2bf';ctx.font='bold 36px Arial';ctx.textAlign='center';ctx.fillText(text,256,62);const m=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(canvas),depthWrite:false}));m.scale.set(width,width*.1875,1);m.position.set(x,y,z);scene.add(m);landmarkSigns.push(m);return m;}
function district(x,w,d,color){box(environment,color,x,-.2,0,w,.4,d);}
district(0,50,44,'#8da29a');district(59,70,72,'#b19f7c');district(151,116,94,'#6b8286');district(309,204,172,'#8b9a97');
for(let x=-24;x<410;x+=6){box(environment,'#e7d3a1',x,.008,0,2,.015,.18);}
for(let x=-24;x<24;x+=4){box(environment,'#779086',x,.009,0,.02,.02,42);}for(let z=-20;z<=20;z+=4)box(environment,'#779086',0,.009,z,48,.02,.02);
solid(0,3.2,-22,50,6.4,.5,'#77968d');solid(-25,3.2,0,.5,6.4,44,'#829c92');
for(let x=-20;x<=20;x+=10){box(environment,'#d7e5c7',x,4.3,-21.7,6,3,.05);box(environment,'#526f67',x,4.3,-21.65,.1,3,.05);}
// Deeper workshop: shelves, a wide aisle and a narrower optional shortcut.
solid(-12,1,-8,3,2,8,'#5a8277');solid(-12,1,7,3,2,8,'#5a8277');solid(11,1,-11,9,2,2,'#668579');
for(let x of [-12,11])label('METAL ONLY',x,3,-10,3);
const rampGeo=new T.BufferGeometry();rampGeo.setAttribute('position',new T.Float32BufferAttribute([5,2,-2,5,2,2,13,0,2,5,2,-2,13,0,2,13,0,-2],3));rampGeo.computeVertexNormals();const rampMesh=new T.Mesh(rampGeo,mat('#c3aa71'));rampMesh.receiveShadow=true;scene.add(rampMesh);
for(let x=5.3;x<13;x+=.55)box(environment,'#9b845e',x,2-(x-5)/4+.02,0,.06,.04,4);
// Yard fences leave a generous central path; distant clutter is visibly nonmetal.
for(let x=28;x<89;x+=4)for(let z of [-34,34]){box(environment,'#706f55',x,1,z,.15,2,.15);box(environment,'#928873',x,1.5,z,4,.1,.1);}
for(let i=0;i<6;i++)solid(35+i*8,1.2,29,3,2.4,3,'#9b815c');
// Street sidewalks and a city plaza, with noncollectible masonry façades outside the route.
for(let z of [-35,35])box(environment,'#b5bdb0',151,.08,z,116,.16,10);
for(let x=105;x<205;x+=22)for(let z of [-45,45])solid(x,6+(x%3),z,14,12+(x%3)*2,6,'#b6ad91');
for(let x=225;x<410;x+=30)for(let z of [-76,76]){const h=18+(x%7)*3;solid(x,h/2,z,18,h,14,x%2?'#a4b3ad':'#bdaf93');for(let y=3;y<h;y+=4)box(environment,'#719293',x,y,z-Math.sign(z)*7.05,14,1.6,.06);}
for(let x=220;x<400;x+=20)for(let z of [-45,45]){cylinder(environment,palette.dark,x,3,z,.15,6);box(environment,palette.cream,x,6,z,1,.2,1);}
label('01 / THE WORKSHOP',0,6,-17,8);label('02 / SALVAGE YARD',57,6,-29,10);label('03 / MAIN STREET',147,9,-32,13);label('04 / CITY PLAZA',302,15,-54,22);
label('RAMP →',8,3,-3,3);label('WIDE AISLE →',-5,2.5,13,4);
for(const [index,x,width] of [[0,24,42],[1,93,68],[2,210,86]]){
 const gate=new T.Group();scene.add(gate);gate.position.x=x;
 for(let z=-width/2;z<=width/2;z+=4){box(gate,palette.gold,0,1.4,z,.2,.22,3.6);box(gate,palette.dark,0,.7,z,.22,1.4,.16);}
 const caption=label(['WORKBENCH → YARD','FORKLIFT → STREET','BUS → CITY'][index],x,4,0,8);
 districtGates.push({gate,caption,index});
}

for(let region=1;region<=3;region++)label('REBUILD CORNER',[0,34,104,222][region],3,[0,-28,-33,-58][region],5);
function makeLayout(add){
  add('bench',0,1.875,0,0,{goal:true});
  for(let i=0;i<32;i++)add('bolt',-3.8+(i%8)*.95,2.14,-2+Math.floor(i/8)*1.2,0);
  for(let i=0;i<8;i++)add('can',1.3+(i%4)*.85,2.22,-1.6+Math.floor(i/4)*2.7,0);
  for(let i=0;i<4;i++)add('tool',3.8,2.1,-1.8+i,0);
  for(let i=0;i<20;i++){let a=i*2.399;add('bolt',11+Math.cos(a)*6,.14,Math.sin(a)*9,0);}
  for(let i=0;i<20;i++){let a=i*2.399;add('can',Math.cos(a)*17,.22,Math.sin(a)*14,0);}
  for(let i=0;i<15;i++){let a=i*2.399+.7;add('tool',Math.cos(a)*19,.12,Math.sin(a)*16,0);}
  for(let i=0;i<8;i++)add('pipe',-6+i*3,.16,17,0);
  for(let i=0;i<14;i++){let a=i*Math.PI/7;add('wheel',Math.cos(a)*20,.55,Math.sin(a)*17,0);}
  for(let i=0;i<10;i++){let a=i*Math.PI/5+.2;add('stool',Math.cos(a)*19,.65,Math.sin(a)*18,0);}
  for(let i=0;i<6;i++)add('locker',-18+i*7,.93,-16,0);
  // Larger districts include mixed tiers so growth never depends on one exact pickup.
  for(let i=0;i<26;i++)add('barrel',30+(i%7)*8,.65,-23+Math.floor(i/7)*14,1);
  for(let i=0;i<12;i++)add('cart',34+(i%6)*9,.4,-15+Math.floor(i/6)*30,1);
  for(let i=0;i<12;i++)add('bike',35+(i%6)*9,.45,-8+Math.floor(i/6)*18,1);
  for(let i=0;i<8;i++)add('skip',38+(i%4)*12,.75,-22+Math.floor(i/4)*44,1);
  add('forklift',80,.9,0,1,{goal:true});
  for(let i=0;i<16;i++)add('hydrant',100+i*6,.5,i%2?28:-28,2);
  for(let i=0;i<12;i++)add('sign',102+i*8,1.5,i%2?22:-22,2);
  for(let i=0;i<22;i++)add('car',102+(i%11)*9,1,-14+Math.floor(i/11)*28,2);
  for(let i=0;i<8;i++)add('van',112+(i%4)*23,1.2,-25+Math.floor(i/4)*50,2);
  add('bus',194,1.5,0,2,{goal:true});
  for(let i=0;i<16;i++)add('car',221+(i%8)*23,1,-48+Math.floor(i/8)*96,3);
  for(let i=0;i<14;i++)add('kiosk',225+(i%7)*24,1.5,-35+Math.floor(i/7)*70,3);
  for(let i=0;i<12;i++)add('truck',224+(i%6)*28,1.6,-17+Math.floor(i/6)*34,3);
  for(let i=0;i<10;i++)add('container',230+(i%5)*33,1.55,-52+Math.floor(i/5)*104,3);
  for(let i=0;i<6;i++)add('tower',235+i*28,3.6,i%2?58:-58,3);
  add('tram',340,1.5,4,3,{landmark:true});add('sculpture',391,10,0,3,{goal:true});
  // Off-route recovery corners let even a heavily shed core rebuild without a long walk home.
  for(let region=1;region<=3;region++){
    const cx=[0,30,100,218][region],cz=[0,-27,-32,-57][region];
    for(let i=0;i<24;i++)add('bolt',cx+(i%6)*.38,.14,cz+Math.floor(i/6)*.38,region);
    for(let i=0;i<8;i++)add('can',cx+3+(i%4)*.55,.22,cz+Math.floor(i/4)*.65,region);
    for(let i=0;i<6;i++)add('tool',cx+1+(i%3)*.7,.12,cz+3+Math.floor(i/3)*.7,region);
    for(let i=0;i<4;i++)add('wheel',cx+5+i*.8,.55,cz+3,region);
    for(let i=0;i<6;i++)add('barrel',cx+1+(i%3)*1.4,.65,cz+5+Math.floor(i/3)*1.6,region);
    for(let i=0;i<7;i++)add('cart',cx+7+(i%4)*1.6,.4,cz+5+Math.floor(i/4)*2,region);
    for(let i=0;i<3;i++)add('skip',cx+2+i*3,.75,cz+10,region);

  }
}
