/* Small, deterministic, offline surface library. Each material has its own construction. */
'use strict';
const ScrapSurfaces=(()=>{
 const maps={},materials={};
 function texture(kind){
  if(maps[kind])return maps[kind];
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
  const c=canvas.getContext('2d');let seed=731;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  c.fillStyle='#dedede';c.fillRect(0,0,256,256);
  for(let i=0;i<3500;i++){const v=205+random()*38;c.fillStyle=`rgb(${v},${v},${v})`;c.fillRect(random()*256,random()*256,kind==='steel'?18:2,1);}
  if(kind==='wood')for(let y=0;y<256;y+=3){c.strokeStyle=`rgba(55,29,10,${.08+random()*.25})`;c.beginPath();for(let x=0;x<=256;x+=8)c.lineTo(x,y+Math.sin(x*.03+y)*3);c.stroke();if(y%63===0)c.fillRect(0,y,256,2);}
  if(kind==='rubber'){c.fillStyle='#666';for(let y=0;y<256;y+=24)for(let x=-24;x<256;x+=32){c.save();c.translate(x,y);c.rotate(.6);c.fillRect(0,0,9,22);c.restore();}}
  if(kind==='paint'){for(let i=0;i<150;i++){c.fillStyle=i%3?'#aaa99f':'#9a8b79';c.fillRect(random()*256,random()*256,1+random()*6,.5+random());}for(let i=0;i<12;i++){const x=random()*256,y=random()*256;c.fillStyle='rgba(123,91,61,.12)';c.fillRect(x,y,1,5+random()*16);}}
  if(kind==='concrete'||kind==='asphalt')for(let i=0;i<1900;i++){c.fillStyle=random()>.5?'#bcbcbc':'#e8e8e8';c.beginPath();c.arc(random()*256,random()*256,random()*2.3,.0,7);c.fill();}
  if(kind==='asphalt'){c.strokeStyle='#888';c.lineWidth=1;for(let i=0;i<4;i++){let x=random()*256,y=random()*256;c.beginPath();c.moveTo(x,y);for(let j=0;j<7;j++){x+=random()*22-11;y+=random()*12;c.lineTo(x,y);}c.stroke();}for(let i=0;i<4500;i++){c.fillStyle=random()>.5?'#aaa':'#ddd';c.fillRect(random()*256,random()*256,1,1);}}
  if(kind==='brick'){c.fillStyle='#777';for(let y=0;y<256;y+=32){c.fillRect(0,y,256,3);for(let x=(y%64?32:0);x<256;x+=64)c.fillRect(x,y,3,32);}}
  if(kind==='glass'){const gradient=c.createLinearGradient(0,0,256,256);gradient.addColorStop(0,'#a9bfc9');gradient.addColorStop(.6,'#d8e5e8');gradient.addColorStop(1,'#c0d4db');c.fillStyle=gradient;c.fillRect(0,0,256,256);}
  if(kind==='water'){c.fillStyle='#b9cbd0';c.fillRect(0,0,256,256);for(let y=0;y<256;y+=10){c.strokeStyle='rgba(235,250,255,.45)';c.lineWidth=2;c.beginPath();for(let x=0;x<=256;x+=4)c.lineTo(x,y+Math.sin(x*.05+y)*3+Math.sin(x*.11)*1.5);c.stroke();}}
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=4;maps[kind]=map;return map;
 }
 function infer(color,metal){if(color==='#397a89')return 'water';if(color==='#b29164'||color==='#9b815c')return 'wood';if(color==='#354b53')return metal>.5?'steel':'rubber';if(['#597d83','#5d8990','#719293','#d7e5c7'].includes(color))return 'glass';if(['#b6ad91','#a4b3ad','#bdaf93'].includes(color))return 'brick';if(color==='#6b8286')return 'asphalt';if(['#8da29a','#b19f7c','#8b9a97','#b5bdb0','#77968d','#829c92'].includes(color))return 'concrete';return metal>.55?'steel':'paint';}
 function material(color,metal=.1,kind=infer(color,metal),repeat=[1,1]){
  const key=[color,metal,kind,...repeat].join(':');if(materials[key])return materials[key];
  const map=texture(kind).clone();map.repeat.set(...repeat);map.needsUpdate=true;const roughness={water:.24,glass:.12,steel:.3,paint:.48,wood:.87,rubber:.97,brick:.95,concrete:.94,asphalt:1}[kind];
  return materials[key]=new THREE.MeshStandardMaterial({color,map,roughness,envMapIntensity:kind==='steel'?1.15:kind==='glass'?.85:.45,metalness:kind==='glass'?.35:kind==='rubber'||kind==='wood'?0:metal,bumpMap:kind==='glass'?null:map,bumpScale:kind==='brick'?.035:kind==='rubber'?.012:.004});
 }
 return {material,maps};
})();
