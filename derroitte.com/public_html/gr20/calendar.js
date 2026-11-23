(() => {
  const slide=document.querySelector('.calendar-slide');
  const status=document.querySelector('#calendar-status');
  let timers=[];
  function stop(){timers.forEach(clearTimeout);timers=[];slide.classList.remove('calendar-running','calendar-done');}
  function play(){
    stop();
    if(!slide.classList.contains('active'))return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){slide.classList.add('calendar-done');status.textContent='Arrivée le samedi. GR20 du dimanche, jour 2, au lundi, jour 10. Villa du samedi, jour 8, au samedi, jour 15. Trois jours de chevauchement.';return;}
    void slide.offsetWidth;
    slide.classList.add('calendar-running');
    status.textContent='Trois semaines. Arrivée le samedi, le GR20 démarre le dimanche pour neuf jours.';
    timers.push(setTimeout(()=>status.textContent='La villa va du samedi, jour 8, au dernier samedi, jour 15, jour du départ.',2600));
    timers.push(setTimeout(()=>{slide.classList.add('calendar-done');status.textContent='Du samedi au lundi, jours 8 à 10 : le GR20 et la villa se chevauchent.';},4300));
  }
  document.querySelector('#replay-calendar').addEventListener('click',play);
  new MutationObserver(records=>{if(records.some(r=>r.attributeName==='class' && (r.oldValue||'').split(' ').includes('active')!==slide.classList.contains('active')))play();}).observe(slide,{attributes:true,attributeOldValue:true,attributeFilter:['class']});
  play();
})();
