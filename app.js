const strokeIcon=path=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${path}"/></svg>`;
const motionIcons={pause:strokeIcon('M9 5v14M15 5v14'),play:strokeIcon('m9 5 10 7-10 7Z')};
const projectMarks={
sourcewell:'<rect x="17" y="10" width="29" height="42" rx="4"/><path d="M24 20h15M24 27h15M24 34h8m2 11 4 4 9-10"/><circle cx="42" cy="45" r="11"/>',
velosync:'<path d="M12 13h27a5 5 0 0 1 5 5v16a5 5 0 0 1-5 5H24l-10 8v-8h-2a5 5 0 0 1-5-5V18a5 5 0 0 1 5-5Z"/><path d="M26 44h13l10 8v-8h2a5 5 0 0 0 5-5V27a5 5 0 0 0-5-5M17 24h17M17 30h10"/>',
espion:'<rect x="17" y="15" width="30" height="42" rx="5"/><rect x="22" y="22" width="20" height="14" rx="2"/><path d="M39 15V7m-11 37 4-4 4 4m-8 5 4 4 4-4M10 13a18 18 0 0 1 4-6m36 0a18 18 0 0 1 4 6"/>'
};
const motionButton = document.querySelector('#motion');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
function updateMotion(){ document.body.classList.toggle('motion-paused', paused); motionButton.setAttribute('aria-pressed', String(paused)); motionButton.setAttribute('aria-label', paused ? 'Resume animations' : 'Pause animations'); motionButton.querySelector('.motion-icon').innerHTML = paused ? motionIcons.play : motionIcons.pause; motionButton.querySelector('.motion-label').textContent = paused ? 'Resume motion' : 'Pause motion'; document.dispatchEvent(new Event('motionchange')); }
motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
reduced.addEventListener('change', () => { paused = reduced.matches; updateMotion(); });
updateMotion();
async function sculpture(){
const THREE = await import('./vendor/three.module.js');
const host = document.querySelector('#sculpture'), canvas = document.querySelector('#scene');
let renderer; try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true, powerPreference:'low-power'}); } catch { return; }
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7)); renderer.setClearColor(0x000000,0); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.25;
const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-10,10,6,-6,.1,100); camera.position.set(0,0,20);
const envCanvas = document.createElement('canvas'); envCanvas.width=1024; envCanvas.height=512;
const ctx=envCanvas.getContext('2d'); const grad=ctx.createLinearGradient(0,0,0,512);
[[0,'#e7e3ed'],[.2,'#fafaff'],[.37,'#bbb4db'],[.45,'#282a32'],[.55,'#f3efff'],[.7,'#78748e'],[1,'#dad7d0']].forEach(([s,c])=>grad.addColorStop(s,c)); ctx.fillStyle=grad; ctx.fillRect(0,0,1024,512);
ctx.fillStyle='#ffffff'; ctx.fillRect(180,0,145,512); ctx.fillRect(760,0,45,512); ctx.fillStyle='#272931'; ctx.fillRect(410,0,90,512);
const envTexture = new THREE.CanvasTexture(envCanvas); envTexture.mapping=THREE.EquirectangularReflectionMapping; envTexture.colorSpace=THREE.SRGBColorSpace;
const pmrem = new THREE.PMREMGenerator(renderer); const envTarget=pmrem.fromEquirectangular(envTexture); scene.environment=envTarget.texture; envTexture.dispose(); pmrem.dispose();
const assembly=new THREE.Group(), group=new THREE.Group(), rings=new THREE.Group(); scene.add(assembly);assembly.add(group,rings);
const material=new THREE.MeshPhysicalMaterial({color:0xc3b5e6,metalness:1,roughness:.15,clearcoat:1,clearcoatRoughness:.08,iridescence:.45,iridescenceIOR:1.4,iridescenceThicknessRange:[100,340]});
const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.65,.57,220,36,2,3),material); group.add(knot); group.rotation.set(.3,-.45,-.45);
// An origin-centered vertex envelope stays valid through every knot rotation.
const positions=knot.geometry.getAttribute('position');let knotBound=0;
for(let i=0;i<positions.count;i++){knotBound=Math.max(knotBound,Math.hypot(positions.getX(i),positions.getY(i),positions.getZ(i)));}
knot.geometry.boundingSphere=new THREE.Sphere(new THREE.Vector3(),knotBound);
const RING_INNER=3.55, SCENE_BOUND=4.7;
if(RING_INNER <= knotBound+.25) throw new Error('Orbit clearance must exceed the full rotating knot bound.');
const ringBands=[[3.55,3.60,0xb2a1d6],[3.65,3.77,0xcac0df],[3.79,3.89,0x827398],[3.95,4.14,0xc5b8da],[4.19,4.24,0xa99abd]];
ringBands.forEach(([inner,outer,color])=>{const mesh=new THREE.Mesh(new THREE.RingGeometry(inner,outer,192),new THREE.MeshStandardMaterial({color,metalness:.8,roughness:.31,side:THREE.DoubleSide}));rings.add(mesh);});
[3.56,3.78,4.15,4.25].forEach((radius,i)=>{const rim=new THREE.Mesh(new THREE.TorusGeometry(radius,.009,5,192),new THREE.MeshBasicMaterial({color:i%2?0xe9e4fa:0x9d8cbd}));rings.add(rim);});
const glintPositions=[];
for(let i=0;i<128;i++){const angle=i*2.399963229728653, radius=3.62+(Math.sin(i*7.13)*.5+.5)*.59;glintPositions.push(Math.cos(angle)*radius,Math.sin(angle)*radius,.022);}
const glintGeometry=new THREE.BufferGeometry();glintGeometry.setAttribute('position',new THREE.Float32BufferAttribute(glintPositions,3));
const glints=new THREE.Points(glintGeometry,new THREE.PointsMaterial({color:0xf6eeff,size:.025,sizeAttenuation:true}));rings.add(glints);
const moons=new THREE.Group();rings.add(moons);
[0,1].forEach((_,i)=>{const moon=new THREE.Mesh(new THREE.SphereGeometry(i?.065:.12,18,12),new THREE.MeshPhysicalMaterial({color:i?0xd7ed9f:0xc8b8e8,metalness:.85,roughness:.18}));const angle=i?2.7:.2;moon.position.set(Math.cos(angle)*4.48,Math.sin(angle)*4.48,.06);moons.add(moon);});
rings.rotation.set(1.06,.2,-.35);
scene.add(new THREE.HemisphereLight(0xffffff,0x8c80a9,2));const keyLight=new THREE.DirectionalLight(0xffffff,2.4);keyLight.position.set(-3,7,10);scene.add(keyLight);
let visible=true, frame=0, last=0, elapsed=0; const pointer={x:0,y:0}, current={x:0,y:0};
function resize(){const w=host.clientWidth,h=host.clientHeight; renderer.setSize(w,h,false);const mobile=w<700;const diameter=mobile?Math.min(w*.98,h*.48):Math.min(h*.96,w*.79);const scale=diameter/(SCENE_BOUND*2);const viewW=w/scale,viewH=h/scale;camera.left=-viewW/2;camera.right=viewW/2;camera.top=viewH/2;camera.bottom=-viewH/2;camera.updateProjectionMatrix();assembly.position.x=mobile?0:viewW*.10;assembly.position.y=mobile?-viewH*.235:-viewH*.025;sync();}
function render(now){frame=0; const delta=last ? Math.min((now-last)/1000,.05):0; last=now; if(!paused) elapsed+=delta;
const damp=1-Math.exp(-delta*3.5);if(!paused){current.x+=(pointer.x-current.x)*damp;current.y+=(pointer.y-current.y)*damp;}
group.rotation.y=-.45+elapsed*.16+current.x*.25;group.rotation.x=.3+Math.sin(elapsed*.31)*.15+current.y*.16;group.rotation.z=-.45+Math.sin(elapsed*.2)*.09;
rings.rotation.x=1.06+Math.sin(elapsed*.17)*.13;rings.rotation.y=.2+Math.sin(elapsed*.13)*.18;rings.rotation.z=-.35+Math.sin(elapsed*.11)*.12;moons.rotation.z=elapsed*.055;glints.rotation.z=elapsed*.025;
renderer.render(scene,camera); if(!paused && visible && !document.hidden) frame=requestAnimationFrame(render);}
function sync(){if(frame) cancelAnimationFrame(frame); frame=0;last=0; if(visible && !document.hidden) render(0);}
host.addEventListener('pointermove',e=>{const r=host.getBoundingClientRect(); pointer.x=((e.clientX-r.left)/r.width-.5)*2;pointer.y=((e.clientY-r.top)/r.height-.5)*2;});host.addEventListener('pointerleave',()=>{pointer.x=pointer.y=0;});
const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(host);
const resizer=new ResizeObserver(resize);resizer.observe(host); document.addEventListener('visibilitychange',sync);document.addEventListener('motionchange',sync);
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(frame)cancelAnimationFrame(frame);host.classList.remove('has-webgl');});
canvas.addEventListener('webglcontextrestored',()=>location.reload());
window.addEventListener('pagehide',event=>{cancelAnimationFrame(frame);frame=0;if(event.persisted)return;observer.disconnect();resizer.disconnect();assembly.traverse(object=>{object.geometry?.dispose();if(object.material)object.material.dispose();});envTarget.dispose();renderer.dispose();});
window.addEventListener('pageshow',event=>{if(event.persisted)sync();});
resize();host.classList.add('has-webgl');sync();}
sculpture().catch(error=>{console.error('Sculpture enhancement unavailable:',error);});

