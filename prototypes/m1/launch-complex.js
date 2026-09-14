/* Append-only eighth chapter. Keep all existing 967 IDs stable. */
'use strict';
Object.assign(defs,{
 satellite:{need:26,mass:4200,label:'SATELLITE'},rover:{need:27.5,mass:9000,label:'LUNAR ROVER'},radar:{need:30,mass:24000,label:'RADAR DISH'},launchtruck:{need:33,mass:70000,label:'CRAWLER TRANSPORTER'},rocket:{need:37,mass:480000,label:'ORBITAL ROCKET'}
});
WORLD_END=2120;camera.far=3600;camera.updateProjectionMatrix();scene.fog.far=2250;
district(1825,590,500,'#8d9690');
for(let x=1580;x<2070;x+=120){solid(x,18,-258,78,36,18,'#a4aaa1');box(environment,palette.dark,x,11,-248.9,60,22,.12);label('ASSEMBLY '+Math.round((x-1460)/120),x,28,-248,25);}
for(let x=1580;x<2080;x+=50){box(environment,'#d7d2bd',x,.035,0,24,.025,.4);for(let z of [-190,190])cylinder(environment,palette.dark,x,.5,z,.45,1);}
label('08 / ORBITAL LAUNCH COMPLEX',1815,26,-220,42);
label('REBUILD CORNER',1548,7,-198,12);
const launchGate=new T.Group();scene.add(launchGate);launchGate.position.x=1529;for(let z=-185;z<=185;z+=11){box(launchGate,palette.gold,0,2,z,.32,.3,10.5);box(launchGate,palette.dark,0,1,z,.28,2,.28);}districtGates.push({gate:launchGate,caption:label('AIRLINER → LAUNCH COMPLEX',1529,8,0,24),index:6});
const airfieldLayout=makeLayout;
makeLayout=function(add){airfieldLayout(add);
 for(let i=0;i<20;i++)add('satellite',1560+(i%10)*46,null,-115+Math.floor(i/10)*230,7);
 for(let i=0;i<16;i++)add('rover',1570+(i%8)*64,null,-72+Math.floor(i/8)*144,7);
 for(let i=0;i<10;i++)add('radar',1590+i*52,null,i%2?155:-155,7);
 for(let i=0;i<8;i++)add('launchtruck',1605+(i%4)*116,null,-38+Math.floor(i/4)*76,7);
 add('rocket',2070,null,0,7,{goal:true});
 for(let i=0;i<36;i++)add('bolt',1542+(i%6)*.45,.14,-198+Math.floor(i/6)*.45,7);
 for(let i=0;i<16;i++)add('can',1545+(i%4)*.65,.22,-194+Math.floor(i/4)*.65,7);
 for(let i=0;i<12;i++)add('toolbox',1542+(i%4)*1.3,null,-188+Math.floor(i/4)*1.3,7);
 for(let i=0;i<12;i++)add('barrel',1542+(i%4)*1.5,.65,-181+Math.floor(i/4)*1.5,7);
 for(let i=0;i<10;i++)add('car',1545+(i%5)*5,null,-171+Math.floor(i/5)*6,7);
 for(let i=0;i<8;i++)add('fueltruck',1575+(i%4)*12,null,-187+Math.floor(i/4)*14,7);
};
