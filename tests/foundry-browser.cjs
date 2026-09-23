const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),path=require('path'),assert=require('assert');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
 await page.goto(process.env.GAME_URL||'file:///'+path.resolve(__dirname,'../prototypes/m1/index.html').replaceAll('\\','/'));await page.waitForFunction(()=>window.Magnet3D);
 const report=await page.evaluate(()=>{
  reset();const old=[];launchLayout(kind=>old.push(kind));if(old.length!==1116||old.some((kind,index)=>objects[index].kind!==kind))throw Error('Pre-foundry IDs changed');
  for(const goal of regions.slice(0,8).map(region=>region.goal))collect(objects.find(object=>object.kind===goal));save();const legacy=JSON.parse(JSON.stringify(saveData));legacy.stage=7;legacy.free=legacy.free.filter(object=>object.id<1116);saveData=legacy;restore();
  const migration={stage,count:pile.parts.length,total:objects.length,goals:[...goals]};
  const foundry=objects.filter(object=>object.region===8),kinds=[...new Set(foundry.map(object=>object.kind))],goal=foundry.find(object=>object.goal);
  for(const object of foundry.filter(object=>!object.goal&&!object.collected))collect(object);const reachable=power>=goal.need,powerBeforeGoal=power;collect(goal);
  const crushed=['transformer','bulldozer','turbine','ladle','blastfurnace'].map(kind=>{const intact=pile.describe(model(kind)),compact=pile.describe(CrushWorkshop.build(kind));return{kind,height:compact.size.y/intact.size.y,volume:compact.volume/intact.volume};});
  const result=Magnet3D.snapshot();p.set(2470,.35,0);yaw=Math.PI/2;pitch=.3;Magnet3D.draw(0);state='paused';
  return{old:old.length,migration,regions:regions.length,mapWidth:mapWidths.reduce((a,b)=>a+b,0),foundry:foundry.length,kinds,reachable,powerBeforeGoal,goal:goal.kind,result,crushed,notes:FieldNotes.snapshot()};
 });
 assert.equal(report.migration.stage,8);assert.equal(report.migration.total,1770);assert.equal(report.regions,12);assert.equal(report.mapWidth,260);assert.equal(report.foundry,181);assert.equal(report.goal,'blastfurnace');assert(report.reachable);assert.equal(report.result.state,'play');assert.equal(report.result.stage,9);assert.equal(report.result.coreRadius,.32);assert.equal(report.notes.contracts.length,12);
 for(const kind of ['transformer','bulldozer','turbine','ladle','blastfurnace'])assert(report.kinds.includes(kind));
 for(const model of report.crushed){assert(model.height<.85,model.kind+' height');assert(model.volume<1,model.kind+' volume');}
 await page.screenshot({path:'test-results/foundry-district.png'});assert.deepEqual(errors,[]);console.log(JSON.stringify({...report,errors},null,2));await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