const projects = {
sourcewell:{label:'01 / AI KNOWLEDGE & SUPPORT',title:'Sourcewell',lead:'Useful answers. Inspectable sources. A clearer path to human support.',detail:'<h3>The idea</h3><p>Help support teams answer questions from company documents, while keeping the source of each answer visible.</p><h3>What I’m building</h3><ul><li>Document ingestion and a searchable knowledge workspace.</li><li>Hybrid retrieval with Chroma, BM25, and reciprocal rank fusion.</li><li>Structured answers with inspectable citations and a path to human handoff.</li></ul><h3>Built with</h3><p>React · TypeScript · FastAPI · Chroma · BM25</p><h3>Project notes</h3><p>The project includes recorded examples, which are distinct from live AI responses. No live answer-quality benchmark has been run. The project preview is an actual interface image from the public repository.</p>',url:'https://github.com/Xeyzen7959/sourcewell'},
velosync:{label:'02 / WORK IN PROGRESS',title:'Velosync',lead:'An AI website assistant for Indonesian businesses.',detail:'<h3>The idea</h3><p>Currently building Velosync: a website assistant for Indonesian agencies and businesses, with a customer-facing widget and a workspace for managing the experience.</p><h3>Current direction</h3><p>I’m shaping a public website, assistant widget, and workspace to help businesses manage customer conversations.</p><h3>Built with</h3><p>Next.js · TypeScript</p><h3>Project notes</h3><p>Work in progress. The preview is an original interface study created for this portfolio, not a screenshot or a claim about released functionality. The source repository is private.</p>'},
espion:{label:'03 / EMBEDDED SYSTEMS · IN DEVELOPMENT',title:'ESPION',lead:'A small board. A whole world to explore.',detail:'<h3>The idea</h3><p>A modular ESP32-S3 firmware project with a graphical interface for educational hardware experimentation.</p><h3>Current direction</h3><p>Exploring how embedded software and a compact visual interface can make hardware experiments more approachable. I’m developing the interface and modular foundation, with additional hardware modules on the roadmap.</p><h3>Built with</h3><p>C++17 · Arduino Framework · PlatformIO · LovyanGFX · ESP32-S3</p><h3>Project notes</h3><p>The preview is an illustrative handheld prototype with a short antenna, four directional controls, and the project’s purple interface. It is a product concept, not a photograph of a finished device. The interface image was supplied for this portfolio; displayed menu items do not imply completed hardware modules. See the public repository for the current implementation.</p>',url:'https://github.com/Xeyzen7959/ESPION'}
};
const dialog=document.querySelector('#project-dialog');let opener;let focusContact=false;
function closeProject(){dialog.close();}
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
const data=projects[button.dataset.project];opener=button;dialog.dataset.project=button.dataset.project;document.querySelector('#dialog-project-mark').innerHTML=`<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${projectMarks[button.dataset.project]}</svg>`;
document.querySelector('#dialog-label').textContent=data.label;document.querySelector('#dialog-title').textContent=data.title;document.querySelector('#dialog-lead').textContent=data.lead;document.querySelector('#dialog-detail').innerHTML=data.detail;
const detail=document.querySelector('#dialog-detail');let detailSection;[...detail.children].forEach(node=>{if(node.tagName==='H3'){detailSection=document.createElement('section');detailSection.className='detail-section';detail.append(detailSection);}detailSection?.append(node);});
document.querySelector('#dialog-links').innerHTML=data.url?`<a href="${data.url}" target="_blank" rel="noopener noreferrer">View source on GitHub ${strokeIcon('M7 17 17 7M7 7h10v10')}</a>`:`<a href="#contact" id="discuss-project">Talk about the project ${strokeIcon('M7 17 17 7M7 7h10v10')}</a>`;
dialog.showModal();document.body.classList.add('no-scroll');dialog.scrollTop=0;dialog.querySelector('.dialog-close').focus();
dialog.querySelector('#discuss-project')?.addEventListener('click',()=>{focusContact=true;closeProject();});
}));
dialog.querySelector('.dialog-close').addEventListener('click',closeProject);
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeProject();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('no-scroll');if(focusContact){document.querySelector('#contact-title').focus({preventScroll:true});focusContact=false;}else opener?.focus({preventScroll:true});});

// Lower-page entrances are progressive: content is visible until observers exist.
if('IntersectionObserver' in window){
const targets=document.querySelectorAll('.work .section-heading,.work .project,.stack .section-heading,.stack-layout,.about-label,.about-copy,.contact-top,.contact h2,.contact-bottom');
const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('reveal-wait');revealObserver.unobserve(entry.target);}});},{threshold:.06});
targets.forEach(target=>{target.classList.add('reveal-ready');if(!paused&&target.getBoundingClientRect().top>innerHeight){target.classList.add('reveal-wait');revealObserver.observe(target);}});
document.addEventListener('motionchange',()=>{if(paused)targets.forEach(target=>{target.classList.remove('reveal-wait');revealObserver.unobserve(target);});});
const art=document.querySelector('.stack-constellation');const artObserver=new IntersectionObserver(([entry])=>art.classList.toggle('art-offscreen',!entry.isIntersecting));artObserver.observe(art);
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('page-hidden',document.hidden));
window.addEventListener('pagehide',event=>{if(!event.persisted){revealObserver.disconnect();artObserver.disconnect();}});
}
