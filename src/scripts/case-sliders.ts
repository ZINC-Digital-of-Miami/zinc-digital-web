export function initCaseSliders(){
for (const section of document.querySelectorAll<HTMLElement>('[data-case-slider]')) {
 const track=section.querySelector<HTMLElement>('.uso-track')!;
 const prev=section.querySelector<HTMLButtonElement>('[data-case-prev]')!;
 const next=section.querySelector<HTMLButtonElement>('[data-case-next]')!;
 const count=section.querySelector<HTMLElement>('[data-case-count]')!;
 const slides=[...track.children] as HTMLElement[];
 const padding=()=>parseFloat(getComputedStyle(track).paddingLeft);
 const position=(i:number)=>slides[i].offsetLeft-padding();
 const nearest=()=>slides.reduce((best,el,i)=>Math.abs(position(i)-track.scrollLeft)<Math.abs(position(best)-track.scrollLeft)?i:best,0);
 const update=()=>{prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;count.textContent=`· ${next.disabled?slides.length:nearest()+1} / ${slides.length}`;};
 const move=(delta:number)=>{track.scrollTo({left:position(Math.max(0,Math.min(slides.length-1,nearest()+delta))),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 track.addEventListener('scroll',update,{passive:true});
 track.addEventListener('keydown',event=>{if(event.target!==track)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}});
 new ResizeObserver(update).observe(track);update();
}

}