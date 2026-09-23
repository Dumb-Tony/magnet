/* Three append-only late-game chapters. Keep the first 1,297 object IDs stable. */
'use strict';
Object.assign(defs,{
 haultruck:{need:58,mass:250000,label:'ULTRA HAUL TRUCK'},drillrig:{need:65,mass:400000,label:'BLAST-HOLE DRILL'},rockcrusher:{need:72,mass:700000,label:'MOBILE ROCK CRUSHER'},bucketwheel:{need:80,mass:3000000,label:'BUCKET-WHEEL EXCAVATOR'},
 penstock:{need:80,mass:600000,label:'HYDRO PENSTOCK'},spillgate:{need:88,mass:1000000,label:'SPILLWAY GATE'},damcrane:{need:96,mass:1800000,label:'DAM GANTRY CRANE'},hydrogenerator:{need:105,mass:6000000,label:'HYDRO GENERATOR'},
 monorail:{need:105,mass:2000000,label:'MONORAIL TRAIN'},towercrane:{need:116,mass:3000000,label:'TOWER CRANE'},officeblock:{need:128,mass:6000000,label:'OFFICE TOWER'},megaspire:{need:145,mass:30000000,label:'MEGACITY SPIRE'}
});
WORLD_END=5200;camera.far=7000;camera.updateProjectionMatrix();scene.fog.far=5600;
function beyondRod(a,b,r=.13,color=palette.gold){const d=new T.Vector3(...b).sub(new T.Vector3(...a)),m=cylinder(environment,color,0,0,0,r,d.length());m.position.fromArray(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m;}
function newGate(x,z,caption,index){const g=new T.Group();scene.add(g);g.position.x=x;for(let q=-z;q<=z;q+=14){box(g,palette.gold,0,2,q,.35,.32,13);box(g,palette.dark,0,1,q,.3,2,.3);}districtGates.push({gate:g,caption:label(caption,x,10,0,32),index});}

// 10 / CROWN QUARRY — terraces, conveyors and earth-moving giants.
district(3185,730,700,'#776d5b');box(environment,'#5d5549',3185,.015,0,722,.025,686);
for(const side of [-1,1])for(let tier=0;tier<4;tier++){const z=side*(250+tier*38),h=8+tier*8;box(environment,tier%2?'#756956':'#88765e',3185,h/2,z,720,h,52);for(let x=2860;x<3510;x+=42)box(environment,'#4d4a42',x,h+.15,z-side*27,32,.18,1.1);}
for(const z of [-128,128]){box(environment,'#30393b',3200,7,z,590,.8,8);for(let x=2910;x<3490;x+=34)cylinder(environment,palette.dark,x,8,z,.65,10);for(let x=2920;x<3480;x+=70){beyondRod([x,12,z-3.5],[x+34,7,z+3.5],.11);beyondRod([x,7,z+3.5],[x+34,12,z-3.5],.11);}}
for(const [x,z,s] of [[2920,-70,18],[3020,74,13],[3290,-62,22],[3440,76,16]]){const rock=new T.Mesh(new T.DodecahedronGeometry(s,1),mat(x%3?'#8b7c63':'#6f6658',.05));rock.position.set(x,s*.45,z);rock.scale.set(1.6,.7,1.1);rock.rotation.set(.2,x*.01,.1);rock.castShadow=rock.receiveShadow=true;environment.add(rock);}
label('10 / CROWN QUARRY',3180,46,-310,48);label('MOUNTAINS MOVE HERE',3180,8,-242,26);newGate(2819,265,'FOUNDRY → CROWN QUARRY',8);

// 11 / HALCYON HYDRO — reservoir, power house and monumental spillway.
district(3925,750,800,'#53686a');box(environment,'#485758',3925,.015,0,742,.025,786);
for(const side of [-1,1]){box(environment,'#315d68',3925,-.1,side*318,742,.12,126);for(let x=3580;x<4280;x+=28)box(environment,'#91b8b5',x,.04,side*(285+(x%4)*7),25,.015,.65);}
box(environment,'#aaa58f',4248,32,0,34,64,610);for(let z=-280;z<=280;z+=56){box(environment,palette.dark,4230,25,z,15,45,38);box(environment,'#c7bd9e',4220,50,z,36,3,8);cylinder(environment,'#58777a',4205,18,z,5,36);}
for(let x=3610;x<4170;x+=110)for(const side of [-1,1]){const z=side*210;cylinder(environment,'#55777b',x,5,z,5.6,10);beyondRod([x,10,z],[x+55,22,z],2.8,'#687f80');}
for(let x=3600;x<4220;x+=65){cylinder(environment,palette.dark,x,10,-125,.55,20);cylinder(environment,palette.dark,x,10,125,.55,20);beyondRod([x,20,-125],[x+32,24,125],.22,'#b8a46a');}
label('11 / HALCYON HYDRO',3915,43,-365,48);label('CURRENT BECOMES POWER',3920,7,-254,28);newGate(3549,305,'QUARRY → HALCYON HYDRO',9);

// 12 / APEX CORE — a vertical city with an open central avenue.
district(4750,900,900,'#3f4a50');box(environment,'#303b42',4750,.015,0,892,.025,886);
for(let x=4340;x<5170;x+=52){box(environment,'#c7b36e',x,.06,-92,34,.025,.8);box(environment,'#c7b36e',x,.06,92,34,.025,.8);}
for(const side of [-1,1])for(let i=0;i<11;i++){const x=4360+i*78,z=side*(250+(i%3)*42),h=45+(i*37)%105,w=42+(i%2)*18,d=62+(i%4)*12;solid(x,h/2,z,w,h,d,i%3?'#4f626b':'#665f59');box(environment,i%2?'#355b66':'#665a4f',x,h*.55,z-side*(d/2+.2),w*.78,h*.72,.2);for(let y=12;y<h-4;y+=12)for(let q=-w*.3;q<=w*.3;q+=12)box(environment,'#e4c782',x+q,y,z-side*(d/2+.35),5,5,.12);}
for(const side of [-1,1]){box(environment,'#7d8889',4750,22,side*168,860,2,8);for(let x=4340;x<5180;x+=42)cylinder(environment,'#596366',x,11,side*168,.7,22);}
for(let x=4370;x<5160;x+=95)for(let z of [-126,126]){cylinder(environment,palette.dark,x,8,z,.55,16);box(environment,'#d7be70',x,16.5,z,2.6,1,2.6);}
label('12 / APEX CORE',4740,62,-408,52);label('THE WHOLE CITY FITS',4745,8,-208,30);newGate(4299,345,'HYDRO → APEX CORE',10);

const foundryLayout=makeLayout;
function recovery(add,region,x,z,kinds){for(let i=0;i<40;i++)add('bolt',x+(i%8)*.5,.14,z+Math.floor(i/8)*.5,region);for(let i=0;i<20;i++)add('can',x+5+(i%5)*.7,.22,z+5+Math.floor(i/5)*.7,region);for(let i=0;i<16;i++)add('toolbox',x+(i%4)*1.3,null,z+14+Math.floor(i/4)*1.35,region);for(let i=0;i<16;i++)add('barrel',x+(i%4)*1.6,.65,z+24+Math.floor(i/4)*1.6,region);for(let i=0;i<12;i++)add(kinds[0],x+10+(i%6)*8,null,z+42+Math.floor(i/6)*11,region);for(let i=0;i<10;i++)add(kinds[1],x+50+(i%5)*16,null,z+66+Math.floor(i/5)*18,region);}
makeLayout=function(add){foundryLayout(add);
 for(let i=0;i<18;i++)add('haultruck',2870+(i%9)*72,null,-205+Math.floor(i/9)*410,9);for(let i=0;i<14;i++)add('drillrig',2910+(i%7)*92,null,-112+Math.floor(i/7)*224,9);for(let i=0;i<12;i++)add('rockcrusher',2950+(i%6)*103,null,-58+Math.floor(i/6)*116,9);add('bucketwheel',3490,null,0,9,{goal:true});recovery(add,9,2840,-240,['container','bulldozer']);
 for(let i=0;i<18;i++)add('penstock',3600+(i%9)*70,null,-220+Math.floor(i/9)*440,10);for(let i=0;i<14;i++)add('spillgate',3640+(i%7)*92,null,-135+Math.floor(i/7)*270,10);for(let i=0;i<10;i++)add('damcrane',3680+(i%5)*112,null,-70+Math.floor(i/5)*140,10);add('hydrogenerator',4230,null,0,10,{goal:true});recovery(add,10,3570,-265,['transformer','turbine']);
 for(let i=0;i<18;i++)add('monorail',4350+(i%9)*88,null,-198+Math.floor(i/9)*396,11);for(let i=0;i<12;i++)add('towercrane',4400+(i%6)*125,null,-116+Math.floor(i/6)*232,11);for(let i=0;i<12;i++)add('officeblock',4420+(i%6)*126,null,-62+Math.floor(i/6)*124,11);add('megaspire',5140,null,0,11,{goal:true});recovery(add,11,4320,-310,['car','bus']);
};
