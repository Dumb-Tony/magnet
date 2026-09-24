/* Append-only endgame escalation. Keep the first 1,770 object IDs stable. */
'use strict';
Object.assign(defs,{
 crawlerdock:{need:150,mass:12000000,label:'SHIPYARD CRAWLER'},oilrig:{need:170,mass:18000000,label:'OFFSHORE OIL RIG'},suspensionbridge:{need:190,mass:30000000,label:'SUSPENSION BRIDGE'},supercarrier:{need:215,mass:90000000,label:'LEVIATHAN SUPERCARRIER'},
 maglevcar:{need:215,mass:20000000,label:'ORBITAL MAGLEV'},solararray:{need:240,mass:35000000,label:'SOLAR ARRAY WING'},orbithabitat:{need:270,mass:60000000,label:'ORBITAL HABITAT'},orbitalring:{need:300,mass:180000000,label:'ORBITAL RING SEGMENT'},
 arcology:{need:300,mass:80000000,label:'ARCOLOGY'},fusioncore:{need:340,mass:120000000,label:'FUSION REACTOR'},skyhook:{need:380,mass:200000000,label:'SKYHOOK'},worldengine:{need:430,mass:600000000,label:'WORLD ENGINE'}
});
WORLD_END=8350;camera.far=11000;camera.updateProjectionMatrix();scene.fog.far=9000;
function megaRing(color,x,y,z,r,t=.2,axis='y'){const m=new T.Mesh(new T.TorusGeometry(r,t,8,36),mat(color,.55));m.position.set(x,y,z);if(axis==='y')m.rotation.x=Math.PI/2;else if(axis==='x')m.rotation.y=Math.PI/2;m.castShadow=m.receiveShadow=true;environment.add(m);return m;}
// 13 / LEVIATHAN COAST
district(5740,1080,1040,'#41555a');box(environment,'#33474b',5740,.015,0,1070,.025,1020);
for(const side of [-1,1]){box(environment,'#285866',5740,-.12,side*430,1060,.14,175);for(let x=5230;x<6260;x+=34)box(environment,'#7fa8aa',x,.03,side*(385+(x%5)*8),30,.012,.8);}
for(let x=5290;x<6220;x+=150)for(let side of [-1,1]){const z=side*285;for(let y=0;y<55;y+=7){beyondRod([x-8,y,z-8],[x+8,y+7,z+8],.25,'#b99045');beyondRod([x+8,y,z-8],[x-8,y+7,z+8],.25,'#b99045');}beyondRod([x,55,z],[x+70,78,z],.55,'#d6ad47');beyondRod([x+70,78,z],[x+85,35,z],.35,'#d6ad47');}
for(let x=5280;x<6250;x+=96){box(environment,'#6e7775',x,4,-145,72,8,32);box(environment,'#9e5d42',x,8,-145,68,.6,28);for(let z=-158;z<-130;z+=7)box(environment,palette.dark,x,8.5,z,54,.4,1);}
for(const [x,z,r] of [[5350,90,24],[5570,-72,32],[5900,80,27],[6160,-88,36]]){cylinder(environment,'#7a4d3c',x,r*.35,z,r,r*.7);megaRing('#b57b50',x,r*.7,z,r+.2,.5,'y');}
label('13 / LEVIATHAN COAST',5730,70,-475,60);label('THE OCEAN IS SCRAP',5735,9,-330,34);newGate(5199,395,'APEX → LEVIATHAN COAST',11);
// 14 / ORBITAL RINGWORKS
district(6850,1140,1160,'#3e4153');box(environment,'#292d3e',6850,.015,0,1130,.025,1140);
for(let x=6320;x<7380;x+=75){box(environment,x%150?'#4f5570':'#70627b',x,.05,0,52,.025,920);box(environment,'#d7bd64',x,.09,-95,38,.03,1);box(environment,'#d7bd64',x,.09,95,38,.03,1);}
for(let side of [-1,1])for(let x=6380;x<7330;x+=165){const z=side*360;cylinder(environment,'#5c6673',x,25,z,4,50);megaRing('#d0c39e',x,50,z,18,1.2,'y');for(let a=0;a<Math.PI*2;a+=Math.PI/8)beyondRod([x,50,z],[x+Math.sin(a)*18,50,z+Math.cos(a)*18],.18,'#c8b065');}
for(const side of [-1,1])for(let x=6360;x<7360;x+=115){box(environment,'#334f70',x,8,side*235,92,.6,54);for(let q=-35;q<=35;q+=14)for(let z=-18;z<=18;z+=12)box(environment,'#6590a4',x+q,8.4,side*235+z,11,.04,8);}
for(let x=6450;x<7300;x+=210){cylinder(environment,'#696b78',x,28,0,18,56);megaRing('#d8bc66',x,20,0,20,.6,'y');megaRing('#d8bc66',x,40,0,20,.6,'y');}
label('14 / ORBITAL RINGWORKS',6840,84,-535,64);label('BUILDING A CIRCLE AROUND THE SKY',6840,9,-392,38);newGate(6279,445,'COAST → ORBITAL RINGWORKS',12);
// 15 / THE WORLD ENGINE
district(7840,1020,1280,'#4b3d48');box(environment,'#302d38',7840,.015,0,1010,.025,1260);
for(const side of [-1,1])for(let i=0;i<8;i++){const x=7420+i*118,z=side*(380+(i%2)*90),h=90+i*18;box(environment,i%2?'#504d63':'#61505a',x,h/2,z,76,h,100,.5);for(let y=12;y<h;y+=14)megaRing('#c59f58',x,y,z,39,.25,'y');cylinder(environment,'#6fa0a5',x,h+18,z,10,36);}
for(let x=7440;x<8300;x+=130){for(let side of [-1,1]){beyondRod([x,0,side*220],[x,100,side*220],1.2,'#b59148');beyondRod([x,100,side*220],[x+65,125,0],.8,'#b59148');}megaRing('#788e91',x+65,125,0,28,2,'z');}
for(const [x,r,h] of [[7540,30,100],[7780,44,145],[8080,36,125]]){cylinder(environment,'#3d5960',x,h/2,0,r,h);for(let y=10;y<h;y+=12)megaRing('#d4af55',x,y,0,r+.4,.5,'y');const dome=new T.Mesh(new T.SphereGeometry(r*.9,24,12,0,Math.PI*2,0,Math.PI/2),mat('#6d9da2',.4));dome.position.set(x,h,0);environment.add(dome);}
label('15 / THE WORLD ENGINE',7835,115,-595,68);label('TAKE THE MACHINE THAT MOVES EVERYTHING',7835,10,-300,42);newGate(7419,485,'RINGWORKS → WORLD ENGINE',13);
const apexLayout=makeLayout;
function colossalRecovery(add,region,x,z,kinds){for(let i=0;i<30;i++)add('container',x+(i%10)*9,null,z+Math.floor(i/10)*12,region);for(let i=0;i<24;i++)add('transformer',x+(i%8)*13,null,z+45+Math.floor(i/8)*15,region);for(let i=0;i<18;i++)add(kinds[0],x+(i%9)*18,null,z+100+Math.floor(i/9)*22,region);for(let i=0;i<14;i++)add(kinds[1],x+(i%7)*24,null,z+150+Math.floor(i/7)*28,region);}
makeLayout=function(add){apexLayout(add);
 for(let i=0;i<18;i++)add('crawlerdock',5260+(i%9)*108,null,-245+Math.floor(i/9)*490,12);for(let i=0;i<14;i++)add('oilrig',5320+(i%7)*142,null,-150+Math.floor(i/7)*300,12);for(let i=0;i<10;i++)add('suspensionbridge',5400+(i%5)*185,null,-75+Math.floor(i/5)*150,12);add('supercarrier',6210,null,0,12,{goal:true});colossalRecovery(add,12,5225,-355,['haultruck','damcrane']);
 for(let i=0;i<18;i++)add('maglevcar',6340+(i%9)*112,null,-270+Math.floor(i/9)*540,13);for(let i=0;i<14;i++)add('solararray',6400+(i%7)*150,null,-165+Math.floor(i/7)*330,13);for(let i=0;i<10;i++)add('orbithabitat',6460+(i%5)*195,null,-80+Math.floor(i/5)*160,13);add('orbitalring',7340,null,0,13,{goal:true});colossalRecovery(add,13,6305,-400,['monorail','officeblock']);
 for(let i=0;i<18;i++)add('arcology',7470+(i%9)*92,null,-290+Math.floor(i/9)*580,14);for(let i=0;i<14;i++)add('fusioncore',7520+(i%7)*125,null,-175+Math.floor(i/7)*350,14);for(let i=0;i<10;i++)add('skyhook',7580+(i%5)*165,null,-88+Math.floor(i/5)*176,14);add('worldengine',8280,null,0,14,{goal:true});colossalRecovery(add,14,7440,-440,['towercrane','megaspire']);
};
