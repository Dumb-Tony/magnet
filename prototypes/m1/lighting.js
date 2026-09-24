/* Soft sky reflections give curved steel and painted bevels readable highlights. */
'use strict';
const ReflectionStudio=(()=>{
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const c=canvas.getContext('2d');
 const sky=c.createLinearGradient(0,0,0,512);sky.addColorStop(0,'#698ba9');sky.addColorStop(.48,'#c6d8df');sky.addColorStop(.55,'#b5afa0');sky.addColorStop(1,'#484d4b');c.fillStyle=sky;c.fillRect(0,0,1024,512);
 for(const [x,y,w,h] of [[160,60,170,110],[600,100,230,70],[30,210,140,30]]){const glow=c.createRadialGradient(x+w/2,y+h/2,5,x+w/2,y+h/2,w*.7);glow.addColorStop(0,'#ffffff');glow.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=glow;c.fillRect(x-w*.3,y-h,w*1.6,h*3);}
 const map=new THREE.CanvasTexture(canvas);map.mapping=THREE.EquirectangularReflectionMapping;map.colorSpace=THREE.SRGBColorSpace;
 const pmrem=new THREE.PMREMGenerator(renderer),target=pmrem.fromEquirectangular(map);scene.environment=target.texture;map.dispose();pmrem.dispose();
 scene.children.filter(o=>o.isHemisphereLight).forEach(o=>o.intensity=1.45);sun.intensity=3.35;sun.shadow.mapSize.set(4096,4096);sun.shadow.bias=-.00018;sun.shadow.normalBias=.018;renderer.toneMappingExposure=1.1;
 const rim=new THREE.DirectionalLight('#77b7d5',1.05);rim.position.set(35,22,-42);scene.add(rim);
 const warmBounce=new THREE.DirectionalLight('#d99b62',.42);warmBounce.position.set(-18,7,25);scene.add(warmBounce);
 return {environment:target.texture};
})();
