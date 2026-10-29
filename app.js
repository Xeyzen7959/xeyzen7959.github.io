import * as THREE from './vendor/three.module.js';
import {buildFittedLiner,buildChestLiner,buildNeckLiner} from './liner.js';

import { ASSEMBLIES,PROJECT_ASSEMBLY,advanceMotion,motionPending,assemblyOffset } from './motion.js';

const projects = {
 sourcewell:{name:'Sourcewell',kind:'01 / AI KNOWLEDGE & SUPPORT',description:'AI support answers from company documents, with visible sources and a path to human support.',detail:'<h3>Purpose</h3><p>Help support teams answer questions from company documents while keeping the source of each answer visible.</p><h3>Features</h3><ul><li>Document ingestion and a searchable knowledge workspace.</li><li>Hybrid retrieval with Chroma, BM25 and reciprocal rank fusion.</li><li>Structured answers with inspectable citations and human handoff.</li></ul><h3>Built with</h3><p>React · TypeScript · FastAPI · Chroma · BM25</p><h3>Status & preview</h3><p>The project includes recorded examples, distinct from live AI responses. No live answer-quality benchmark has been run. The preview uses an actual interface image from the public repository.</p><a href="https://github.com/Xeyzen7959/sourcewell" target="_blank" rel="noopener noreferrer">Sourcewell repository</a>'},
 velosync:{name:'Velosync',kind:'02 / WORK IN PROGRESS',description:'An AI website assistant for Indonesian agencies and businesses, with a customer-facing widget and management workspace.',detail:'<h3>Purpose</h3><p>A website assistant for Indonesian agencies and businesses, with a customer-facing widget and a workspace for managing the experience.</p><h3>Current direction</h3><p>A public website, assistant widget and workspace to help businesses manage customer conversations.</p><h3>Built with</h3><p>Next.js · TypeScript</p><h3>Status & preview</h3><p>Work in progress. The preview is an original interface study created for this portfolio, not a screenshot or a claim about released functionality. The source repository is private.</p>'},
 espion:{name:'ESPION',kind:'03 / EMBEDDED SYSTEMS · IN DEVELOPMENT',description:'A modular ESP32-S3 firmware project with a graphical interface for educational hardware experimentation.',detail:'<h3>Purpose</h3><p>Make hardware experiments more approachable through embedded software and a compact graphical interface.</p><h3>Current direction</h3><p>Developing the interface and modular foundation, with additional hardware modules on the roadmap.</p><h3>Built with</h3><p>C++17 · Arduino Framework · PlatformIO · LovyanGFX · ESP32-S3</p><h3>Status & preview</h3><p>In development. The preview is an illustrative handheld product concept, not a photograph of a finished device. Its short antenna, directional controls and purple interface do not imply completed hardware modules. The interface image was supplied for this portfolio.</p><a href="https://github.com/Xeyzen7959/ESPION" target="_blank" rel="noopener noreferrer">ESPION repository</a>'}
};
const summary=document.querySelector('#ribbon-summary');
const ribbonDescriptions={sourcewell:'Exploring AI answers with visible sources.',velosync:'A website assistant for Indonesian businesses.',espion:'Embedded software for educational hardware experiments.'};
let lastRibbon,selectedRibbonKey=null,openRibbonArmor=null,closeRibbonArmor=null;
function closeRibbon(restoreFocus=true){selectedRibbonKey=null;summary.hidden=true;document.querySelectorAll('[data-ribbon]').forEach(b=>b.setAttribute('aria-expanded','false'));closeRibbonArmor?.();if(restoreFocus)lastRibbon?.focus({preventScroll:true});}
document.querySelectorAll('[data-ribbon]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();const key=button.dataset.ribbon;selectedRibbonKey=key;lastRibbon=button;document.querySelector('#summary-title').textContent=projects[key].name;document.querySelector('#summary-description').textContent=ribbonDescriptions[key];document.querySelector('#summary-link').setAttribute('href','#case-study');document.querySelector('#summary-link').dataset.projectKey=key;document.querySelectorAll('[data-ribbon]').forEach(b=>b.setAttribute('aria-expanded',String(b===button)));summary.hidden=false;openRibbonArmor?.(key);summary.focus({preventScroll:true});}));
document.querySelector('#summary-close').addEventListener('click',()=>closeRibbon());
document.querySelector('#summary-link').addEventListener('click',()=>{if(selectedRibbonKey){lastCase=document.querySelector('#project-'+selectedRibbonKey);showCase(selectedRibbonKey,{scroll:false,focus:false});}closeRibbon(false);});
const caseStudy=document.querySelector('#case-study');
let lastCase;
function caseAsset(name){return './assets/'+name;}
function showCase(key,options={}){
 const p=projects[key];document.querySelector('#case-title').textContent=p.name;document.querySelector('#case-kind').textContent=p.kind;document.querySelector('#case-description').textContent=p.description;document.querySelector('#dialog-detail').innerHTML=p.detail;
 caseStudy.querySelectorAll('[data-case]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.case===key)));
 const visual=document.querySelector('#case-visual');visual.replaceChildren();
 if(key==='velosync'){
  const widget=document.createElement('div');widget.className='widget-concept';widget.setAttribute('role','img');widget.setAttribute('aria-label','Velosync website assistant interface concept');widget.innerHTML='<div class="widget-top">velosync<span>WEBSITE ASSISTANT</span></div><div class="widget-message">Hi! How can I help you today?</div><div class="widget-reply">A website assistant for your business.</div><div class="widget-input">Ask a question…</div>';visual.append(widget);
 }else{
  const frame=document.createElement('div');frame.className=key==='sourcewell'?'browser-preview':'handheld-concept';const image=document.createElement('img');image.src=caseAsset(key==='sourcewell'?'sourcewell.png':'espion-ui.png');image.alt=key==='sourcewell'?'Sourcewell interface from the public project repository':'ESPION purple interface displayed in an illustrative handheld concept';image.addEventListener('error',()=>{image.hidden=true;const note=document.createElement('p');note.textContent='Preview unavailable. Project details remain available.';frame.append(note);});frame.append(image);
  if(key==='espion'){const pad=document.createElement('span');pad.className='device-pad';pad.setAttribute('aria-hidden','true');frame.append(pad);}visual.append(frame);
 }
 document.querySelector('#case-caption').textContent=key==='sourcewell'?'Actual project interface image. Recorded examples are distinct from live AI responses.':key==='velosync'?'Original interface concept. Work in progress; this is not a live assistant.':'Illustrative handheld concept using the supplied interface image. Not a finished device.';
 caseStudy.hidden=false;if(options.focus!==false)caseStudy.focus({preventScroll:true});if(options.scroll!==false)caseStudy.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'});
}
document.querySelectorAll('[data-case]').forEach(button=>button.addEventListener('click',()=>{if(!caseStudy.contains(button))lastCase=button;showCase(button.dataset.case);}));
function closeCase(){caseStudy.hidden=true;lastCase?.focus({preventScroll:true});}
caseStudy.querySelector('.case-close').addEventListener('click',closeCase);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!summary.hidden){e.preventDefault();closeRibbon();}else if(!caseStudy.hidden){e.preventDefault();closeCase();}}});

