import * as THREE from './vendor/three.module.js';
import {ConvexGeometry} from './vendor/ConvexGeometry.js';
function wireUV(geometry){geometry.computeBoundingBox();const p=geometry.attributes.position,b=geometry.boundingBox,uv=new Float32Array(p.count*2);for(let i=0;i<p.count;i++){uv[i*2]=(p.getX(i)-b.min.x)/(b.max.x-b.min.x);uv[i*2+1]=(p.getY(i)-b.min.y)/(b.max.y-b.min.y);}geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.computeBoundingSphere();return geometry;}
export function buildFittedLiner(outerGeometry,material,coreGeometry){
 const geometry=coreGeometry.clone();geometry.computeBoundingBox();const c=geometry.boundingBox.getCenter(new THREE.Vector3());geometry.translate(-c.x,-c.y,-c.z);geometry.scale(1.1,1.12,1);geometry.translate(c.x,c.y-.05,c.z);
 const liner=new THREE.Mesh(wireUV(geometry),material);liner.name='approved_closed_head_wire_housing';return liner;
}
export function buildChestLiner(chestGeometry,material){
 chestGeometry.computeBoundingBox();const c=chestGeometry.boundingBox.getCenter(new THREE.Vector3()),p=chestGeometry.attributes.position,points=[];
 for(let i=0;i<p.count;i++)points.push(new THREE.Vector3((p.getX(i)-c.x)*.86+c.x,(p.getY(i)-c.y)*.88+c.y,(p.getZ(i)-c.z)*.6+c.z-.25));
 const liner=new THREE.Mesh(wireUV(new ConvexGeometry(points)),material);liner.name='approved_closed_chest_wire_housing';return liner;
}
export function buildNeckLiner(neckGeometry,rimGeometry,material){
 const points=[],neck=neckGeometry.attributes.position,rim=rimGeometry.attributes.position;
 for(let i=0;i<neck.count;i++)points.push(new THREE.Vector3(neck.getX(i)*.88,neck.getY(i)-.2,neck.getZ(i)*.5-.1));
 for(let i=0;i<rim.count;i++)if(rim.getY(i)<=2.1)points.push(new THREE.Vector3(rim.getX(i)*.88,rim.getY(i)-.1,Math.max(-.5,Math.min(.8,rim.getZ(i)*.4+.05))));
 const liner=new THREE.Mesh(wireUV(new ConvexGeometry(points)),material);liner.name='approved_closed_neck_wire_bridge';return liner;
}
