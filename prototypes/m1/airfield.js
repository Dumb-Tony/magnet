/* Append-only seventh chapter. Keep all existing 790 IDs stable. */
'use strict';
Object.assign(defs,{suitcase:{need:.8,mass:7,label:'SUITCASE'},baggagecart:{need:2,mass:75,label:'BAGGAGE CART'},fueltruck:{need:18,mass:8500,label:'AIRPORT FUEL TRUCK'},propplane:{need:20,mass:18000,label:'PROPELLER PLANE'},controltower:{need:23,mass:45000,label:'CONTROL TOWER'},airliner:{need:26,mass:140000,label:'AIRLINER'}});
WORLD_END=1530;camera.far=2800;camera.updateProjectionMatrix();scene.fog.far=1600;
district(1275,510,410,'#8b9a97');
for(let x=1080;x<1500;x+=120){solid(x,11,-212,55,22,16,'#a4b3ad');box(environment,palette.dark,x,7,-203.9,44,14,.1);label('HANGAR '+Math.round((x-960)/120),x,18,-203,24);}
label('07 / MERIDIAN AIRFIELD',1280,20,-175,35);
const airGate=new T.Group();scene.add(airGate);airGate.position.x=1019;for(let z=-140;z<=140;z+=10){box(airGate,palette.gold,0,2,z,.3,.3,9.5);box(airGate,palette.dark,0,1,z,.25,2,.25);}districtGates.push({gate:airGate,caption:label('FREIGHTER → AIRFIELD',1019,7,0,19),index:5});
const dockLayout=makeLayout;
makeLayout=function(add){dockLayout(add);
 for(let i=0;i<16;i++)add('fueltruck',1045+(i%8)*52,null,-70+Math.floor(i/8)*140,6);
 for(let i=0;i<12;i++)add('propplane',1070+(i%6)*69,null,-122+Math.floor(i/6)*244,6);
 for(let i=0;i<6;i++)add('controltower',1090+i*64,null,i%2?160:-160,6);
 for(let i=0;i<18;i++)add('container',1040+(i%9)*50,null,-33+Math.floor(i/9)*66,6);
 for(let i=0;i<16;i++)add('baggagecart',1040+i*26,null,i%2?48:-48,6);
 for(let i=0;i<30;i++)add('suitcase',1040+i%10*2,null,-92+Math.floor(i/10)*2,6);
 add('airliner',1486,null,0,6,{goal:true});
 for(let i=0;i<30;i++)add('bolt',1030+i%6*.4,.14,-168+Math.floor(i/6)*.4,6);
 for(let i=0;i<10;i++)add('can',1034+i%5*.6,.22,-168+Math.floor(i/5)*.7,6);
 for(let i=0;i<10;i++)add('toolbox',1030+i%5*1.2,null,-162+Math.floor(i/5)*1.3,6);
 for(let i=0;i<12;i++)add('barrel',1030+i%4*1.5,.65,-155+Math.floor(i/4)*1.5,6);
 for(let i=0;i<8;i++)add('skip',1030+i%4*3,null,-147+Math.floor(i/4)*3,6);
 for(let i=0;i<8;i++)add('car',1035+i%4*5,null,-137+Math.floor(i/4)*5,6);
};
