/* Fixed-core, persistent-transform compound pile. No scaling or radial growth of old parts. */
'use strict';
class MagneticPile {
  constructor(THREE, group, coreRadius=.32) {
    this.T=THREE; this.group=group; this.coreRadius=coreRadius;
    this.parts=[]; this.proxies=[]; this.mass=0; this.extent=coreRadius;
  }
  describe(mesh) {
    const T=this.T;
    mesh.updateMatrixWorld(true);
    const bounds=new T.Box3().setFromObject(mesh), center=bounds.getCenter(new T.Vector3()), size=bounds.getSize(new T.Vector3());
    // Root is at the origin when called. A few overlapping spheres follow long/wide objects.
    const smallest=Math.max(.08,Math.min(size.x,size.y,size.z));
    const spacing=Math.max(smallest,Math.max(size.x,size.y,size.z)/4);
    const nx=Math.min(4,Math.max(1,Math.ceil(size.x/spacing))),ny=Math.min(3,Math.max(1,Math.ceil(size.y/spacing))),nz=Math.min(4,Math.max(1,Math.ceil(size.z/spacing)));
    const cells=[];const r=Math.max(.04,Math.min(Math.max(size.x/nx,size.y/ny,size.z/nz)*.53,Math.max(...size.toArray())*.6));
    for(let x=0;x<nx;x++)for(let y=0;y<ny;y++)for(let z=0;z<nz;z++)cells.push({center:new T.Vector3(bounds.min.x+(x+.5)*size.x/nx,bounds.min.y+(y+.5)*size.y/ny,bounds.min.z+(z+.5)*size.z/nz),r});
    return {center,size,cells,volume:Math.max(.001,size.x*size.y*size.z),bound:size.length()/2};
  }
  attach(item, impact) {
    const T=this.T, inverse=this.group.quaternion.clone().invert();
    let direction=impact.clone().normalize().applyQuaternion(inverse);
    if(direction.lengthSq()<.01)direction.set(1,0,0);
    const q=item.mesh.quaternion.clone().premultiply(inverse);
    const cells=item.geometryInfo.cells.map(c=>({center:c.center.clone().applyQuaternion(q),r:c.r}));
    const all=[{center:new T.Vector3(),r:this.coreRadius},...this.proxies];
    let best=null;
    // Prefer the actual contact hemisphere, but pack adjacent hollows instead of a single spire.
    for(let sample=0;sample<32;sample++) {
      const a=sample*2.399963, y=1-2*(sample+.5)/32;
      const candidate=sample===0?direction.clone():new T.Vector3(Math.cos(a)*Math.sqrt(1-y*y),y,Math.sin(a)*Math.sqrt(1-y*y)).lerp(direction,.38).normalize();
      let distance=0;
      for(const cell of cells)for(const existing of all) {
        const delta=existing.center.clone().sub(cell.center),projection=delta.dot(candidate),perp=delta.lengthSq()-projection*projection;
        // Proxy spheres intentionally overlap: the visible crushed meshes should
        // read as one compressed mass rather than ornaments hovering on a shell.
        const combined=(existing.r+cell.r)*.54;
        if(perp<combined*combined)distance=Math.max(distance,projection+Math.sqrt(combined*combined-perp));
      }
      distance=Math.max(0,distance);
      const root=candidate.clone().multiplyScalar(distance),outer=Math.max(...cells.map(c=>c.center.clone().add(root).length()+c.r));
      const score=outer+root.length()*.035+(1-candidate.dot(direction))*Math.max(.04,outer*.045);
      if(!best||score<best.score)best={score,root,outer};
    }
    item.mesh.removeFromParent();this.group.add(item.mesh);item.mesh.position.copy(best.root);item.mesh.quaternion.copy(q);
    const part={item,position:best.root.clone(),quaternion:q.clone(),cells:cells.map(c=>({center:c.center.add(best.root),r:c.r,id:item.id}))};
    this.parts.push(part);this.rebuild();return part;
  }
  rebuild() {
    this.proxies=this.parts.flatMap(a=>a.cells);
    this.mass=this.parts.reduce((sum,a)=>sum+a.item.mass,0);
    this.extent=Math.max(this.coreRadius,...this.proxies.map(c=>c.center.length()+c.r));
    // Movement radius follows the actual compact pile; isolated protrusions still collide.
    const radii=this.proxies.map(c=>c.center.length()+c.r).sort((a,b)=>a-b);
    this.rollRadius=radii.length?Math.max(this.coreRadius,radii[Math.floor(radii.length*.65)]):this.coreRadius;
    // Deeply buried meshes cannot contribute to the silhouette, but drawing all
    // of them makes very large piles expensive. Physics and saved parts remain.
    const visualLimit=440,latest=40;
    if(this.parts.length>visualLimit){
      const outer=new Set(this.parts.map((part,index)=>({index,r:Math.max(...part.cells.map(c=>c.center.length()+c.r))})).sort((a,b)=>b.r-a.r).slice(0,visualLimit-latest).map(x=>x.index));
      for(let i=0;i<this.parts.length;i++)this.parts[i].item.mesh.visible=outer.has(i)||i>=this.parts.length-latest;
    }else for(const part of this.parts)part.item.mesh.visible=true;
  }
  worldProxies() {
    const q=this.group.quaternion;
    return [{center:new this.T.Vector3(),r:this.coreRadius,id:-1},...this.proxies.map(c=>({center:c.center.clone().applyQuaternion(q),r:c.r,id:c.id}))];
  }
  detach(number) {
    const removed=this.parts.splice(Math.max(0,this.parts.length-number));
    for(const part of removed)part.item.mesh.visible=true;
    this.rebuild();return removed;
  }
  clear(){for(const a of this.parts)a.item.mesh.removeFromParent();this.parts=[];this.rebuild();this.group.quaternion.identity();}
}
window.MagneticPile=MagneticPile;
