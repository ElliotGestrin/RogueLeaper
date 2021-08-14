import {Field} from "./field_classes.js";

class CombatController{
  constructor(){
    this.simulating = false;
  }

  endTurn(){
    let wait = 0;
    this.simulating = true;
    for(let enemy of enemies){
      let possiblePlays = enemy.possiblePlays();
      let bestPlay = [];
      let bestValue = 0;
      for (let play of possiblePlays){
        let simulatedField = new Field();
      }
    }

    for(let slotID in playZone.slots){
      let cardToPlay = playZone.slots[slotID].card;
      if(cardToPlay){
        setTimeout(cardToPlay.play.bind(cardToPlay),wait);
        if (!this.simulating) wait += 1000;
    }}
  }

  evaluateSimulation(simulation,enemy){

  }

  copyEverything(){
    let fieldCopy = field.copy();
    let playerCopy = player.copy();
    playerCopy.field = fieldCopy;
    playerCopy.teleportTo(playerCopy.x, playerCopy.y);
    let enemiesCopy = [];
    for (let enemy of enemies){
      let enemyCopy = enemy.copy();
      enemyCopy.field = fieldCopy;
      enemyCopy.teleportTo(enemyCopy.x, enemyCopy.y);
      enemiesCopy.push(enemyCopy);
    }
    return {fieldCopy,playerCopy,enemiesCopy}
  }
}

export {CombatController}
