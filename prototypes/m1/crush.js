/* Permanent, shared crumpled geometry. Root transforms and magnet size stay fixed. */
'use strict';
const CrushWorkshop=(()=>{
 const profiles={car:[.52,.88,.2],van:[.44,.83,.25],bus:[.48,.78,.22],truck:[.46,.8,.24],tram:[.5,.75,.24],container:[.5,.7,.32],tower:[.4,.8,.28],locker:[.62,.85,.12],barrel:[.68,.85,.12],skip:[.7,.85,.13],kiosk:[.55,.8,.2],forklift:[.7,.87,.15],sculpture:[.52,.82,.22]};
 Object.assign(profiles,{toolbox:[.6,.85,.08],vending:[.5,.8,.14],trafficlight:[.6,.85,.15],excavator:[.55,.8,.25],tankcar:[.55,.8,.22],locomotive:[.5,.8,.25],tugboat:[.55,.78,.3],crane:[.52,.8,.4],freighter:[.48,.8,.5]});
 Object.assign(profiles,{suitcase:[.6,.9,.07],baggagecart:[.6,.8,.12],fueltruck:[.5,.8,.2],propplane:[.5,.75,.25],controltower:[.5,.8,.25],airliner:[.48,.75,.5]});
 Object.assign(profiles,{satellite:[.48,.78,.2],rover:[.52,.8,.18],radar:[.45,.76,.22],launchtruck:[.46,.75,.3],rocket:[.42,.82,.45]});
Object.assign(profiles,{transformer:[.48,.78,.22],bulldozer:[.5,.76,.28],turbine:[.46,.75,.35],ladle:[.5,.78,.28],blastfurnace:[.38,.8,.55]});
Object.assign(profiles,{haultruck:[.48,.78,.26],drillrig:[.45,.76,.3],rockcrusher:[.5,.74,.3],bucketwheel:[.38,.72,.5],penstock:[.48,.7,.4],spillgate:[.42,.82,.3],damcrane:[.35,.72,.48],hydrogenerator:[.4,.76,.5],monorail:[.46,.72,.26],towercrane:[.34,.7,.5],officeblock:[.38,.76,.5],megaspire:[.3,.72,.58]});
 const templates={},animating=new Set();
 function build(kind){
  if(templates[kind])return templates[kind].clone();
  const source=DetailedModels.raw(kind),g=new T.Group(),profile=profiles[kind];source.updateMatrixWorld(true);
  const bounds=new T.Box3().setFromObject(source),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
  source.traverse(part=>{
   if(!part.isMesh)return;
   // Subdivision creates actual accordion creases instead of shrinking an intact box.
   const dimensions=part.geometry.type==='BoxGeometry'?part.geometry.parameters:null;
   const geo=dimensions?new T.BoxGeometry(dimensions.width,dimensions.height,dimensions.depth,3,3,dimensions.depth>1?12:3):part.geometry.clone();geo.applyMatrix4(part.matrixWorld);
   const a=geo.attributes.position,original=a.clone();
   for(let i=0;i<a.count;i++){
    let x=a.getX(i),y=a.getY(i)-center.y,z=a.getZ(i);const height=y/size.y,along=z/Math.max(size.z,.1);
    const fold=Math.sin(along*Math.PI*10)*profile[2];
    x=x*(1+.1*Math.cos(along*Math.PI*8))+fold*(.3+Math.abs(height));
    y=y*profile[0]+Math.sin(along*Math.PI*6+.5)*size.y*.035;
    z=z*profile[1]+Math.sin(height*7)*size.z*.025;
    if(kind==='tower'){x+=height*size.x*.28;y+=Math.cos(x*1.5)*.13;}
    if(['car','van','bus','truck','tram'].includes(kind)&&height>.15){x+=size.x*.13;y-=size.y*.06;}
    a.setXYZ(i,x,y,z);
   }
   geo.computeVertexNormals();geo.computeBoundingBox();geo.computeBoundingSphere();geo.morphAttributes.position=[original];
   const m=new T.Mesh(geo,part.material);m.castShadow=m.receiveShadow=true;g.add(m);
  });
  const packed=DetailedModels.batch(g);packed.userData.crushed=true;templates[kind]=packed;return packed.clone();
 }
 function apply(item,animate=false){
  if(item.crushed||!profiles[item.kind])return false;
  const old=item.mesh,replacement=build(item.kind),info=pile.describe(replacement);
  replacement.position.copy(old.position);replacement.quaternion.copy(old.quaternion);
  if(old.parent)old.parent.add(replacement);old.removeFromParent();item.mesh=replacement;item.geometryInfo=info;item.bound=info.bound;item.crushed=true;
  if(animate){replacement.userData.crushTime=.3;replacement.traverse(m=>{if(m.morphTargetInfluences)m.morphTargetInfluences[0]=1;});animating.add(replacement);}return true;
 }
 function update(dt){for(const g of animating){g.userData.crushTime=Math.max(0,g.userData.crushTime-dt);g.traverse(m=>{if(m.morphTargetInfluences)m.morphTargetInfluences[0]=Math.pow(g.userData.crushTime/.3,2);});if(!g.userData.crushTime||!g.parent)animating.delete(g);}}
 return {apply,build,profiles,update};
})();
