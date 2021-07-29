import {CardTop} from "./card_classes.js";

let cardTops = {};

// Sneaky - One step forward
cardTops["Sneaky"] = new CardTop("Sneaky ", "Move 1", ()=>player.move(1));

// Walking - Two steps forward
cardTops["Walking"] = new CardTop("Walking ", "Move 2", ()=>player.move(2));

// Runnning - Three steps forward
cardTops["Running"] = new CardTop("Running ", "Move 3", ()=>player.move(3));

// Right - Turn right
cardTops["Right"] = new CardTop("Right ", "Turn right", ()=>player.turn(90));

// Back - Turn around
cardTops["Back"] = new CardTop("Back ", "Turn around", ()=>player.turn(180));

// Left - Turn left
cardTops["Left"] = new CardTop("Left ", "Turn left", ()=>player.turn(270));

// Stabby - Attack ahead weakly
cardTops["Stabby"] = new CardTop("Stabby ", "Attack ahead for 10 damage",
                                ()=>player.attack(1,0,10));

function randomCardTop(){
  let keys = Object.keys(cardTops);
  return cardTops[keys[Math.floor(Math.random()*keys.length)]]
}

export {cardTops, randomCardTop}
