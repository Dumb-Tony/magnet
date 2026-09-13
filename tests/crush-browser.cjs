const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),path=require('path'),assert=require('assert');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file:///'+path.resolve(__dirname,'../prototypes/m1/index.html').replaceAll('\\','/'));await page.waitForFunction(()=>window.Magnet3D);
 const report=await page.evaluate(()=>{
  Magnet3D.reset();Magnet3D.pause();
  const kinds=Object.keys(CrushWorkshop.profiles),models=kinds.map(kind=>{const a=pile.describe(model(kind)),b=pile.describe(CrushWorkshop.build(kind));return{kind,intact:a.volume,crushed:b.volume,heightRatio:b.size.y/a.size.y};});
  for(const kind of kinds)collect(objects.find(o=>o.kind===kind));CrushWorkshop.update(1);
  const before=pile.parts.map(a=>({id:a.item.id,crushed:a.item.crushed,volume:a.item.geometryInfo.volume,p:a.position.toArray()}));save();restore();
  const after=pile.parts.map(a=>({id:a.item.id,crushed:a.item.crushed,volume:a.item.geometryInfo.volume,p:a.position.toArray()}));
  state='play';repel();const shed=objects.filter(o=>o.crushed&&!o.collected).map(o=>o.id);save();restore();const restoredShed=objects.filter(o=>o.crushed&&!o.collected).map(o=>o.id);state='paused';
  return{models,before,after,shed,restoredShed,core:core.scale.x,textures:Object.keys(ScrapSurfaces.maps)};
 });
 assert.deepEqual(report.before,report.after);assert.deepEqual(report.shed,report.restoredShed);assert.equal(report.shed.length,5);assert.equal(report.core,.32);
 for(const m of report.models){assert(m.heightRatio<.85,m.kind+' should buckle');assert(m.crushed<m.intact,m.kind+' should occupy less space');}
 assert(report.textures.length>=8);
 await page.evaluate(()=>{
  const cover=document.createElement('div');cover.style='position:fixed;inset:0;z-index:100;background:#182c32;color:#f8eacb;font:16px Arial;padding:30px';document.body.append(cover);
  cover.innerHTML='<h1 style="margin:0 0 8px">UNDER PRESSURE</h1><p style="margin:0 0 20px">Intact → crushed · Same metal, tighter pile</p><div id="samples" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px"></div>';
  for(const kind of ['car','van','container','tower','bus','truck','forklift','sculpture']){
   const cell=document.createElement('div');cell.style='background:#263d43;border-radius:12px;overflow:hidden';document.getElementById('samples').append(cell);
   const title=document.createElement('div');title.style='padding:15px;text-transform:uppercase;letter-spacing:2px';title.textContent=defs[kind].label;cell.append(title);
   const r=new T.WebGLRenderer({antialias:true});r.setSize(326,330);r.setPixelRatio(1);r.outputColorSpace=T.SRGBColorSpace;cell.append(r.domElement);
   const s=new T.Scene();s.background=new T.Color('#263d43');s.add(new T.HemisphereLight(0xffffff,0x647681,2.5));const light=new T.DirectionalLight(0xffe4bf,3);light.position.set(-5,10,8);s.add(light);
   for(const [index,obj] of [model(kind),CrushWorkshop.build(kind)].entries()){
    const b=new T.Box3().setFromObject(obj),size=b.getSize(new T.Vector3()),center=b.getCenter(new T.Vector3()),scale=4/Math.max(...size.toArray());obj.scale.setScalar(scale);obj.position.set(-center.x*scale,index===0?2.6:-1.5,-center.z*scale);obj.position.y-=center.y*scale;obj.rotation.y=-.5;s.add(obj);
   }
   const cam=new T.PerspectiveCamera(40,326/330,.1,100);cam.position.set(8,5,13);cam.lookAt(0,.6,0);r.render(s,cam);
  }
 });
 await page.screenshot({path:path.resolve(__dirname,'../test-results/crush-lineup.png')});assert.deepEqual(errors,[]);console.log(JSON.stringify({...report,errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
