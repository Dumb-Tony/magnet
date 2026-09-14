/* Authored salvage miniatures. Shared geometry, atlas labels and material batching. */
'use strict';
const DetailedModels=(()=>{
 const templates={},sources={},geometries={},batchMaterials={};
 const C={paint:'#b95739',teal:'#377b79',cream:'#e8d9ad',yellow:'#e2aa32',steel:'#9daab0',iron:'#3a464d',rubber:'#20282b',glass:'#597d83',wood:'#b29164',red:'#a82f29'};
 const atlas=document.createElement('canvas');atlas.width=atlas.height=2048;const ctx=atlas.getContext('2d'),labels={};let labelIndex=0;
 const atlasMap=new THREE.CanvasTexture(atlas);atlasMap.colorSpace=THREE.SRGBColorSpace;atlasMap.anisotropy=8;
 const labelMat=new THREE.MeshStandardMaterial({map:atlasMap,roughness:.72,metalness:.08,side:THREE.DoubleSide});
 function tag(g,text,x,y,z,w,h,ry=0,style='paper',wrap=0){
  const key=text+style;let cell=labels[key];
  if(!cell){const i=labelIndex++,u=i%8,v=Math.floor(i/8);if(i>=64)throw Error('Label atlas full');cell=labels[key]={u,v};ctx.save();ctx.translate(u*256,v*256);ctx.fillStyle=style==='dark'?'#183239':style==='hazard'?'#edb52e':'#e4dbbc';ctx.fillRect(0,0,256,256);
   if(style==='hazard'){ctx.fillStyle='#293333';for(let j=-256;j<512;j+=70){ctx.beginPath();ctx.moveTo(j,0);ctx.lineTo(j+34,0);ctx.lineTo(j+290,256);ctx.lineTo(j+256,256);ctx.fill();}ctx.fillStyle='#edb52e';ctx.fillRect(12,79,232,98);}
   ctx.strokeStyle=style==='dark'?'#759b9b':'#716b57';ctx.lineWidth=3;ctx.strokeRect(10,10,236,236);ctx.fillStyle=style==='dark'?'#eedcae':'#27363a';ctx.textAlign='center';const lines=text.split('|');ctx.font='bold '+(lines.length>2?29:35)+'px Arial';lines.forEach((line,j)=>ctx.fillText(line,128,105+j*39,228));
   if(style==='paper'){ctx.fillStyle='#80765b';for(let j=0;j<35;j++)ctx.fillRect(35+j*5.3,204,1+j%3,22);ctx.font='12px monospace';ctx.fillText('MAGNET / INDUSTRIAL SUPPLY',128,39);}ctx.restore();atlasMap.needsUpdate=true;
  }
  const geo=new THREE.PlaneGeometry(w,h,wrap?16:1,1),uv=geo.attributes.uv;if(wrap){const p=geo.attributes.position;for(let i=0;i<p.count;i++){const a=p.getX(i)/wrap;p.setXYZ(i,Math.sin(a)*wrap,p.getY(i),(Math.cos(a)-1)*wrap);}geo.computeVertexNormals();}for(let i=0;i<uv.count;i++)uv.setXY(i,(cell.u+(uv.getX(i)*.96+.02))/8,1-(cell.v+((1-uv.getY(i))*.96+.02))/8);
  const m=new THREE.Mesh(geo,labelMat);m.position.set(x,y,z);m.rotation.y=ry;g.add(m);return m;
 }
 function material(type,color){return ScrapSurfaces.material(color,type==='steel'?.75:type==='paint'?.35:0,type);}
 function part(g,geo,color,pos,type='paint'){const m=new THREE.Mesh(geo,material(type,color));m.position.set(...pos);m.castShadow=m.receiveShadow=true;g.add(m);return m;}
 function block(g,color,x,y,z,w,h,d,bevel=0,type='paint'){
  const key=[w,h,d,bevel].join(':');let geo=geometries[key];
  if(!geo){geo=new THREE.BoxGeometry(w,h,d,bevel?3:1,bevel?3:1,bevel?3:1);if(bevel){const a=geo.attributes.position,r=Math.min(bevel,w*.25,h*.25,d*.25),v=new THREE.Vector3(),q=new THREE.Vector3();for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i);q.set(THREE.MathUtils.clamp(v.x,-w/2+r,w/2-r),THREE.MathUtils.clamp(v.y,-h/2+r,h/2-r),THREE.MathUtils.clamp(v.z,-d/2+r,d/2-r));v.sub(q).normalize().multiplyScalar(r).add(q);a.setXYZ(i,...v.toArray());}geo.computeVertexNormals();}geometries[key]=geo;}
  return part(g,geo,color,[x,y,z],type);
 }
 function cylinder(g,color,x,y,z,r,h,type='steel',sides=16){const key=['c',r,h,sides].join(':');const geo=geometries[key]||(geometries[key]=new THREE.CylinderGeometry(r,r,h,sides));return part(g,geo,color,[x,y,z],type);}
 function ring(g,color,x,y,z,r,t=.025,axis='z',type='steel'){const key=['r',r,t].join(':');const geo=geometries[key]||(geometries[key]=new THREE.TorusGeometry(r,t,6,24));const m=part(g,geo,color,[x,y,z],type);if(axis==='y')m.rotation.x=Math.PI/2;if(axis==='x')m.rotation.y=Math.PI/2;return m;}
 function rod(g,color,a,b,r=.025,type='steel'){const va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),d=vb.clone().sub(va),mid=va.add(vb).multiplyScalar(.5),m=cylinder(g,color,...mid.toArray(),r,d.length(),type,8);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
 function panel(g,color,vertices,type='paint'){const geo=new THREE.BufferGeometry(),p=[];for(let i of [0,1,2,0,2,3])p.push(...vertices[i]);geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,0,1,1,0,1],2));geo.computeVertexNormals();const m=part(g,geo,color,[0,0,0],type),key=color+type+'panel';if(!batchMaterials[key]){batchMaterials[key]=m.material.clone();batchMaterials[key].side=THREE.DoubleSide;}m.material=batchMaterials[key];return m;}
 function rivets(g,x,y,z,count,spacing,axis='x',r=.025){for(let i=0;i<count;i++){const p=[x,y,z];p[axis==='x'?0:axis==='y'?1:2]+=i*spacing;const m=cylinder(g,C.steel,...p,r,r*.6,'steel',6);m.rotation.x=Math.PI/2;}}
 function tire(g,x,y,z,r=.45,width=.25){const t=cylinder(g,C.rubber,x,y,z,r,width,'rubber',24);t.rotation.z=Math.PI/2;const side=Math.sign(x)||1;const rim=cylinder(g,C.steel,x+side*width*.52,y,z,r*.61,.035);rim.rotation.z=Math.PI/2;ring(g,C.iron,x+side*width*.6,y,z,r*.43,.025,'x');const hub=cylinder(g,C.iron,x+side*width*.64,y,z,r*.19,.05);hub.rotation.z=Math.PI/2;for(let i=0;i<5;i++){const a=i*Math.PI*2/5,m=cylinder(g,C.cream,x+side*width*.67,y+Math.cos(a)*r*.32,z+Math.sin(a)*r*.32,.023,.035);m.rotation.z=Math.PI/2;}}
 function raw(kind){
  if(sources[kind])return sources[kind].clone();
  const g=new THREE.Group();g.name=kind;
  if(kind==='bolt'){
   cylinder(g,C.steel,0,0,0,.045,.22);for(let y=-.1;y<.1;y+=.023)ring(g,C.iron,0,y,0,.047,.006,'y');cylinder(g,C.steel,0,.125,0,.105,.055,'steel',6);cylinder(g,C.iron,0,.154,0,.044,.002,'steel',6);ring(g,C.steel,0,.08,0,.078,.012,'y');
  }
  if(kind==='can'){
   cylinder(g,C.paint,0,0,0,.16,.4,'paint',24);for(let y of [-.2,.2]){ring(g,C.steel,0,y,0,.158,.012,'y');cylinder(g,C.steel,0,y,0,.153,.013);}cylinder(g,C.paint,0,.214,0,.125,.003,'paint');tag(g,'OXIDE|ENAMEL',0,-.01,.163,.27,.25,0,'paper',.163);
   const handle=ring(g,C.iron,0,.17,0,.175,.008,'z');handle.scale.y=.7;for(let x of [-.163,.163])cylinder(g,C.steel,x,.08,0,.018,.025);block(g,C.iron,0,.29,0,.1,.018,.024,.008,'rubber');
  }
  if(kind==='tool'){
   block(g,C.steel,0,0,0,.13,.065,.56,.023,'steel');ring(g,C.steel,0,0,-.3,.14,.045,'y');for(let x of [-.085,.085])block(g,C.steel,x,0,.32,.07,.07,.19,.012,'steel');block(g,C.steel,0,0,.25,.2,.07,.09,.015,'steel');block(g,C.iron,0,.035,0,.075,.005,.24,.01,'steel');tag(g,'DROP|FORGED',0,.04,.02,.07,.2).rotation.x=-Math.PI/2;
  }
  if(kind==='pipe'){
   const body=cylinder(g,C.paint,0,0,0,.13,2.6,'paint',24);body.rotation.z=Math.PI/2;
   for(let x of [-1.3,1.3]){ring(g,C.steel,x,0,0,.135,.028,'x');const hole=cylinder(g,C.iron,x+Math.sign(x)*.003,0,0,.106,.008);hole.rotation.z=Math.PI/2;for(let i=0;i<4;i++){const a=i*Math.PI/2,m=cylinder(g,C.steel,x,Math.cos(a)*.18,Math.sin(a)*.18,.023,.09,'steel',6);m.rotation.z=Math.PI/2;}ring(g,C.paint,x,0,0,.17,.023,'x','paint');}for(let x of [-.8,.8])ring(g,C.steel,x,0,0,.135,.025,'x');
  }
  if(kind==='wheel'){
   ring(g,C.rubber,0,0,0,.38,.09,'z','rubber');ring(g,C.steel,0,0,.015,.29,.04);for(let i=0;i<12;i++){const a=i*Math.PI/6;rod(g,C.steel,[0,0,.025],[Math.cos(a)*.29,Math.sin(a)*.29,.025],.012);}const hub=cylinder(g,C.iron,0,0,0,.07,.12);hub.rotation.x=Math.PI/2;ring(g,C.steel,0,0,.07,.045,.012);
  }
  if(kind==='stool'){
   cylinder(g,C.yellow,0,.35,0,.48,.12,'paint',32);ring(g,C.steel,0,.29,0,.44,.018,'y');for(let x of [-.28,.28])for(let z of [-.28,.28]){rod(g,C.teal,[x,.29,z],[x*1.24,-.52,z*1.24],.036);cylinder(g,C.rubber,x*1.24,-.51,z*1.24,.05,.065,'rubber');}ring(g,C.iron,0,-.25,0,.39,.02,'y');for(let i=0;i<4;i++){const a=i*Math.PI/2;cylinder(g,C.steel,Math.cos(a)*.35,.414,Math.sin(a)*.35,.022,.008);}
  }
  if(kind==='locker'){
   block(g,C.teal,0,0,0,1.1,1.8,.65,.045);block(g,C.iron,0,0,.328,1,1.68,.015);block(g,C.teal,0,0,.34,.94,1.62,.028,.018);for(let y of [-.65,.4,.5,.6])block(g,C.iron,-.1,y,.36,.55,.022,.012);for(let y of [-.6,.6])block(g,C.steel,-.47,y,.37,.035,.14,.028,.01,'steel');rod(g,C.steel,[.3,-.12,.4],[.3,.14,.4],.024);cylinder(g,C.iron,.3,-.18,.363,.022,.016).rotation.x=Math.PI/2;tag(g,'07',-.13,-.36,.36,.25,.18,0,'dark');
  }
  if(kind==='bench'){
   for(let z=-2.5;z<=2.5;z+=1)block(g,C.wood,0,0,z,10,.25,.98,.035,'wood');for(let x of [-4.5,4.5])for(let z of [-2.5,2.5]){block(g,C.teal,x,-1.1,z,.25,2,.25,.02);cylinder(g,C.iron,x,-2.09,z,.21,.08);}for(let z of [-2.5,2.5]){block(g,C.teal,0,-.32,z,9.4,.45,.14,.025);rod(g,C.iron,[-4.4,-1.7,z],[4.4,-.48,z],.035);}block(g,C.wood,0,-1.65,0,9,.12,4.8,.015,'wood');for(let x of [-3,0,3]){block(g,C.teal,x,-.58,2.56,2.8,.52,.065,.02);rod(g,C.steel,[x-.4,-.58,2.63],[x+.4,-.58,2.63],.035);}for(let x of [-4.5,4.5])for(let z of [-2.5,2.5])cylinder(g,C.steel,x,.131,z,.075,.012,'steel',6);tag(g,'FORGE|WORKS',0,-.32,2.58,1.2,.34,0,'dark');
  }
  if(kind==='barrel'){
   cylinder(g,C.paint,0,0,0,.45,1.25,'paint',32);for(let y of [-.6,-.4,.4,.6])ring(g,C.steel,0,y,0,.453,.022,'y');cylinder(g,C.iron,0,.625,0,.425,.018);cylinder(g,C.steel,.23,.647,0,.065,.025,'steel',6);tag(g,'OIL|200 L',0,0,.453,.6,.53,0,'hazard',.453);
  }
  if(kind==='cart'){
   block(g,C.yellow,0,0,0,1.1,.12,1.4,.025);for(let x of [-.48,.48]){rod(g,C.teal,[x,0,-.65],[x,1.05,-.65],.045);block(g,C.rubber,x,.95,-.64,.065,.25,.075,.025,'rubber');}for(let y of [.2,.55,.8])rod(g,C.teal,[-.48,y,-.65],[.48,y,-.65],.03);for(let x of [-.56,.56])for(let z of [-.5,.5])tire(g,x,-.15,z,.2,.14);tag(g,'MAX|250 KG',0,.02,0,.3,.3,0,'dark').rotation.x=-Math.PI/2;
  }
  if(kind==='bike'){
   for(let z of [-.65,.65]){ring(g,C.rubber,0,0,z,.38,.045,'x','rubber');ring(g,C.steel,0,0,z,.33,.013,'x');for(let i=0;i<12;i++){const a=i*Math.PI/6;rod(g,C.steel,[0,0,z],[0,Math.cos(a)*.33,z+Math.sin(a)*.33],.007);}}
   const points=[[0,.05,-.65],[0,.05,0],[0,.55,-.3],[0,.58,.42],[0,.05,.65]];for(let [a,b] of [[0,1],[0,2],[1,2],[2,3],[1,3],[3,4],[1,4]])rod(g,C.paint,points[a],points[b],.027,'paint');rod(g,C.steel,[0,.58,.42],[0,.8,.46],.025);rod(g,C.steel,[-.32,.8,.46],[.32,.8,.46],.024);block(g,C.rubber,0,.65,-.3,.22,.06,.3,.03,'rubber');ring(g,C.steel,0,.05,0,.12,.022,'x');rod(g,C.iron,[-.12,.05,0],[.12,.05,0],.02);for(let x of [-.16,.16])block(g,C.iron,x,.05,Math.sign(x)*.1,.1,.035,.14,.012);rod(g,C.iron,[.045,.05,-.65],[.045,.15,0],.009);
  }
  if(kind==='skip'){
   block(g,C.iron,0,-.62,0,2.5,.16,1.7);for(let x of [-1.25,1.25])block(g,C.teal,x,0,0,.12,1.4,1.8,.025);for(let z of [-.85,.85]){block(g,C.teal,0,0,z,2.5,1.4,.12,.025);block(g,C.yellow,0,.61,z,2.65,.12,.15,.025);for(let x of [-.9,0,.9])block(g,C.iron,x,0,z*1.08,.07,1.3,.07);}for(let i=0;i<5;i++){const m=block(g,i%2?C.steel:C.paint,-.9+i*.4,-.15+i*.06,0,.4,.12,1.3,.02);m.rotation.z=(i-2)*.22;}tag(g,'SALVAGE|NO. 42',0,.1,.925,.8,.6,0,'hazard');
  }
  if(kind==='forklift'){
   block(g,C.yellow,0,-.1,.1,1.8,.95,2.4,.12);block(g,C.iron,0,.47,.5,.75,.16,.8,.055,'rubber');block(g,C.iron,0,.84,.85,.75,.7,.14,.05,'rubber');for(let x of [-.7,.7])for(let z of [-.5,.8])rod(g,C.iron,[x,.4,z],[x,2.23,z],.05);block(g,C.yellow,0,2.3,.1,1.8,.12,1.5,.05);for(let x of [-.5,.5]){block(g,C.iron,x,.6,-1.3,.15,2.6,.2);rod(g,C.steel,[x,-.5,-1.42],[x,1.8,-1.42],.04);block(g,C.steel,x,-.65,-2.1,.18,.1,1.8,.02,'steel');}for(let y of [-.2,.5,1.2])block(g,C.iron,0,y,-1.32,1.1,.06,.09);for(let x of [-.92,.92])for(let z of [-.85,.85])tire(g,x,-.4,z,.4,.25);ring(g,C.iron,0,1.1,-.24,.2,.025,'y');rod(g,C.iron,[0,.3,-.2],[0,1.1,-.24],.035);cylinder(g,C.yellow,.48,2.43,.45,.09,.18,'paint');tag(g,'LIFT|3.5 T',.92,.02,.2,.72,.5,Math.PI/2,'dark');
  }
  if(kind==='hydrant'){
   cylinder(g,C.red,0,.05,0,.25,.8,'paint');cylinder(g,C.iron,0,-.35,0,.34,.1);cylinder(g,C.red,0,.49,0,.29,.13,'paint',8);cylinder(g,C.steel,0,.58,0,.065,.06,'steel',6);for(let x of [-.34,.34]){const cap=cylinder(g,C.red,x,.16,0,.16,.23,'paint',8);cap.rotation.z=Math.PI/2;const nut=cylinder(g,C.steel,x*1.25,.16,0,.05,.025,'steel',6);nut.rotation.z=Math.PI/2;}ring(g,C.iron,0,.16,.257,.12,.018);for(let y=-.1;y<.3;y+=.06)ring(g,C.iron,.15,y,.23,.024,.006);tag(g,'FIRE',0,-.08,.26,.26,.14,0,'dark');
  }
  if(kind==='sign'){
   cylinder(g,C.steel,0,0,0,.055,3);cylinder(g,C.iron,0,-1.48,0,.18,.04);block(g,C.cream,0,1.35,0,1.8,.7,.08,.04);tag(g,'MAIN ST|→ CITY',0,1.35,.046,1.72,.63,0,'dark');for(let y of [1.13,1.56])rivets(g,0,y,.06,1,.1);for(let y=-1.2;y<1;y+=.18){const m=cylinder(g,C.iron,0,y,.055,.009,.004);m.rotation.x=Math.PI/2;}
  }
  if(['car','van','bus','truck','tram'].includes(kind))vehicle(g,kind);
  if(kind==='toolbox'){block(g,C.paint,0,0,0,.8,.4,.42,.04);block(g,C.paint,0,.24,0,.82,.09,.44,.03);for(let x of [-.2,.2])block(g,C.steel,x,.08,.23,.07,.14,.035,.01,'steel');rod(g,C.iron,[-.18,.4,0],[.18,.4,0],.027);for(let x of [-.18,.18])rod(g,C.iron,[x,.28,0],[x,.4,0],.02);tag(g,'FORGE',0,-.06,.216,.35,.13,0,'dark');}
  if(kind==='drill'){block(g,C.yellow,0,.12,0,.23,.24,.4,.05);block(g,C.iron,0,-.12,.08,.15,.3,.15,.03,'rubber');block(g,C.yellow,0,-.3,.08,.26,.1,.23,.02);const chuck=cylinder(g,C.steel,0,.12,-.27,.075,.16);chuck.rotation.x=Math.PI/2;rod(g,C.steel,[0,.12,-.35],[0,.12,-.55],.02);for(let z of [-.1,0,.1])block(g,C.iron,.119,.15,z,.012,.075,.035);}
  if(kind==='vending'){block(g,C.paint,0,0,0,1.1,2,.8,.07);block(g,C.iron,-.16,.2,.412,.68,1.35,.025,.025);for(let y of [-.2,.2,.6])for(let x of [-.37,-.1,.17]){cylinder(g,C.cream,x,y,.44,.085,.2,'paint');}block(g,C.iron,0,-.73,.42,.74,.18,.09,.03);for(let y of [.1,.3,.5])cylinder(g,C.steel,.41,y,.43,.035,.01).rotation.x=Math.PI/2;tag(g,'COLD|DRINKS',0,.84,.411,.8,.24,0,'dark');}
  if(kind==='trafficlight'){rod(g,C.iron,[0,-2,0],[0,2,0],.075);rod(g,C.iron,[0,1.9,0],[1.3,1.9,0],.07);block(g,C.iron,1.3,1.3,0,.43,1.3,.3,.07);for(const [i,color] of [C.red,C.yellow,C.teal].entries()){const m=cylinder(g,color,1.3,1.7-i*.4,.18,.14,.04,'paint');m.rotation.x=Math.PI/2;ring(g,C.iron,1.3,1.7-i*.4,.2,.15,.023);}cylinder(g,C.iron,0,-1.95,0,.32,.15);}
  if(kind==='excavator'){
   for(let x of [-1.1,1.1]){block(g,C.iron,x,-.8,0,.7,.7,3.4,.2);for(let z=-1.3;z<1.5;z+=.43)tire(g,x,-.8,z,.32,.65);for(let z=-1.5;z<1.6;z+=.22)block(g,C.steel,x,-.43,z,.74,.07,.08);}
   cylinder(g,C.iron,0,-.22,0,1,.24);block(g,C.yellow,0,.23,.35,2.4,.7,2.8,.1);block(g,C.iron,-.65,1.05,.25,1.15,1.1,1.5,.07);block(g,C.glass,-.65,1.2,-.52,.92,.65,.035,.025,'glass');block(g,C.yellow,-.65,1.66,.25,1.25,.13,1.6,.03);
   for(let x of [-1.23,-.07])block(g,C.glass,x,1.2,.25,.02,.65,1.1,.02,'glass');for(let z of [.6,.85,1.1])block(g,C.iron,.4,.6,z,.8,.035,.1);for(let x of [.3,.7]){rod(g,C.yellow,[x,.5,-.6],[x,3.3,-2.4],.17,'paint');rod(g,C.yellow,[x,3.3,-2.4],[x,.4,-4.1],.14,'paint');rod(g,C.steel,[x,.7,-1.2],[x,2.7,-2.4],.065);}
   block(g,C.iron,.5,.1,-4.15,1.3,.7,.9,.07);for(let x of [0,.3,.6,.9])block(g,C.steel,x,-.25,-4.65,.14,.15,.3);tag(g,'FORGE|EX-20',1.21,.2,.4,1.2,.45,Math.PI/2,'dark');
  }
  if(kind==='tankcar'||kind==='locomotive'){
   const loco=kind==='locomotive',L=loco?12:10;block(g,C.iron,0,-1,0,2.8,.4,L,.06);for(let x of [-1.25,1.25])for(let z of [-L*.37,-L*.26,L*.26,L*.37])tire(g,x,-1.35,z,.45,.25);
   for(let z of [-L/2-.3,L/2+.3])block(g,C.steel,0,-1,z,.25,.25,.6,.03,'steel');
   if(!loco){const tank=cylinder(g,C.cream,0,.6,0,1.5,8.8,'paint',32);tank.rotation.x=Math.PI/2;for(let z of [-3.8,0,3.8])ring(g,C.iron,0,.6,z,1.52,.035);cylinder(g,C.iron,0,2.16,0,.42,.2);for(let x of [-.3,.3])rod(g,C.steel,[x,-.7,1.55],[x,2.3,1.55],.035);for(let y=-.5;y<2.3;y+=.35)rod(g,C.steel,[-.3,y,1.55],[.3,y,1.55],.023);tag(g,'MGNT|TANK 081',1.51,.7,0,1.8,.9,Math.PI/2,'hazard');}
   else{block(g,C.teal,0,.65,.7,2.5,2.8,9,.12);block(g,C.teal,0,1.2,-4,2.65,3.7,2.7,.1);block(g,C.glass,0,2,-5.37,2.2,1,.025,.025,'glass');for(let x of [-1.34,1.34]){block(g,C.glass,x,2,-4,.025,.95,1.7,0,'glass');for(let z=-1.5;z<4.5;z+=.3)block(g,C.iron,x,.75,z,.025,1.3,.12);rod(g,C.steel,[x,-.5,-2.7],[x,-.5,5],.035);}for(let z of [0,2.3])cylinder(g,C.iron,0,2.2,z,.55,.12);tag(g,'FORGE RAIL|071',0,.3,-5.38,1.8,.6,Math.PI,'dark');}
  }
  if(kind==='tugboat'||kind==='freighter'){
   const ship=kind==='freighter',L=ship?42:13,W=ship?11:5;
   for(const [color,y,h,width,type] of [[C.iron,-.7,2.3,W,'steel'],[C.paint,-1.5,.8,W*.94,'paint'],[C.wood,.5,.18,W*.94,'wood']]){const geo=new T.BoxGeometry(width,h,L,2,1,16),a=geo.attributes.position;for(let i=0;i<a.count;i++){const z=a.getZ(i),t=Math.max(0,-z/(L/2));a.setX(i,a.getX(i)*(1-.85*Math.pow(t,6))*(type==='wood'?1:a.getY(i)<0?.86:1));}geo.computeVertexNormals();part(g,geo,color,[0,y,0],type);}
   for(let x of [-W*.45,W*.45]){rod(g,C.steel,[x,1.35,-L*.45],[x,1.35,L*.45],.05);for(let z=-L*.45;z<L*.46;z+=ship?3:1.3)rod(g,C.steel,[x,.5,z],[x,1.35,z],.035);}
   const cabinZ=ship?L*.32:L*.1;block(g,C.cream,0,ship?3.4:1.9,cabinZ,W*.65,ship?5.7:2.8,ship?6:4,.14);block(g,C.teal,0,ship?6.3:3.4,cabinZ,W*.7,.18,ship?6.4:4.3,.04);for(let x of [-W*.22,0,W*.22])block(g,C.glass,x,ship?5.4:2.7,cabinZ-(ship?3.02:2.02),W*.16,.7,.025,0,'glass');cylinder(g,C.paint,0,ship?7:4.3,cabinZ+1,.5,1.3,'paint');rod(g,C.steel,[0,2,-L*.25],[0,ship?8:5,-L*.25],.07);
   for(let x of [-W*.326,W*.326])for(let z of [-1,0,1])block(g,C.glass,x,ship?5.4:2.7,cabinZ+z,.025,.7,.65,0,'glass');for(let x of [-W*.22,0,W*.22])block(g,C.glass,x,ship?5.4:2.7,cabinZ+(ship?3.02:2.02),W*.16,.7,.025,0,'glass');rod(g,C.steel,[-1,ship?8:5,-L*.25],[1,ship?8:5,-L*.25],.035);
   if(ship){for(let x of [-3,0,3])for(let z=-15;z<9;z+=6){const color=(z+x)%2?C.teal:C.paint;block(g,color,x,1.8,z,2.8,2.5,5.7,.06);for(let dz=-2.4;dz<2.8;dz+=.6)for(let dx of [-1.42,1.42])block(g,color,x+dx,1.8,z+dz,.055,2.35,.12);}}else for(let z of [-4,0,4])for(let x of [-W*.5,W*.5])ring(g,C.rubber,x,-.1,z,.48,.12,'x','rubber');tag(g,ship?'MAGNET|MERIDIAN':'TUG 04',0,ship?3.2:1.8,cabinZ-(ship?3.03:2.03),ship?4:2,ship?1:.7,Math.PI,'dark');
  }
  if(kind==='crane'){
   for(let x of [-4,4])for(let z of [-4,4]){rod(g,C.yellow,[x,-5,z],[x*.65,7,z*.65],.24,'paint');block(g,C.iron,x,-5,z,1.2,.8,2,.1);}
   for(let z of [-3,3]){rod(g,C.iron,[-3,-3,z],[3,5,z],.09);rod(g,C.iron,[3,-3,z],[-3,5,z],.09);}block(g,C.yellow,0,7,0,7,.7,7,.1);block(g,C.cream,-2,8,-1,2,2,2,.06);block(g,C.glass,-2,8.3,-2.02,1.5,1,.025,0,'glass');
   for(let x of [-.7,.7]){rod(g,C.yellow,[x,7.5,0],[x,16,-12],.18,'paint');rod(g,C.yellow,[x,9,0],[x,16,-12],.12,'paint');rod(g,C.iron,[x,9,3],[x,16,-12],.035);}rod(g,C.iron,[0,16,-12],[0,4,-12],.055);ring(g,C.steel,0,3.65,-12,.45,.09);block(g,C.iron,0,8,3,3,2,3,.1);tag(g,'DOCK|07',0,7.1,3.56,2,.5,0,'dark');
  }
  if(kind==='kiosk'){
   block(g,C.teal,0,-.65,0,3,1.5,2.8,.06);for(let x of [-1.4,1.4])for(let z of [-1.3,1.3])block(g,C.iron,x,.5,z,.1,1.9,.1);block(g,C.yellow,0,1.6,0,3.5,.25,3.2,.07);block(g,C.cream,0,1.26,1.42,2.8,.3,.08);tag(g,'DAILY NEWS',0,1.27,1.47,2.6,.25,0,'dark');block(g,C.wood,0,-.05,1.5,3,.12,.6,.02,'wood');for(let x of [-.9,0,.9]){tag(g,'CITY|EDITION',x,.23,1.42,.58,.55);block(g,C.cream,x,.03,1.38,.58,.05,.42);}for(let x of [-1.51,1.51]){tag(g,'READ|LOCAL',x,.35,0,.9,1.2,Math.sign(x)*Math.PI/2,'dark');}
  }
  if(kind==='container'){
   block(g,C.paint,0,0,0,3,3,8,.055);for(let x of [-1.51,1.51])for(let z=-3.7;z<4;z+=.34)block(g,C.paint,x,0,z,.09,2.75,.13,.015);for(let y of [-1.43,1.43])for(let x of [-1.48,1.48])block(g,C.iron,x,y,0,.14,.14,8);for(let x of [-1.38,1.38])for(let y of [-1.38,1.38])for(let z of [-3.94,3.94])block(g,C.steel,x,y,z,.22,.22,.16,.035,'steel');for(let x of [-.75,.75]){block(g,C.paint,x,0,4.03,1.44,2.73,.065,.025);rod(g,C.steel,[x,-1.27,4.12],[x,1.27,4.12],.035);for(let y of [-1,-.25,.65,1])block(g,C.steel,x,y,4.14,.19,.08,.06,.01,'steel');rod(g,C.steel,[x,-.25,4.16],[x+.3,-.25,4.16],.025);}tag(g,'MGNT|2048 06',1.566,.66,-1.65,1.4,.7,Math.PI/2,'paper');tag(g,'CAUTION|HEAVY',-.7,.62,4.075,.55,.6,0,'hazard');
  }
  if(kind==='tower'){
   cylinder(g,C.teal,0,3,0,3,4,'paint',32);for(let y of [1.1,2,4,4.95])ring(g,C.steel,0,y,0,3.01,.038,'y');const roof=part(g,new THREE.ConeGeometry(3.2,.45,32),C.cream,[0,5.25,0]);for(let x of [-2,2])for(let z of [-2,2]){block(g,C.iron,x,-1,z,.2,5,.2);block(g,C.steel,x,-3.48,z,.55,.08,.55,.025,'steel');}for(let z of [-2,2]){rod(g,C.iron,[-2,-3.3,z],[2,1,z],.06);rod(g,C.iron,[2,-3.3,z],[-2,1,z],.06);}for(let x of [-2,2]){rod(g,C.iron,[x,-3.3,-2],[x,1,2],.06);rod(g,C.iron,[x,-3.3,2],[x,1,-2],.06);}for(let x of [-.34,.34])rod(g,C.steel,[x,-3.3,3.13],[x,5.15,3.13],.045);for(let y=-3.15;y<5.15;y+=.38)rod(g,C.steel,[-.34,y,3.13],[.34,y,3.13],.028);for(let y=1.8;y<4.8;y+=1)ring(g,C.steel,0,y,3.1,.48,.022,'y');tag(g,'CITY|WATER',2.13,3,2.13,2.2,1.4,Math.PI/4,'paper',3.015);
  }
  if(kind==='sculpture'){
   for(let x of [-3,3])for(let z of [-3,3]){rod(g,C.paint,[x,-10,z],[x*.55,8,z*.55],.22,'paint');block(g,C.iron,x,-9.9,z,.85,.2,.85,.06);}for(let y of [-8,-3,2,7]){for(let z of [-2.8,2.8])rod(g,C.steel,[-2.8,y,z],[2.8,y,z],.09);for(let x of [-2.8,2.8])rod(g,C.steel,[x,y,-2.8],[x,y,2.8],.09);for(let z of [-2.65,2.65]){rod(g,C.paint,[-2.65,y,z],[2.65,y+4.7,z],.07,'paint');rod(g,C.paint,[2.65,y,z],[-2.65,y+4.7,z],.07,'paint');}}block(g,C.paint,0,9,0,1.2,5,1.2,.12);cylinder(g,C.steel,0,12,0,.12,3);tag(g,'M',1.1,12.5,0,2,1,0,'hazard');for(let y=8;y<11.5;y+=.5)ring(g,C.steel,0,y,0,.85,.035,'y');
  }
  if(kind==='suitcase'){block(g,C.teal,0,0,0,.65,.85,.3,.06);for(let x of [-.24,.24])block(g,C.iron,x,0,.16,.045,.73,.025);rod(g,C.steel,[-.13,.55,0],[.13,.55,0],.025);for(let x of [-.13,.13])rod(g,C.steel,[x,.4,0],[x,.55,0],.017);for(let x of [-.22,.22])tire(g,x,-.43,0,.07,.08);tag(g,'MERIDIAN',0,.16,.158,.42,.14,0,'paper');}
  if(kind==='baggagecart'){block(g,C.yellow,0,-.2,0,1.8,.18,3,.035);for(let x of [-.85,.85])for(let z of [-1.1,1.1])tire(g,x,-.4,z,.25,.2);for(let x of [-.8,.8])for(let z of [-1.4,1.4])rod(g,C.iron,[x,-.15,z],[x,.8,z],.035);for(let x of [-.8,.8])rod(g,C.iron,[x,.8,-1.4],[x,.8,1.4],.035);rod(g,C.steel,[0,-.2,-1.5],[0,-.2,-2.1],.055);for(let z of [-.8,0,.8])block(g,z===0?C.paint:C.teal,0,.2,z,1.4,.7,.6,.05);}
  if(kind==='fueltruck'){vehicle(g,'truck');for(const m of [...g.children])if(m.geometry?.parameters?.height===2.7&&m.geometry.parameters.width===2.08)g.remove(m);const tank=cylinder(g,C.cream,0,1.2,1.1,1.5,4.5,'paint',24);tank.rotation.x=Math.PI/2;for(let z of [-.8,1,3])ring(g,C.yellow,0,1.2,z,1.52,.05);tag(g,'JET A-1|FLAMMABLE',1.53,1.2,1.1,1.8,.9,Math.PI/2,'hazard');for(let x of [-.4,.4])rod(g,C.steel,[x,-.5,3.5],[x,2.8,3.5],.03);for(let y=-.3;y<2.8;y+=.4)rod(g,C.steel,[-.4,y,3.5],[.4,y,3.5],.025);}
  if(kind==='controltower'){block(g,C.cream,0,4,0,4,13,4,.12);for(let y=-1;y<10;y+=2)block(g,C.glass,0,y,2.015,1.1,1.3,.025,0,'glass');block(g,C.iron,0,11,0,7,1,7,.1);block(g,C.glass,0,12.6,0,6.5,2.4,6.5,.13,'glass');block(g,C.teal,0,14,0,7.3,.35,7.3,.08);for(let x of [-3.2,0,3.2])for(let z of [-3.2,3.2])rod(g,C.cream,[x,11.4,z],[x,13.8,z],.075);rod(g,C.steel,[0,14,0],[0,17,0],.08);rod(g,C.steel,[-2,16.8,0],[2,16.8,0],.06);tag(g,'MERIDIAN|CONTROL',0,9,2.025,3,1.3,0,'dark');}
  if(kind==='propplane'||kind==='airliner'){
   const jet=kind==='airliner',L=jet?38:11,R=jet?2.1:.65;
   const body=cylinder(g,C.cream,0,1,0,R,L,'paint',32);body.rotation.x=Math.PI/2;
   for(const [z,rotation] of [[-L/2-(jet?2:.75),-Math.PI/2],[L/2+(jet?2:.75),Math.PI/2]]){const nose=part(g,new T.ConeGeometry(R,jet?4:1.5,32),C.cream,[0,1,z]);nose.rotation.x=rotation;}
   if(jet){const shape=new T.Shape();shape.moveTo(-17,2.7);for(const [x,z] of [[-3,-2.8],[3,-2.8],[17,2.7],[17,4.1],[3,1.8],[-3,1.8],[-17,4.1]])shape.lineTo(x,z);shape.closePath();const wing=part(g,new T.ExtrudeGeometry(shape,{depth:.2,bevelEnabled:true,bevelSize:.035,bevelThickness:.035,bevelSegments:1,steps:1}),C.teal,[0,.65,0]);wing.rotation.x=Math.PI/2;}else block(g,C.teal,0,.6,0,13,.18,1.7,.08);
   block(g,C.teal,0,1,L*.38,jet?12:4.5,.14,jet?3:1,.05);const fin=block(g,C.teal,0,jet?4.1:2.2,L*.4,.22,jet?6:2.5,jet?4:1.7,.08);fin.rotation.x=-.18;
   for(let x of [-R*.985,R*.985])for(let z=-L*.3;z<L*.31;z+=jet?1.3:.8)block(g,C.glass,x,1+R*.15,z,.065,jet?.45:.23,jet?.65:.32,.035,'glass');for(let x of [-R*.78,R*.78])block(g,C.glass,x,1+R*.68,-L*.4,.07,jet?.45:.24,jet?2.2:1,.03,'glass');block(g,C.glass,0,1+R+.016,-L*.4,R,.035,jet?1.9:.7,.02,'glass');
   for(let x of [-(jet?7:1.3),jet?7:1.3]){rod(g,C.iron,[x,.4,1],[x,-1.2,1],.075);tire(g,x,-1.2,1,jet?.6:.25,jet?.35:.18);}
   rod(g,C.iron,[0,.4,-L*.33],[0,-1.2,-L*.33],.07);tire(g,.1,-1.2,-L*.33,jet?.5:.23,.2);
   if(jet){for(let x of [-7,7]){const engine=cylinder(g,C.cream,x,-.15,-1,1,4,'paint',24);engine.rotation.x=Math.PI/2;const inlet=cylinder(g,C.iron,x,-.15,-3.02,.84,.08);inlet.rotation.x=Math.PI/2;ring(g,C.steel,x,-.15,-3.06,.84,.07);for(let i=0;i<8;i++){const blade=block(g,C.steel,x,-.15,-3.07,.055,1.45,.04);blade.rotation.z=i*Math.PI/4;}}tag(g,'MERIDIAN|AIR',R+.02,1.5,-6,5,1.25,Math.PI/2,'dark');}
   else{rod(g,C.iron,[0,1,-L/2-1],[0,1,-L/2-1.4],.1);for(let angle of [0,Math.PI/2]){const blade=block(g,C.iron,0,1,-L/2-1.4,.12,2.5,.06,.035);blade.rotation.z=angle;}tag(g,'M-07',.66,1.3,2,.9,.35,Math.PI/2,'dark');}
  }
  if(kind==='satellite'){block(g,C.yellow,0,0,0,2.2,2.2,2.4,.16,'steel');for(let x of [-4.5,4.5]){block(g,C.teal,x,0,0,5.8,.12,2.3,.03,'glass');for(let z=-.8;z<=.8;z+=.4)rod(g,C.steel,[x-2.8,0,z],[x+2.8,0,z],.025);for(let dx=-2.4;dx<=2.4;dx+=.8)rod(g,C.steel,[x+dx,0,-1.1],[x+dx,0,1.1],.025);}rod(g,C.steel,[0,1.1,0],[0,3.2,0],.06);cylinder(g,C.cream,0,3.25,0,.55,.18);for(let x of [-.65,.65])for(let z of [-.7,.7]){const nozzle=part(g,new T.ConeGeometry(.18,.5,12),C.iron,[x,-1.35,z]);nozzle.rotation.x=Math.PI; }tag(g,'ORBITAL|SYSTEMS',1.11,.2,0,1.5,.8,Math.PI/2,'dark');}
  if(kind==='rover'){block(g,C.cream,0,.5,0,3.6,.65,4.6,.12);for(let z of [-1.7,0,1.7])for(let x of [-2.2,2.2]){rod(g,C.steel,[x*.65,.35,z],[x,0,z],.08);tire(g,x,0,z,.62,.42);}rod(g,C.steel,[0,.8,-.5],[0,3,-.5],.09);block(g,C.glass,0,3.2,-.5,.65,.55,.55,.08,'glass');const dish=part(g,new T.SphereGeometry(1.05,20,10,0,Math.PI*2,0,.55),C.cream,[0,1.5,1]);dish.scale.y=.32;dish.rotation.x=-.7;tag(g,'LUNAR|ROVER',0,.84,-2.31,1.8,.6,0,'dark');}
  if(kind==='radar'){block(g,C.iron,0,.4,0,5,.8,5,.08);for(let x of [-2,2])for(let z of [-2,2])rod(g,C.steel,[x,.8,z],[x*.45,5,z*.45],.12);cylinder(g,C.steel,0,5,0,.7,1.1);const dish=part(g,new T.SphereGeometry(4.5,28,14,0,Math.PI*2,0,.62),C.cream,[0,7,0]);dish.scale.y=.25;dish.rotation.x=-.68;rod(g,C.iron,[0,7,0],[0,10,-2],.11);cylinder(g,C.yellow,0,10,-2,.25,.7);tag(g,'DEEP SPACE',2.51,2.2,0,2.4,.8,Math.PI/2,'dark');}
  if(kind==='launchtruck'){block(g,C.iron,0,.2,0,11,1.2,18,.15);for(let x of [-4.4,4.4])for(let z=-7;z<=7;z+=2){tire(g,x,-.55,z,1,.7);}block(g,C.yellow,0,1.2,0,9.6,1,16,.12);for(let z of [-6,6])block(g,C.cream,0,2.7,z,8,2.2,3,.15);for(let x of [-4.6,4.6])for(let z of [-7.5,7.5])rod(g,C.steel,[x,1,z],[x,4,z],.08);for(let x of [-4.6,4.6])rod(g,C.steel,[x,4,-7.5],[x,4,7.5],.08);tag(g,'CRAWLER|TRANSPORT',4.82,2,0,3.8,1.4,Math.PI/2,'hazard');}
  if(kind==='rocket'){const body=cylinder(g,C.cream,0,19,0,3.2,38,'paint',32);for(let y of [3,14,27,36])ring(g,y===14?C.teal:C.steel,0,y,0,3.24,.14,'y');const nose=part(g,new T.ConeGeometry(3.2,9,32),C.cream,[0,42.5,0]);for(let i=0;i<4;i++){const a=i*Math.PI/2,x=Math.sin(a)*3.2,z=Math.cos(a)*3.2;const fin=block(g,C.teal,x,4,z,4,.3,7,.08);fin.rotation.y=-a;const bell=part(g,new T.ConeGeometry(1.25,2.5,20,1,true),C.iron,[Math.sin(a)*1.35,-1.2,Math.cos(a)*1.35]);bell.rotation.x=Math.PI;}tag(g,'MAGNET VIII|TO ORBIT',3.22,23,0,5,2,Math.PI/2,'dark');}
  sources[kind]=g;return g.clone();
 }
 function vehicle(g,kind){
  const transit=kind==='bus'||kind==='tram',truck=kind==='truck',van=kind==='van',car=kind==='car',L=transit?10:truck?7:van?5.2:4,W=transit?2.7:2,H=transit?2.6:truck?2.4:van?2:1.1,color=kind==='tram'?C.teal:transit?C.yellow:truck?'#728ea0':van?C.cream:C.paint;
  const bottom=-H*.35,top=car?.35:transit?.8:.35,cabinTop=car?1.04:transit?2.15:van?1.85:1.8;
  block(g,C.iron,0,bottom,0,W*.85,.22,L*.94,.05,'steel');block(g,color,0,(bottom+top)/2,0,W,top-bottom,L,.1);
  const cabLength=car?L*.58:truck?2.15:L*.92,cabZ=truck?-L/2+1.1:car?.08:0,cabW=W*.9;
  // A tapered car greenhouse, closed van cargo shell and separate transit windows.
  if(car){
   const lower=.91,upper=.72,front=-.94,rear=1.2,roofFront=-.48,roofRear=.65;
   block(g,color,0,cabinTop+.025,.085,upper*2+.06,.1,roofRear-roofFront+.08,.045);
   for(let side of [-1,1]){
    panel(g,color,[[side*lower,top,front],[side*lower,top,rear],[side*upper,cabinTop,roofRear],[side*upper,cabinTop,roofFront]]);
    panel(g,C.glass,[[side*.907,.43,-.83],[side*.907,.43,1.07],[side*.754,.97,.61],[side*.754,.97,-.44]],'glass');
    rod(g,color,[side*.9,.4,.15],[side*.73,1,.15],.035,'paint');
    rod(g,color,[side*lower,top,front],[side*upper,cabinTop,roofFront],.035,'paint');rod(g,color,[side*lower,top,rear],[side*upper,cabinTop,roofRear],.035,'paint');
   }
   panel(g,C.glass,[[-.88,.42,-.902],[.88,.42,-.902],[.7,.98,-.493],[-.7,.98,-.493]],'glass');
   panel(g,C.glass,[[.88,.42,1.16],[-.88,.42,1.16],[-.7,.98,.68],[.7,.98,.68]],'glass');
   for(let x of [-.36,.36]){block(g,C.iron,x,.36,.1,.46,.13,.6,.055,'rubber');block(g,C.iron,x,.58,.4,.46,.45,.13,.055,'rubber');}ring(g,C.iron,-.38,.61,-.42,.13,.018,'z');
   for(let x of [-.72,.72])rod(g,C.iron,[x,.365,-1.8],[x,.365,-1.01],.006);block(g,color,0,.33,-1.49,1.8,.07,.85,.06);
  }else{
   block(g,color,0,(top+cabinTop)/2,cabZ,cabW,cabinTop-top,cabLength,.065);block(g,color,0,cabinTop+.055,cabZ,cabW+.08,.12,cabLength+.06,.055);
   for(let side of [-1,1]){
    if(transit){for(let z=-4.05;z<4.5;z+=1.13)block(g,C.glass,side*(cabW/2+.008),1.48,z,.012,.96,.95,.012,'glass');}
    else{const z=cabZ-cabLength/2+.66;block(g,C.glass,side*(cabW/2+.008),cabinTop-.48,z,.015,.74,1.04,.02,'glass');block(g,C.iron,side*(cabW/2+.017),cabinTop-.48,z+.31,.016,.74,.025);}
   }
   block(g,C.glass,0,cabinTop-.52,cabZ-cabLength/2-.014,cabW*.87,.82,.016,.025,'glass');
   if(van){for(let side of [-1,1]){block(g,C.iron,side*(cabW/2+.012),1.05,.95,.014,1.4,.018);tag(g,'FORGE|MOBILE SERVICE',side*(cabW/2+.02),1.03,.67,1.7,.7,side*Math.PI/2,'dark');}block(g,C.iron,0,1,cabZ+cabLength/2+.014,.02,1.6,.012);}
  }
  for(let x of [-W/2-.012,W/2+.012]){
   const side=Math.sign(x);block(g,C.iron,x,top-.1,0,.016,.035,L*.87);for(let z of car?[-.5,.65]:transit?[-3.4,3.1]:[-1,1.1]){block(g,C.iron,x,(bottom+top)/2,z,.014,top-bottom-.06,.018);block(g,C.steel,x+side*.015,top-.19,z+.17,.035,.045,.2,.012,'steel');}
   const mirrorZ=car?-.72:-L*.27;
   rod(g,C.iron,[car?side*.84:x,top+.33,mirrorZ],[x+side*.16,top+.42,mirrorZ],.022);block(g,color,x+side*.17,top+.42,mirrorZ,.12,.2,.22,.04);block(g,C.glass,x+side*.17,top+.42,mirrorZ+.116,.1,.15,.008,0,'glass');
  }
  for(let z of [-L*.31,L*.31])for(let x of [-W*.52,W*.52]){tire(g,x,-H*.38,z,.46,.28);const fender=part(g,new THREE.TorusGeometry(.51,.045,5,16,Math.PI),color,[x,-H*.38,z]);fender.rotation.y=Math.PI/2;}
  for(let end of [-1,1]){block(g,C.iron,0,bottom+.07,end*(L/2+.02),W*.94,.17,.13,.045);for(let x of [-W*.34,W*.34])block(g,end<0?C.cream:C.red,x,top-.17,end*(L/2+.015),.29,.19,.035,.035);tag(g,end<0?'MGN 024':'SALVAGE',0,bottom+.09,end*(L/2+.094),.46,.12,end<0?Math.PI:0,'paper');}
  for(let x=-W*.22;x<=W*.25;x+=.11)block(g,C.steel,x,top-.23,-L/2-.025,.035,.16,.025,0,'steel');
  for(let x of [-.3,.3])rod(g,C.iron,[x,top+.08,cabZ-cabLength/2-.017],[x+.25,top+.29,cabZ-cabLength/2-.017],.012);
  if(truck){block(g,C.cream,0,.8,1.08,W*1.04,2.7,L*.61,.045);for(let y=-.4;y<2;y+=.21)block(g,C.steel,0,y,L/2+.016,W*.98,.022,.016);for(let x of [-W*.52,W*.52]){tag(g,'FORGE|FREIGHT',x*1.005,1.2,1.2,2.3,.9,Math.sign(x)*Math.PI/2,'dark');rivets(g,x,2.06,-.7,10,.38,'z');}}
  if(van){for(let x of [-W/2-.019,W/2+.019])tag(g,'FORGE|SERVICE',x,.06,.45,1.5,.44,Math.sign(x)*Math.PI/2,'dark');for(let z of [-1.5,1.5])block(g,C.steel,0,cabinTop+.22,z,W*.94,.08,.12);}
  if(transit){for(let x of [-W/2-.02,W/2+.02]){block(g,C.cream,x,.02,0,.025,.13,L*.93);tag(g,kind==='tram'?'CITY|TRANSIT':'08|DOWNTOWN',x,.2,-2.4,1.35,.36,Math.sign(x)*Math.PI/2,'dark');}tag(g,'08  CITY',0,1.95,-L/2-.018,1.5,.25,Math.PI,'dark');block(g,C.iron,0,cabinTop+.2,.7,1.2,.2,2,.05);if(kind==='tram'){for(let z of [-1,1])rod(g,C.iron,[-.7,cabinTop+.15,z],[.7,cabinTop+.6,z],.035);rod(g,C.steel,[-1,cabinTop+.6,0],[1,cabinTop+.6,0],.04);}}
 }
 function batch(source){
  source.updateMatrixWorld(true);const groups=new Map();
  source.traverse(m=>{if(!m.isMesh)return;const mat=m.material,key=mat.uuid;let entry=groups.get(key);if(!entry){entry={material:mat,parts:[]};groups.set(key,entry);}entry.parts.push(m);});
  const result=new THREE.Group();let rawParts=0,triangles=0;
  for(const {material,parts} of groups.values()){
   const attrs={position:[],normal:[],uv:[]},morph=[];let hasMorph=false;
   for(const m of parts){rawParts++;const geo=m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone();geo.applyMatrix4(m.matrixWorld);for(const key of Object.keys(attrs))attrs[key].push(...geo.attributes[key].array);if(geo.morphAttributes.position?.length){hasMorph=true;morph.push(...geo.morphAttributes.position[0].array);}geo.dispose();}
   const geo=new THREE.BufferGeometry();for(const key of Object.keys(attrs))geo.setAttribute(key,new THREE.Float32BufferAttribute(attrs[key],key==='uv'?2:3));geo.computeBoundingBox();geo.computeBoundingSphere();if(hasMorph)geo.morphAttributes.position=[new THREE.Float32BufferAttribute(morph,3)];
   const mesh=new THREE.Mesh(geo,material);mesh.castShadow=mesh.receiveShadow=true;result.add(mesh);triangles+=attrs.position.length/9;
  }
  result.userData={rawParts,triangles};return result;
 }
 function build(kind){if(!templates[kind])templates[kind]=batch(raw(kind));return templates[kind].clone();}
 return {build,raw,batch,labels};
})();
function model(kind){return DetailedModels.build(kind);}
