export const PROJECT_ASSEMBLY={sourcewell:"shell",velosync:"chest",espion:"cylinders"};
export const ASSEMBLIES={
 shell:{ids:[78253,188481,188571,188693,188722],release:[0,1.72,4.3],park:[2.7,.65,0],cameraY:.65,cameraZ:13.5},
 chest:{ids:[14122],release:[0,-3.3,3.3],park:[0,.7,0],cameraY:-.6,cameraZ:13.5},
 cylinders:{ids:[4983,5571,6159,9995,10583,11171],partOffsets:{"4983":[-1.498015052,-0.355899417,-0.17828771],"5571":[-1.327538056,0.701325041,-0.385079077],"6159":[-0.656150351,1.188108676,-0.748574973],"9995":[1.498015054,-0.355899425,-0.178287684],"10583":[1.32753807,0.70132502,-0.385079066],"11171":[0.656150306,1.188108684,-0.748575]},release:[0,0,0],park:[0,0,0],cameraY:.35,cameraZ:13.5}
};
export function advanceMotion(state,dt,instant=false){
 const step=instant?1:Math.min(dt,.04)/.72;
 if(state.current===null&&state.target)state.current=state.target;
 const opening=state.current!==null&&state.current===state.target;
 state.progress=opening?Math.min(1,state.progress+step):Math.max(0,state.progress-step);
 if(state.progress===0&&state.current!==state.target){state.current=state.target;if(instant&&state.current)state.progress=1;}
 return state;
}
export function motionPending(state){return state.current!==state.target||(state.target?state.progress<1:state.progress>0);}
export function armorOffset(progress,key='shell'){
 const a=ASSEMBLIES[key],release=Math.min(1,progress/.75),park=Math.max(0,(progress-.75)/.25);
 return a.release.map((n,i)=>n*release+a.park[i]*park);
}

export function assemblyOffset(progress,key,id){const config=ASSEMBLIES[key];return config.partOffsets?config.partOffsets[id].map(n=>n*progress):armorOffset(progress,key);}