const canvas = document.querySelector('#scene');
const stage = document.querySelector('#stage');
const armorButton = document.querySelector('#armor');
const finishButton = document.querySelector('#finish');
const resetButton = document.querySelector('#reset');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let failed = false;
function showFallback() { failed=true; document.querySelector('#model-loading').hidden=true; document.querySelector('#fallback').hidden=false; canvas.hidden=true; armorButton.disabled=true; finishButton.disabled=true; resetButton.disabled=true; document.querySelector('#view').disabled=true; }
try {
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true, powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 80);
  camera.position.set(0, -.25, 8.7);
  const environmentCanvas = document.createElement('canvas');
  environmentCanvas.width=2048; environmentCanvas.height=1024;
  const ec=environmentCanvas.getContext('2d');
  ec.fillStyle='#18191c'; ec.fillRect(0,0,2048,1024);
  const strip=(x,y,w,h,color) => {ec.fillStyle=color;ec.fillRect(x,y,w,h);};
  strip(70,100,220,760,'#e7f2ff');strip(380,210,65,500,'#ffffff');strip(680,40,500,130,'#f8f4e8');strip(1360,80,135,850,'#ffffff');strip(1650,260,240,390,'#6a6d79');strip(0,850,2048,170,'#3d3e43');strip(1550,250,24,620,'#ff78ac');
  const environmentTexture = new THREE.CanvasTexture(environmentCanvas);
  environmentTexture.mapping=THREE.EquirectangularReflectionMapping;
  environmentTexture.colorSpace=THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment=pmrem.fromEquirectangular(environmentTexture).texture;
  pmrem.dispose();environmentTexture.dispose();
  scene.add(new THREE.HemisphereLight(0xd8e3ff,0x222027,2.1));
  function area(color,intensity,x,y,z){ const l=new THREE.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l); }
  area(0xffffff,4,-4,6,6);area(0x77e7ff,2.2,4,1,3);area(0xff58a4,2.1,-4,-1,-3);area(0xffffff,3,0,6,-3);
  const chrome = new THREE.MeshPhysicalMaterial({color:0xe4e6e9,metalness:1,roughness:.18,clearcoat:1,clearcoatRoughness:.12});
  const darkChrome = new THREE.MeshStandardMaterial({color:0x42464c,metalness:1,roughness:.3});
  const black = new THREE.MeshStandardMaterial({color:0x111216,metalness:.7,roughness:.44});
  const rubber = new THREE.MeshStandardMaterial({color:0x18181b,metalness:.1,roughness:.85});
  const pink = new THREE.MeshStandardMaterial({color:0xff4794,metalness:.4,roughness:.32});
  const acid = new THREE.MeshStandardMaterial({color:0xe8ff35,metalness:.3,roughness:.3});
  const cyan = new THREE.MeshStandardMaterial({color:0x7ce8ed,metalness:.3,roughness:.3});
  const eyeMat = new THREE.MeshStandardMaterial({color:0xdfff70,emissive:0xb8ff2c,emissiveIntensity:2,metalness:.3,roughness:.2});
  const head=new THREE.Group();scene.add(head);head.rotation.set(0,-.24,0);
  const [manifest,binary]=await Promise.all([fetch('./assets/mutant.json').then(r=>{if(!r.ok)throw Error('Model metadata unavailable');return r.json();}),fetch('./assets/mutant.bin').then(r=>{if(!r.ok)throw Error('Model geometry unavailable');return r.arrayBuffer();})]);
  const tl=new THREE.TextureLoader();
  const [colorMap,normalMap,roughMap,metalMap]=await Promise.all(['diffuse','normal','roughness','metalness'].map(n=>tl.loadAsync('./assets/'+n+'.webp')));
  colorMap.colorSpace=THREE.SRGBColorSpace;
  const originalMaterial=new THREE.MeshStandardMaterial({map:colorMap,normalMap,roughnessMap:roughMap,metalnessMap:metalMap,metalness:1,roughness:.85});
  const originalTorsoMaterial=originalMaterial.clone();originalTorsoMaterial.side=THREE.DoubleSide;
  const paintMeshes=[],parts=new Map(),assemblies={};
  // Paint changes only: the supplied positions, normals and topology remain intact.
  function sprayFinish(material) {
    material.onBeforeCompile = shader => {
      shader.vertexShader = 'varying vec3 vPaintPosition;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvPaintPosition = position;');
      shader.fragmentShader = `varying vec3 vPaintPosition;
float paintNoise(vec3 p) { return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }
` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
vec3 pp = vPaintPosition;
float grain = paintNoise(floor(pp * 160.0));
float first = abs(pp.y - .45 * pp.x - 2.65);
float second = abs(pp.y + .65 * pp.x + .72);
float third = abs(pp.y - .24 * pp.x + 1.42);
float haze = (1.0 - smoothstep(.08,.43,first)) * (.27 + .5 * grain);
float flecks = step(.977,grain) * (1.0 - smoothstep(.25,.8,first));
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.9,.035,.3), clamp(haze + flecks*.6,0.0,.8));
float yellowPaint = (1.0-smoothstep(.025,.16,second)) * step(.15,grain) * .65;
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.82,.95,.1), yellowPaint);
float cyanPaint = (1.0-smoothstep(.02,.13,third)) * (.25+.4*grain);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.06,.67,.73), cyanPaint);
float headMark = (1.0-smoothstep(.035,.25,abs(pp.y-.4*pp.x-3.12))) * (.3+.45*grain);
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.82,.95,.1), headMark);
float darkWear = (1.0-smoothstep(.06,.3,abs(pp.y+.2*pp.x-2.28))) * grain*.65;
diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.025,.026,.03), darkWear);
`);
    };
    material.customProgramCacheKey = () => 'spray-finish-v1';
    return material;
  }
  const pinkArmor=new THREE.MeshPhysicalMaterial({map:colorMap,color:0xff70b0,normalMap,metalness:.72,roughness:.28,clearcoat:1});
  const acidArmor=new THREE.MeshPhysicalMaterial({map:colorMap,color:0xeaff58,normalMap,metalness:.6,roughness:.32,clearcoat:1});
  const cyanArmor=new THREE.MeshPhysicalMaterial({map:colorMap,color:0x75e8ed,normalMap,metalness:.7,roughness:.3,clearcoat:1});
  const chromeDetail=new THREE.MeshPhysicalMaterial({color:0xe5e8ea,normalMap,metalness:1,roughness:.22,clearcoat:1});
  for(const part of manifest.parts){
    const data=new Float32Array(binary,part.data.offset,part.data.bytes/4);
    const geo=new THREE.BufferGeometry(),interleaved=new THREE.InterleavedBuffer(data,8);
    geo.setAttribute('position',new THREE.InterleavedBufferAttribute(interleaved,3,0));geo.setAttribute('normal',new THREE.InterleavedBufferAttribute(interleaved,3,3));geo.setAttribute('uv',new THREE.InterleavedBufferAttribute(interleaved,2,6));geo.setIndex(new THREE.BufferAttribute(new Uint32Array(binary,part.index.offset,part.index.bytes/4),1));geo.computeBoundingBox();geo.computeBoundingSphere();
    let material=part.id===100755?originalTorsoMaterial:originalMaterial;if(part.id===78253)material=pinkArmor;if(part.id===145998)material=acidArmor;if(part.id===163069)material=cyanArmor;if([80978,14122,174677,180996].includes(part.id))material=chromeDetail;
    if([78253,14122,145998,163069].includes(part.id)){material=sprayFinish(material.clone());}
    const m=new THREE.Mesh(geo,material);m.name='original_component_'+part.id;head.add(m);parts.set(part.id,m);paintMeshes.push({mesh:m,paint:material});
  }
  head.scale.setScalar(.5);head.position.set(0,-.4075,.277);
  for(const [key,config] of Object.entries(ASSEMBLIES)){assemblies[key]=config.ids.map(id=>{const m=parts.get(id);return {mesh:m,base:m.position.clone()};});}
  const wireTextures=await Promise.all(['basecolor','normal','roughness','metallic'].map(n=>tl.loadAsync('./assets/wires-'+n+'.webp')));
  wireTextures.forEach(t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,5);});wireTextures[0].colorSpace=THREE.SRGBColorSpace;
  const coreWireMaps=wireTextures.slice(0,4).map(t=>{const clone=t.clone();clone.repeat.set(1.2,1.5);clone.needsUpdate=true;return clone;});
  const exposedCoreMaterial=new THREE.MeshStandardMaterial({map:coreWireMaps[0],normalMap:coreWireMaps[1],roughnessMap:coreWireMaps[2],metalnessMap:coreWireMaps[3],metalness:.75,roughness:.7,normalScale:new THREE.Vector2(1.3,1.3),side:THREE.DoubleSide});
  for(const id of [180996,174677]){const core=parts.get(id);core.geometry=core.geometry.clone();core.geometry.computeBoundingBox();const box=core.geometry.boundingBox,pos=core.geometry.attributes.position,uv=new Float32Array(pos.count*2);for(let i=0;i<pos.count;i++){uv[i*2]=(pos.getX(i)-box.min.x)/(box.max.x-box.min.x);uv[i*2+1]=(pos.getY(i)-box.min.y)/(box.max.y-box.min.y);}core.geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));core.material=exposedCoreMaterial;paintMeshes.find(p=>p.mesh===core).paint=exposedCoreMaterial;}
  const fittedLiner=buildFittedLiner(parts.get(78253).geometry,exposedCoreMaterial,parts.get(180996).geometry);head.add(fittedLiner);const chestLiner=buildChestLiner(parts.get(14122).geometry,exposedCoreMaterial);head.add(chestLiner);const neckLiner=buildNeckLiner(parts.get(80842).geometry,parts.get(80978).geometry,exposedCoreMaterial);head.add(neckLiner);
  document.querySelector('#model-loading').hidden=true;
  const motion={current:null,target:null,progress:0};
  const pointer=new THREE.Vector2();let targetRotation=-.24,targetTilt=0,chromeOnly=false,dragging=false,startX=0,startY=0,startRotation=0,dragDistance=0,visible=true;
  function updateArmorButton(){const open=motion.target!==null;armorButton.setAttribute('aria-pressed',String(open));armorButton.innerHTML=`<span>${open?'−':'＋'}</span> ${open?'CLOSE':'INSPECT'} ARMOR`;}
  function closeArmor(){motion.target=null;selectedRibbonKey=null;summary.hidden=true;document.querySelectorAll('[data-ribbon]').forEach(b=>b.setAttribute('aria-expanded','false'));updateArmorButton();requestRender();}
  function inspectArmor(key='shell'){motion.target=key;updateArmorButton();requestRender();}
  openRibbonArmor=key=>inspectArmor(PROJECT_ASSEMBLY[key]);closeRibbonArmor=closeArmor;
  queueMicrotask(()=>{if(!summary.hidden&&selectedRibbonKey)openRibbonArmor(selectedRibbonKey);});
  armorButton.addEventListener('click',()=>{if(motion.target){closeArmor();}else inspectArmor();});
  finishButton.addEventListener('click',()=>{chromeOnly=!chromeOnly;paintMeshes.forEach(p=>{p.mesh.material=chromeOnly?chromeDetail:p.paint;});if(chromeOnly){const torsoChrome=chromeDetail.clone();torsoChrome.side=THREE.DoubleSide;parts.get(100755).material=torsoChrome;}finishButton.setAttribute('aria-pressed',String(chromeOnly));requestRender();});
  const viewButton=document.querySelector('#view');let backView=false;viewButton.addEventListener('click',()=>{backView=!backView;targetRotation=backView?Math.PI-.24:-.24;viewButton.textContent=backView?'VIEW FRONT':'VIEW BACK';viewButton.setAttribute('aria-pressed',String(backView));requestRender();});
  resetButton.addEventListener('click',()=>{targetRotation=-.24;targetTilt=0;pointer.set(0,0);backView=false;viewButton.textContent='VIEW BACK';viewButton.setAttribute('aria-pressed','false');closeArmor();});
  canvas.addEventListener('pointerdown',e=>{dragging=true;startX=e.clientX;startY=e.clientY;startRotation=targetRotation;dragDistance=0;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height*2-1));if(dragging){dragDistance=Math.hypot(e.clientX-startX,e.clientY-startY);targetRotation=startRotation+(e.clientX-startX)*.008;}requestRender();});
  canvas.addEventListener('pointerup',e=>{dragging=false;if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);});
  canvas.addEventListener('pointercancel',()=>dragging=false);
  canvas.addEventListener('pointerleave',()=>{if(!dragging){pointer.set(0,0);requestRender();}});
  canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')targetRotation-=.18;if(e.key==='ArrowRight')targetRotation+=.18;if(e.key==='ArrowUp')targetTilt=Math.max(-.4,targetTilt-.1);if(e.key==='ArrowDown')targetTilt=Math.min(.4,targetTilt+.1);if(e.key===' '){if(motion.target){closeArmor();}else inspectArmor();}requestRender();}});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();showFallback();});
  let frame=0,settleFrames=0,lastTime=0;
  function requestRender(){settleFrames=70;if(!frame&&visible&&!failed)frame=requestAnimationFrame(render);}
  function render(time){const dt=lastTime?Math.min((time-lastTime)/1000,.04):.016;lastTime=time;frame=0;if(failed||!visible)return;const ease=reducedMotion.matches?1:.12;
    head.rotation.y+=(targetRotation-head.rotation.y)*ease;head.rotation.z+=(targetTilt-head.rotation.z)*ease;head.rotation.x+=(.04+pointer.y*.045-head.rotation.x)*ease;
    advanceMotion(motion,dt,reducedMotion.matches);
    for(const [key,items] of Object.entries(assemblies)){for(const {mesh:m,base} of items){const id=Number(m.name.replace('original_component_',''));const offset=key===motion.current?assemblyOffset(motion.progress,key,id):[0,0,0];m.position.copy(base).add(new THREE.Vector3(...offset));}}
    const framing=ASSEMBLIES[motion.current]||ASSEMBLIES.shell;
    camera.position.z=8.7+(framing.cameraZ-8.7)*motion.progress;camera.position.y=-.25+framing.cameraY*motion.progress;
    renderer.render(scene,camera);if(--settleFrames>0||motionPending(motion))frame=requestAnimationFrame(render);
  }
  function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();requestRender();}
  new ResizeObserver(resize).observe(stage);resize();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&!document.hidden;if(visible)requestRender();},{threshold:0}).observe(stage);
  document.addEventListener('visibilitychange',()=>{visible=!document.hidden&&stage.getBoundingClientRect().bottom>0;if(visible)requestRender();});
  reducedMotion.addEventListener('change',requestRender);
  window.__xeyzen = { scene,head,renderer,camera,parts,assemblies,fittedLiner,chestLiner,neckLiner,get open(){return motion.target!==null;},get chrome(){return chromeOnly;},get progress(){return motion.progress;} };
} catch(error) { console.error('3D could not initialize:',error); showFallback(); }
