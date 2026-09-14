/* Append-only world expansion: original object IDs remain valid in existing saves. */
'use strict';
Object.assign(defs,{
 toolbox:{need:.8,mass:8,label:'TOOLBOX'},drill:{need:.7,mass:5,label:'POWER DRILL'},vending:{need:2,mass:85,label:'VENDING MACHINE'},trafficlight:{need:2.1,mass:100,label:'TRAFFIC LIGHT'},
 excavator:{need:7,mass:2200,label:'EXCAVATOR'},tankcar:{need:8.8,mass:4200,label:'TANK WAGON'},locomotive:{need:11,mass:12000,label:'LOCOMOTIVE'},tugboat:{need:11.5,mass:9000,label:'TUGBOAT'},crane:{need:13.5,mass:18000,label:'DOCK CRANE'},freighter:{need:18,mass:65000,label:'CARGO FREIGHTER'}
});
let WORLD_END=1020;
camera.far=1800;camera.updateProjectionMatrix();scene.fog.far=1050;
district(530,240,224,'#8b9a97');district(835,370,304,'#8da29a');
box(environment,'#397a89',850,-1.25,260,550,.3,200);box(environment,'#397a89',850,-1.25,-260,550,.3,200);
for(let x=415;x<1010;x+=9)box(environment,'#e7d3a1',x,.018,0,3,.025,.3);
// Low tracks provide visual lanes without creating invisible walls.
for(let z of [-65,65]){for(let x=422;x<640;x+=4){box(environment,palette.wood,x,.015,z,1,.06,5);}for(let offset of [-1.5,1.5])box(environment,palette.steel,530,.08,z+offset,225,.13,.13,.7);}
for(let x=435;x<640;x+=45){solid(x,6,-112,28,12,8,'#b6ad91');box(environment,palette.dark,x,2.4,-107.9,16,4.8,.1);label('RAIL / '+Math.round(x),x,8,-107,11);}
for(let x=680;x<1020;x+=30)for(let z of [-150,150]){cylinder(environment,palette.dark,x,.5,z,.5,1);box(environment,palette.gold,x,1,z,1.4,.2,1.4);}
for(let z of [-135,135])box(environment,palette.cream,835,.015,z,370,.03,.45);
label('05 / THE RAILWORKS',525,14,-94,24);label('06 / THE DRY DOCKS',805,18,-125,28);
label('REBUILD CORNER',425,4,-88,8);label('REBUILD CORNER',665,5,-116,10);
for(const [index,x,width,title] of [[3,409,146,'SKYLINE → RAILWORKS'],[4,649,220,'LOCOMOTIVE → DOCKS']]){
 const gate=new T.Group();scene.add(gate);gate.position.x=x;for(let z=-width/2;z<width/2;z+=8){box(gate,palette.gold,0,1.7,z,.25,.25,7.5);box(gate,palette.dark,0,.8,z,.3,1.6,.22);}districtGates.push({gate,caption:label(title,x,6,0,15),index});
}
const originalLayout=makeLayout;
makeLayout=function(add){
 originalLayout(add);
 // More discoveries in the original districts, appended to preserve saved IDs.
 for(let i=0;i<8;i++){add('toolbox',-17+i*4.5,null,12,0);add('drill',-16+i*4.5,null,-12,0);}
 for(let i=0;i<10;i++)add('vending',101+i*10,null,i%2?31:-31,2);
 for(let i=0;i<8;i++)add('trafficlight',110+i*12,null,i%2?29:-29,2);
 for(let i=0;i<18;i++)add('container',420+(i%9)*24,null,-48+Math.floor(i/9)*96,4);
 for(let i=0;i<12;i++)add('excavator',429+(i%6)*33,null,-80+Math.floor(i/6)*160,4);
 for(let i=0;i<12;i++)add('tankcar',434+(i%6)*33,null,-23+Math.floor(i/6)*46,4);
 add('locomotive',624,null,0,4,{goal:true});
 for(let i=0;i<20;i++)add('container',664+(i%10)*32,null,-92+Math.floor(i/10)*184,5);
 for(let i=0;i<12;i++)add('tankcar',670+(i%6)*49,null,-54+Math.floor(i/6)*108,5);
 for(let i=0;i<10;i++)add('tugboat',678+(i%5)*60,null,-112+Math.floor(i/5)*224,5);
 for(let i=0;i<8;i++)add('crane',695+(i%4)*74,null,-28+Math.floor(i/4)*56,5);
 add('freighter',978,null,0,5,{goal:true});
 for(let region of [4,5]){const x=region===4?418:658,z=region===4?-90:-118;
  for(let i=0;i<30;i++)add('bolt',x+i%6*.45,.14,z+Math.floor(i/6)*.45,region);
  for(let i=0;i<12;i++)add('can',x+4+i%4*.7,.22,z+Math.floor(i/4)*.7,region);
  for(let i=0;i<10;i++)add('toolbox',x+1+i%5*1.4,null,z+4+Math.floor(i/5)*1.4,region);
  for(let i=0;i<12;i++)add('barrel',x+1+i%4*1.5,.65,z+8+Math.floor(i/4)*1.5,region);
  for(let i=0;i<8;i++)add('skip',x+2+i%4*3,null,z+14+Math.floor(i/4)*3,region);
  for(let i=0;i<8;i++)add('car',x+2+i%4*5,null,z+22+Math.floor(i/4)*5,region);
  for(let i=0;i<6;i++)add('container',x+25+i%3*7,null,z+8+Math.floor(i/3)*10,region);
 }
};
