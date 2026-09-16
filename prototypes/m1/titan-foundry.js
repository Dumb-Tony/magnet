/* Append-only ninth chapter. Keep all existing 1,116 IDs stable. */
'use strict';
Object.assign(defs,{
 transformer:{need:38,mass:95000,label:'POWER TRANSFORMER'},
 bulldozer:{need:40,mass:140000,label:'CRAWLER DOZER'},
 turbine:{need:43,mass:260000,label:'TURBINE GENERATOR'},
 ladle:{need:47,mass:420000,label:'MOLTEN METAL LADLE'},
 blastfurnace:{need:52,mass:1600000,label:'TITAN BLAST FURNACE'}
});
WORLD_END=2820;camera.far=4400;camera.updateProjectionMatrix();scene.fog.far=3000;
district(2470,700,610,'#465150');box(environment,'#303a3d',2470,.015,0,692,.025,596);
// Furnace halls, ore bunkers, pipe bridges and glowing slag channels establish a new scale.
for(let x=2180;x<2760;x+=145){solid(x,22,-305,104,44,24,x%290?'#6e7773':'#7d6d61');box(environment,palette.dark,x,15,-292.8,82,29,.15);label('BAY '+Math.round((x-2035)/145),x,34,-292,28);}
for(let x=2170;x<2780;x+=54){box(environment,'#b7b2a0',x,.05,0,31,.03,.55);for(let z of [-236,236]){cylinder(environment,palette.dark,x,3,z,.8,6);box(environment,palette.gold,x,6,z,1.9,.18,1.9);}}
for(let x=2240;x<2760;x+=155)for(let z of [-116,116]){cylinder(environment,'#6f4a36',x,8,z,5.5,16);for(let y=1;y<16;y+=2.2){const m=new T.Mesh(new T.TorusGeometry(5.56,.1,6,28),mat('#a7a59b',.7));m.rotation.x=Math.PI/2;m.position.set(x,y,z);m.castShadow=true;environment.add(m);}}
for(let z of [-62,62]){box(environment,'#2b3438',2470,.055,z,675,.07,19);box(environment,'#d46f35',2470,.095,z,660,.035,8);for(let x=2150;x<2790;x+=18)box(environment,'#f0aa49',x,.13,z,7,.025,2.4,.7);}
for(let x=2200;x<2780;x+=92){box(environment,'#596568',x,18,0,8,2,285);for(let z of [-136,-102,102,136])cylinder(environment,palette.dark,x,9,z,.46,18);for(let z=-126;z<127;z+=18){rodFoundry([x-3.7,17,z],[x+3.7,19,z+9]);rodFoundry([x+3.7,17,z],[x-3.7,19,z+9]);}}
function rodFoundry(a,b){const d=new T.Vector3(...b).sub(new T.Vector3(...a)),m=cylinder(environment,palette.gold,0,0,0,.09,d.length());m.position.fromArray(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m;}
for(const [x,z,h] of [[2210,245,48],[2390,255,66],[2590,248,54],[2740,252,72]]){cylinder(environment,'#4a5050',x,h/2,z,4.5,h);for(let y=6;y<h;y+=7){const m=new T.Mesh(new T.TorusGeometry(4.56,.12,6,28),mat('#b76b3f',.6));m.rotation.x=Math.PI/2;m.position.set(x,y,z);environment.add(m);}box(environment,palette.cream,x,h+2,z,10,.5,10);}
for(let x=2160;x<2790;x+=70)for(let z of [-270,270]){box(environment,palette.gold,x,.08,z,42,.035,.65);box(environment,palette.gold,x-21,.08,z,.65,.035,18);}
label('09 / TITAN FOUNDRY',2460,35,-264,42);label('REBUILD CORNER',2142,8,-228,14);
const foundryGate=new T.Group();scene.add(foundryGate);foundryGate.position.x=2119;
for(let z=-230;z<=230;z+=12){box(foundryGate,palette.gold,0,2,z,.34,.32,11.4);box(foundryGate,palette.dark,0,1,z,.3,2,.3);}
districtGates.push({gate:foundryGate,caption:label('ROCKET → TITAN FOUNDRY',2119,9,0,25),index:7});
const launchLayout=makeLayout;
makeLayout=function(add){launchLayout(add);
 for(let i=0;i<24;i++)add('transformer',2160+(i%8)*78,null,-170+Math.floor(i/8)*170,8);
 for(let i=0;i<18;i++)add('bulldozer',2180+(i%9)*67,null,-104+Math.floor(i/9)*208,8);
 for(let i=0;i<14;i++)add('turbine',2200+(i%7)*91,null,-48+Math.floor(i/7)*96,8);
 for(let i=0;i<12;i++)add('ladle',2240+(i%6)*102,null,-205+Math.floor(i/6)*410,8);
 add('blastfurnace',2765,null,0,8,{goal:true});
 for(let i=0;i<42;i++)add('bolt',2135+(i%7)*.45,.14,-228+Math.floor(i/7)*.45,8);
 for(let i=0;i<20;i++)add('can',2139+(i%5)*.68,.22,-224+Math.floor(i/5)*.68,8);
 for(let i=0;i<16;i++)add('toolbox',2135+(i%4)*1.25,null,-217+Math.floor(i/4)*1.3,8);
 for(let i=0;i<16;i++)add('barrel',2135+(i%4)*1.55,.65,-209+Math.floor(i/4)*1.55,8);
 for(let i=0;i<10;i++)add('container',2142+(i%5)*8,null,-194+Math.floor(i/5)*10,8);
 for(let i=0;i<8;i++)add('launchtruck',2175+(i%4)*19,null,-220+Math.floor(i/4)*22,8);
};
