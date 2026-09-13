const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const path=require('path'),fs=require('fs'),assert=require('assert');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.GAME_URL||'file:///'+path.resolve(__dirname,'../prototypes/m1/growth-first.html').replaceAll('\\','/'));
 await page.waitForFunction(()=>window.Magnet3D);await page.screenshot({path:'test-results/growth-start.png'});
 await page.keyboard.press('Enter');await page.keyboard.down('KeyD');await page.keyboard.down('Space');await page.waitForTimeout(600);await page.keyboard.up('KeyD');await page.keyboard.up('Space');
 assert((await page.evaluate(()=>Magnet3D.snapshot())).count>0,'keyboard pickups');
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>Magnet3D.snapshot().state),'paused');await page.keyboard.press('Enter');await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal(await page.evaluate(()=>Magnet3D.snapshot().state),'paused');await page.keyboard.press('Enter');
 const result=await page.evaluate((shed)=>{
  Magnet3D.reset();const trail=[];
  function go(x,z,max=1800){for(let i=0;i<max;i++){const s=Magnet3D.snapshot(),p=s.position,v=s.velocity,dx=x-p[0],dz=z-p[2];if(Math.hypot(dx,dz)<.16)return true;let ax=dx-v[0]*.1,az=dz-v[2]*.1,n=Math.max(1,Math.hypot(ax,az));Magnet3D.step({x:ax/n,z:az/n,attract:true});if(Magnet3D.snapshot().state==='result')return true;}return false;}
  function seek(table,limit){for(let j=0;j<limit;j++){const s=Magnet3D.snapshot(),p=s.position;let target=Magnet3D.objects.filter(o=>!o.collected&&o.kind!=='bench'&&o.need<=s.radius&&(table?o.pos.y>1.5:o.pos.y<1.5)).sort((a,b)=>Math.hypot(a.pos.x-p[0],a.pos.z-p[2])-Math.hypot(b.pos.x-p[0],b.pos.z-p[2]))[0];if(!target)return;go(target.pos.x,target.pos.z);for(let i=0;i<60;i++)Magnet3D.step({x:0,z:0,attract:true});if(Magnet3D.snapshot().radius>=1.8&&!table)return;}}
  seek(true,35);if(shed)Magnet3D.repel();trail.push({stage:'table',...Magnet3D.snapshot()});Magnet3D.draw(0);
  go(4,0);go(7,0);go(14,0);trail.push({stage:'ramp',...Magnet3D.snapshot()});
  go(18,0);for(let lap=0;lap<2&&Magnet3D.snapshot().radius<1.8;lap++){for(let i=1;i<=32&&Magnet3D.snapshot().radius<1.8;i++){let a=i*Math.PI/16;go(Math.cos(a)*18,Math.sin(a)*15);}}trail.push({stage:'grown',...Magnet3D.snapshot()});
  // Approach the bench from the nearest exposed floor edge.
  const p=Magnet3D.snapshot().position;if(Math.abs(p[0])>7)go(Math.sign(p[0])*8,6);go(0,6);go(0,4);for(let i=0;i<180;i++)Magnet3D.step({x:0,z:-1,attract:true});
  trail.push({stage:'final',...Magnet3D.snapshot()});Magnet3D.draw(0);return trail;
 },Boolean(process.env.SHED));console.log(JSON.stringify(result,null,2));await page.screenshot({path:'test-results/growth-result.png'});
 assert.equal(result.at(-1).state,'result','complete growth route');assert(result.find(r=>r.stage==='ramp').floorReached,'descended to floor');
 await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>Magnet3D.snapshot().count),0);
 const recovery=await page.evaluate(()=>{for(let i=0;i<240;i++)Magnet3D.step({x:1,z:0,attract:true});const before=Magnet3D.snapshot();Magnet3D.repel();const after=Magnet3D.snapshot();for(let i=0;i<120;i++)Magnet3D.step({x:0,z:0,attract:true});return{before,after,late:Magnet3D.snapshot()}});assert(recovery.after.count<recovery.before.count);assert.equal(recovery.after.total,recovery.before.total);
 await page.screenshot({path:'test-results/growth-play.png'});assert.equal(errors.length,0);console.log(JSON.stringify({recovery,errors,browser:browser.version()},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
