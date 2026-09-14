const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),path=require('path'),assert=require('assert');

(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
 await page.goto(process.env.GAME_URL||'file:///'+path.resolve(__dirname,'../prototypes/m1/index.html').replaceAll('\\','/'));
 await page.waitForFunction(()=>window.Magnet3D);
 const samples=await page.evaluate(()=>{
  const cases=[
   {label:'bare',power:.32,roll:.32,extent:.32},
   {label:'workshop',power:2,roll:1.2,extent:2.4},
   {label:'city',power:8,roll:3.8,extent:12},
   {label:'launch',power:25,roll:9,extent:35}
  ],out=[];
  for(const sample of cases){
   reset();stage=7;state='play';
   for(const object of objects){object.pos.set(-10000,-1000,-10000);object.mesh.position.copy(object.pos);}
   power=sample.power;pile.rollRadius=sample.roll;pile.extent=sample.extent;p.set(500,.32,0);v.set(0,0,0);
   const start=p.clone(),profile=Magnet3D.motion();
   for(let tick=0;tick<240;tick++)Magnet3D.step({x:1,z:0});
   const distance=Math.hypot(p.x-start.x,p.z-start.z),velocity=Math.hypot(v.x,v.z);
   out.push({...sample,...profile,average:distance/2,velocity,screenRate:profile.cruise/profile.camera});
  }
  return out;
 });
 for(let index=1;index<samples.length;index++)assert(samples[index].cruise>samples[index-1].cruise,'cruise speed must increase with pile size');
 assert(samples[0].cruise>=7.5,'the starting magnet should get moving promptly');
 assert(samples.at(-1).cruise>=27,'late districts need a useful cruising speed');
 assert(samples.at(-1).response>=6.5&&samples.at(-1).response<samples[0].response,'large piles should feel heavier without becoming unresponsive');
 assert(samples.at(-1).camera<65,'camera pullback must stay controlled');
 assert(samples.at(-1).screenRate>=samples[0].screenRate*.4,'late-game screen motion should retain at least 40% of the starting pace');
 for(const sample of samples){assert(sample.velocity>=sample.cruise*.99,'velocity should settle near cruise speed');assert(sample.average>=sample.cruise*.9,'acceleration should not consume much of a traversal');}
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({samples,errors},null,2));
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
