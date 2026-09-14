/* District art, atmospheric sky and a depth-aware finishing pass. */
'use strict';
const WorldArt=(()=>{
 const decor=new T.Group(),water=[];let clock=0;
 const b=(color,x,y,z,w,h,d,metal=.1)=>box(decor,color,x,y,z,w,h,d,metal);
 const c=(color,x,y,z,r,h)=>cylinder(decor,color,x,y,z,r,h);
 // A continuous landscape prevents the world from looking like floating cardboard slabs.
 const grassCanvas=document.createElement('canvas');grassCanvas.width=grassCanvas.height=512;const gx=grassCanvas.getContext('2d');gx.fillStyle='#819563';gx.fillRect(0,0,512,512);let seed=1831;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<15000;i++){gx.fillStyle=i%3?'rgba(42,68,29,.16)':'rgba(222,214,137,.2)';gx.fillRect(rnd()*512,rnd()*512,1,rnd()*4+1);}const grassMap=new T.CanvasTexture(grassCanvas);grassMap.colorSpace=T.SRGBColorSpace;grassMap.wrapS=grassMap.wrapT=T.RepeatWrapping;grassMap.repeat.set(160,100);
 const landscape=new T.Mesh(new T.PlaneGeometry(3400,2200),new T.MeshStandardMaterial({map:grassMap,color:'#b4c598',roughness:1}));landscape.rotation.x=-Math.PI/2;landscape.position.set(720,-.5,0);landscape.receiveShadow=true;scene.add(landscape);
 // Individual blades catch light along the verges while one instanced draw keeps them inexpensive.
 const bladeGeo=new T.BufferGeometry();bladeGeo.setAttribute('position',new T.Float32BufferAttribute([-.055,0,0,.055,0,0,0,.7,0,0,0,-.055,0,0,.055,0,.7,0],3));bladeGeo.computeVertexNormals();
 const grassBlades=new T.InstancedMesh(bladeGeo,new T.MeshStandardMaterial({color:'#6f8f4d',roughness:1,side:T.DoubleSide,vertexColors:true}),2200),dummy=new T.Object3D();
 const verge=x=>x<25?25:x<94?39:x<211?51:x<410?84:x<650?119:x<1020?165:x<1530?208:252;
 for(let i=0;i<2200;i++){const x=-70+rnd()*2260,z=(rnd()>.5?1:-1)*(verge(x)+rnd()*70);dummy.position.set(x,-.48,z);dummy.rotation.set(0,rnd()*Math.PI,.12*(rnd()-.5));const s=.55+rnd()*.9;dummy.scale.set(s,s,s);dummy.updateMatrix();grassBlades.setMatrixAt(i,dummy.matrix);grassBlades.setColorAt(i,new T.Color(i%3?'#789a55':'#a0ad5f'));}grassBlades.receiveShadow=true;scene.add(grassBlades);
 // Workshop: structural beams, wall panels, ceiling lamps and constructed storage fixtures.
 for(let x=-24;x<25;x+=6){b('#435f61',x,3.2,-21.62,.14,6.4,.18,.5);b('#c0c4b5',x,1.1,-21.58,5.8,2.2,.08);}
 for(let x of [-18,-6,6,18]){b('#485c60',x,6.3,-7,.16,.2,29,.5);b('#efdbad',x,5.95,-5,2.8,.08,.5);b('#425b5b',x,6.05,-5,3,.12,.7,.6);}
 for(const [x,z,w,d] of [[-12,-8,3,8],[-12,7,3,8],[11,-11,9,2]]){
  for(let y of [.12,.95,1.9])b('#b29164',x,y,z,w+.12,.1,d+.1);
  for(let dx of [-w/2,w/2])for(let dz of [-d/2,d/2])b('#33484c',x+dx,1,z+dz,.08,2.1,.08,.6);
  for(let i=0;i<5;i++){const px=x-w*.35+(i%3)*w*.3,pz=z-d*.33+Math.floor(i/3)*d*.6;b('#a28e6c',px,2.2,pz,w*.23,.48,d*.2);b('#d3c69b',px,2.2,pz+d*.102,w*.16,.13,.015);}
 }
 // Yard gravel, marked loading bays and timber fence boards.
 b('#887e67',60,.025,0,68,.02,64);for(let x=30;x<94;x+=12){for(let z of [-26,26]){b('#d3c5a0',x,.043,z,7,.012,.1);b('#d3c5a0',x-3.5,.043,z+Math.sign(z)*3,.1,.012,6);}}
 for(let x=28;x<90;x+=1.1)for(let z of [-34,34])b('#9b815c',x,.8,z,.8,1.6,.08);
 // Asphalt roads and proper curbs, crosswalks, parking paint and drain grates.
 b('#3c4d53',251,.03,0,310,.045,49);for(let z of [-25.2,25.2]){b('#c4c7b9',251,.11,z,310,.2,.45);b('#e2dfc9',251,.053,z*.94,309,.015,.16);}
 for(let x of [119,164,201,261,321,381])for(let dx=-3;dx<=3;dx++)b('#e9e4cf',x+dx*.85,.059,0,.45,.012,47);
 for(let x=107;x<405;x+=14)for(let z of [-19,19]){b('#cbd0c1',x,.06,z,.1,.014,5);for(let dz=-.5;dz<=.5;dz+=.18)b('#263a3f',x,.065,z+dz,1.3,.018,.065,.6);}
 // Facades: framed windows, entrance doors, roof cornices and utility equipment.
 for(const o of obstacles.filter(o=>o.x>=100&&o.x<410)){
  const face=o.z-Math.sign(o.z)*o.d/2,front=face-Math.sign(o.z)*.04;
  b('#5f7778',o.x,o.top-.2,o.z,o.w+.25,.3,o.d+.25);
  for(let x=o.x-o.w*.38;x<o.x+o.w*.4;x+=2.6)for(let y=3;y<o.top-1.5;y+=3.2){b('#364d56',x,y,front,1.6,1.9,.08);b('#86afb5',x,y+.1,front-Math.sign(o.z)*.055,1.38,1.56,.025);b('#d8d1b8',x,y-.92,front-Math.sign(o.z)*.1,1.8,.09,.24);b('#b5bcae',x,y,front-Math.sign(o.z)*.075,.055,1.65,.035);}
  b('#31474b',o.x,1,front,1.5,2,.09);b('#aeb5a8',o.x,o.top+.4,o.z,2.4,.8,2);for(let dx=-.8;dx<=.8;dx+=.25)b('#425a5d',o.x+dx,o.top+.82,o.z,.08,.04,1.65);
 }
 // Static trees and low shrubs sit beyond the playable boundaries.
 const leafGeo=new T.IcosahedronGeometry(1,1);
 for(let x=95;x<1510;x+=22){const z=(x<211?54:x<410?90:x<650?129:x<1020?176:226);for(let side of [-1,1]){
  if(x>650&&x<1020)continue;const sz=2.4+rnd()*2.3;c('#6a6050',x,2,z*side,.22,4);for(let i=0;i<3;i++){const m=mesh(leafGeo,['#627e54','#789557','#8a9e61'][i],[x+(i-1)*1.1,4.1+i*.55,z*side],[sz,sz*.83,sz],decor);}
 }}
 // Rail ballast and warehouse siding.
 for(let z of [-65,65])b('#706e65',530,-.005,z,226,.035,7);
 for(let x=435;x<640;x+=45){for(let dx=-13;dx<14;dx+=1.4)b('#899b9a',x+dx,7,-107.85,.07,10,.04);b('#4a6366',x,12.15,-112,29,.3,9);}
 for(let x=445;x<640;x+=28){b('#7a5138',x,.17,-68,.16,.18,5,.72);b('#7a5138',x,.17,68,.16,.18,5,.72);}
 // Dock markings, rubber quay fenders, cargo staging grids and water highlights.
 for(let x=671;x<1020;x+=24)for(let z of [-118,118]){b('#d6d3ab',x,.035,z,15,.022,.16);b('#d6d3ab',x-7.5,.035,z,.16,.022,16);}
 for(let x=660;x<1020;x+=10)for(let z of [-151,151]){b('#354b53',x,-.3,z,.8,1.4,.55);b('#c1bfa7',x,.12,z,9.5,.24,.6);}
 for(let x=680;x<1020;x+=34)for(let z of [-151,151])b('#7a5138',x,.18,z,.9,.28,.62,.8);
 // Airport runway, taxi lines, apron squares and approach lighting.
 b('#35474e',1275,.03,0,505,.045,58);for(let z of [-30,30])b('#e7e1c7',1275,.061,z,503,.015,.3);
 for(let x=1040;x<1518;x+=19)b('#efead8',x,.063,0,9,.012,.65);
 for(let x of [1047,1495])for(let z=-22;z<=22;z+=5)b('#eeeadb',x,.065,z,14,.015,2.2);
 for(let x=1035;x<1520;x+=15)for(let z of [-32,32]){c('#394f54',x,.16,z,.14,.32);b('#ffe4a1',x,.34,z,.3,.055,.3);}
 for(let x=1050;x<1510;x+=48)for(let z of [-95,95]){b('#e1bf68',x,.04,z,27,.025,.18);b('#e1bf68',x-13.5,.04,z,.18,.025,33);}
 // Layered hills, tree lines and a distant city keep every camera direction grounded.
 for(const side of [-1,1])for(let i=0;i<35;i++){const m=mesh(new T.SphereGeometry(1,18,11),i%3?'#8ba596':'#718e82',[-120+i*70,-38,side*(440+rnd()*120)],[100+rnd()*105,68+rnd()*70,105+rnd()*85],decor);m.rotation.y=rnd()*6;}
 for(let x=120;x<520;x+=22)for(const side of [-1,1]){const h=28+rnd()*60;b(x%44?'#728482':'#647777',x,h/2,side*(245+rnd()*35),14+rnd()*12,h,18);for(let y=8;y<h-5;y+=9)b('#86a9ac',x,y,side*(235+rnd()*2),7,3,.08);}
 for(let x=430;x<960;x+=42)for(const side of [-1,1]){c('#6b5745',x,3,side*(205+rnd()*22),.35,6);mesh(leafGeo,x%84?'#58754b':'#6d864e',[x,8,side*(205+rnd()*22)],[5+rnd()*3,7+rnd()*4,5+rnd()*3],decor);}
 const packed=DetailedModels.batch(decor);scene.add(packed);
 const skyMat=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{time:{value:0}},vertexShader:'varying vec3 vDir;void main(){vDir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`
 varying vec3 vDir;uniform float time;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
 void main(){vec3 d=normalize(vDir);float h=max(d.y,0.);vec3 color=mix(vec3(.61,.76,.83),vec3(.12,.36,.59),pow(h,.58));vec2 uv=d.xz/max(.15,d.y)*2.+vec2(time*.006,0);float cloud=noise(uv)*.55+noise(uv*2.)*.3+noise(uv*4.)*.15;float mask=smoothstep(.52,.72,cloud)*smoothstep(.015,.12,d.y);color=mix(color,vec3(.94,.94,.85),mask*.72);float sun=pow(max(dot(d,normalize(vec3(-.45,.8,.34))),0.),180.);color+=vec3(.55,.34,.12)*sun;gl_FragColor=vec4(color,1.);}
 `});
 const sky=new T.Mesh(new T.SphereGeometry(2350,24,16),skyMat);sky.frustumCulled=false;sky.renderOrder=-100;scene.add(sky);
 scene.background=new T.Color('#b7ccd0');scene.fog.color.set('#b7ccd0');scene.children.filter(o=>o.isHemisphereLight).forEach(o=>{o.color.set('#d9edf2');o.groundColor.set('#625447');o.intensity=1.32;});sun.color.set('#ffd39a');sun.intensity=3.45;sun.shadow.radius=3;sun.shadow.blurSamples=8;const fill=new T.DirectionalLight('#8ebbd0',.72);fill.position.set(24,18,-32);scene.add(fill);renderer.toneMappingExposure=1.06;
 environment.traverse(m=>{if(m.isMesh&&m.material.map&&m.material.color.getHexString()==='397a89')water.push(m.material.map);});
 return {update(dt,reduced){if(!reduced)clock+=dt;sky.position.copy(camera.position);skyMat.uniforms.time.value=clock;for(const map of water)map.offset.x=clock*.004;},stats:{components:packed.userData.rawParts,batches:packed.children.length,grassBlades:2200}};
})();

const GraphicsPass=(()=>{
 const supported=renderer.capabilities.isWebGL2&&renderer.extensions.has('EXT_color_buffer_float');
 const target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,depthBuffer:true});target.depthTexture=new T.DepthTexture(1,1,T.UnsignedIntType);target.samples=supported?4:0;
 const uniforms={colorTex:{value:target.texture},depthTex:{value:target.depthTexture},resolution:{value:new T.Vector2(1,1)},nearPlane:{value:.05},farPlane:{value:2800},exposure:{value:1.02}};
 const material=new T.ShaderMaterial({uniforms,depthTest:false,depthWrite:false,toneMapped:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`
 varying vec2 vUv;uniform sampler2D colorTex,depthTex;uniform vec2 resolution;uniform float nearPlane,farPlane,exposure;
 float viewDepth(vec2 uv){float z=texture2D(depthTex,uv).x;return nearPlane*farPlane/(farPlane-z*(farPlane-nearPlane));}
 vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
 void main(){vec3 color=texture2D(colorTex,vUv).rgb;float d=viewDepth(vUv),ao=0.;float radius=clamp(180./max(d,1.),2.,12.);for(int i=0;i<8;i++){float a=float(i)*.785398;vec2 offset=vec2(cos(a),sin(a))*radius/resolution;float other=viewDepth(clamp(vUv+offset,.001,.999));float delta=d-other;ao+=smoothstep(.015,.18,delta)*(1.-smoothstep(.25,2.,delta));}color*=1.-ao*.032;vec2 q=vUv-.5;color*=1.-dot(q,q)*.13;color=aces(color*exposure);color=pow(color,vec3(1./2.2));gl_FragColor=vec4(color,1.);}
 `});const postScene=new T.Scene(),postCamera=new T.Camera();postScene.add(new T.Mesh(new T.PlaneGeometry(2,2),material));let width=0,height=0;
 return {supported,render(){if(settings.quality==='low'||!supported){renderer.render(scene,camera);return;}const size=renderer.getDrawingBufferSize(new T.Vector2());if(size.x!==width||size.y!==height){width=size.x;height=size.y;target.setSize(width,height);uniforms.resolution.value.copy(size);}uniforms.nearPlane.value=camera.near;uniforms.farPlane.value=camera.far;renderer.info.autoReset=false;renderer.info.reset();renderer.setRenderTarget(target);renderer.render(scene,camera);renderer.setRenderTarget(null);renderer.render(postScene,postCamera);renderer.info.autoReset=true;},get size(){return[width,height];}};
})();
