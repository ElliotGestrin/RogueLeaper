class CombatController{
  constructor(){
  }

  endTurn(){
    let wait = 0;
    for(let slotID in playZone.slots){
      let cardToPlay = playZone.slots[slotID].card;
      if(cardToPlay){
        setTimeout(cardToPlay.play.bind(cardToPlay),wait);
        wait += 1000;
    }}
  }
}

export {CombatController}
