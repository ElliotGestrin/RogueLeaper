class CombatController{
  constructor(){
    this.simulating = false;
  }

  endTurn(){
    let wait = 0;
    for(let slotID in playZone.slots){
      let cardToPlay = playZone.slots[slotID].card;
      if(cardToPlay){
        setTimeout(cardToPlay.play.bind(cardToPlay),wait);
        if (!this.simulating) wait += 1000;
    }}
  }
}

export {CombatController}
