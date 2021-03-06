import {Field} from "./field_classes.js";

class CombatController{
  constructor(){
    this.simulating = false;
  }

  endTurn(){

    // Let all the enemies decide their plays
    this.simulating = true;
    field.clearAttacked();
    for(let enemyID in enemies){
      enemies[enemyID].draw();
      // ID is used to find the correct enemy in the copied version
      this.decidePlayFor(enemyID);
    }
    this.simulating = false;

    // Decide the play order
    let playOrder = this.decidePlayOrder();

    // Play all the cards in order, 1 sec between each one
    let wait = 0;
    for(let cardToPlay of playOrder){
      setTimeout(cardToPlay.play.bind(cardToPlay), wait);
      wait += 1000;
    }

    // Discard current cards in hand and draw new
    setTimeout(() => {
      playZone.discardCards();
      for (let i = 0; i < player.drawPerTurn; i++){
        hand.addCard(deck.draw());
      }
    }, wait);
  }

  // Decides the play for the enemy with enemyID and saves in .toPlay
  decidePlayFor(enemyID){
    console.log("Deciding play for: " + enemyID);
    console.log(enemies[enemyID].hand)
    let enemy = enemies[enemyID]
    let possiblePlays = enemy.possiblePlays();
    let bestPlay = [];
    let bestValue = Number.NEGATIVE_INFINITY; // Arbitrary largely negative number
    for (let play of possiblePlays){
      //console.log("Evaluating: ");
      //console.log(play);
      let {fieldCopy, playerCopy, enemiesCopy} = this.copyEverything();
      // Order in enemies is kept while copying, so ID is the same
      let enemyCopy = enemiesCopy[enemyID];
      for (let card of play){
        // Set the cards owner to be the copy. This way the card doesn't need
        // To be copied
        card.owner = enemyCopy;
        card.play();
      }
      let before = {"field" : field, "player" : player, "enemy" : enemy};
      let after = {"field" : fieldCopy, "player" : playerCopy, "enemy" : enemyCopy};
      let playValue = this.evaluatePlay(before, after);
      //console.log(after);
      //console.log(before);
      //console.log(playValue);
      // If the new play is better than the best, update the best
      if (playValue > bestValue){
        console.log("New best! - " + playValue)
        console.log(play);
        bestValue = playValue;
        bestPlay = play;
      }
    }
    // Restore the owner of all cards in hand. Only those can have changed
    for (let card of enemy.hand){
      card.owner = enemy;
    }
    enemy.toPlay = bestPlay; // Save the best play
  }

  // Evaluates a play based on the state before and after. Returns score
  evaluatePlay(before, after){
    let value = 0;
    // Hurting and getting closer to the player
    value += before.player.health - after.player.health;
    value += (before.player.distanceTo(before.enemy) - after.player.distanceTo(after.enemy))*2;
    // Having the player ahead (2 to -2), and being behind player (0.5 to -0.5)
    value += after.enemy.pointingTowards(after.player);
    value -= after.player.pointingTowards(after.enemy) / 4;
    // Attacking spaces around the player
    for(let dY = -2; dY <= 2; dY++){
      for(let dX = -2; dX <=2; dX++){
        let distance = Math.abs(dY) + Math.abs(dX);
        if (![1,2].includes(distance)) continue; // Only check at distance 1 and 2
        let tile = after.field.getTile(before.player.x + dX, before.player.y + dY);
        if (tile && tile.attackedFor){
          // posModifier decreases the likelier the player is there. Min 2
          let posModifier = 3 + distance - before.player.pointingTowards(tile);
          value += tile.attackedFor / posModifier;
        }
      }
    }
    return value
  }

  // Decides order of cards and returns it
  decidePlayOrder(){
    let initiatives = {};
    let playOrder = [];
    player.toPlay = playZone.toPlay();
    let creatures = Array.from(enemies);
    creatures.push(player);
    creatures.sort((a,b) => b.initiative - a.initiative);
    let creaturesStillPlaying = true;
    while(creaturesStillPlaying){
      creaturesStillPlaying = false; // If no one has cards left to play, round ends
      for (let creature of creatures){
        if (creature.toPlay.length != 0){
          playOrder.push(creature.toPlay.shift())
          creaturesStillPlaying = true;
        }
      }
    }
    return playOrder;
  }

  // Create copies of field, player and enemies. For simulating
  copyEverything(){
    let fieldCopy = field.copy();
    let playerCopy = player.copy();
    playerCopy.field = fieldCopy;
    playerCopy.teleportTo(playerCopy.x, playerCopy.y);

    playerCopy.copyMarker = true;

    let enemiesCopy = [];
    for (let enemy of enemies){
      let enemyCopy = enemy.copy();
      enemyCopy.field = fieldCopy;
      if (enemyCopy.x) enemyCopy.teleportTo(enemyCopy.x, enemyCopy.y);
      enemiesCopy.push(enemyCopy);
    }
    return {fieldCopy,playerCopy,enemiesCopy}
  }
}

export {CombatController}
