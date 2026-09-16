/* Optional discovery goals reward exploration without blocking district exits. */
'use strict';
const FieldNotes=(()=>{
 const contracts=[
  {name:'The right tools',detail:'Find 10 wrenches, drills or toolboxes.',kinds:['tool','drill','toolbox'],target:10},
  {name:'Workshop sweep',detail:'Collect 60 pieces from the workshop.',region:0,target:60},
  {name:'Heavy industry',detail:'Collect 12 barrels or scrap skips.',kinds:['barrel','skip'],target:12},
  {name:'Clear the parking',detail:'Collect 15 cars, vans or vending machines.',kinds:['car','van','vending'],target:15},
  {name:'City landmarks',detail:'Find 5 water towers, trams or skyline spires.',kinds:['tower','tram','sculpture'],target:5},
  {name:'Working on the railroad',detail:'Collect 12 excavators or tank wagons.',kinds:['excavator','tankcar'],target:12},
  {name:'Harbor master',detail:'Collect 8 tugboats or dock cranes.',kinds:['tugboat','crane'],target:8},
  {name:'Feed the furnace',detail:'Collect 10 transformers, dozers or turbine generators.',kinds:['transformer','bulldozer','turbine'],target:10},
  {name:'One of everything',detail:'Discover every collectible type.',target:Object.keys(defs).length,unique:true}
 ];
 let found=new Set(),awarded=new Set(),dirty=true;
 function count(c){if(c.unique)return new Set([...found].map(id=>objects[id]?.kind)).size;let n=0;for(const id of found){const o=objects[id];if(o&&(c.region===undefined||o.region===c.region)&&(!c.kinds||c.kinds.includes(o.kind)))n++;}return n;}
 function collect(o){if(found.has(o.id))return;found.add(o.id);dirty=true;for(const c of contracts){if(!awarded.has(c.name)&&count(c)>=c.target){awarded.add(c.name);message('FIELD NOTE COMPLETE — '+c.name);}}}
 function update(){if(!dirty||!document.getElementById('fieldPanel')||document.getElementById('fieldPanel').hidden)return;dirty=false;document.getElementById('fieldPanel').innerHTML='<h3>FIELD NOTES <small>'+awarded.size+' / '+contracts.length+'</small></h3><p>Optional discoveries. Follow your curiosity.</p>'+contracts.map(c=>{const n=Math.min(c.target,count(c));return '<section class="note '+(n===c.target?'done':'')+'"><b>'+(n===c.target?'✓ ':'')+c.name+'</b><span>'+n+' / '+c.target+'</span><p>'+c.detail+'</p><div class="noteTrack"><i style="width:'+n/c.target*100+'%"></i></div></section>';}).join('');}
 function install(){const style=document.createElement('style');style.textContent='#fieldPanel{position:absolute;right:28px;top:153px;width:310px;max-height:66vh;overflow:auto;padding:18px;background:#20383bf5;color:#eee5cd;border:1px solid #658083;border-radius:10px;z-index:5;font:13px Arial}#fieldPanel[hidden]{display:none}#fieldPanel h3{letter-spacing:2px;margin:0 0 8px}#fieldPanel small,.note span{float:right;color:#e6bf6b}.note{border-top:1px solid #486268;padding:13px 0}.note p,#fieldPanel>p{color:#b3c9c8;font-size:12px;line-height:1.5}.note.done b{color:#edc778}.noteTrack{height:3px;background:#4e6365}.noteTrack i{display:block;height:3px;background:#dfb965}@media(max-width:650px){#fieldPanel{top:248px;right:12px;width:280px;max-height:50vh}}';document.head.append(style);const panel=document.createElement('div');panel.id='fieldPanel';panel.hidden=true;document.body.append(panel);const button=document.createElement('button');button.id='fieldNotes';button.textContent='Field notes';document.getElementById('options').prepend(button);button.onclick=()=>{panel.hidden=!panel.hidden;dirty=true;update();button.blur();};}
 return {install,collect,update,reset(){found.clear();awarded.clear();dirty=true;},save(){return [...found];},restore(ids){found=new Set(ids.filter(id=>objects[id]));awarded=new Set(contracts.filter(c=>count(c)>=c.target).map(c=>c.name));dirty=true;},snapshot(){return{found:found.size,completed:awarded.size,contracts:contracts.map(c=>({name:c.name,count:count(c),target:c.target}))};}};
})();
