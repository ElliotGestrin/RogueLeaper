import {CardHalf} from "./card_classes.js";

let cardTops = {};

// Sneaky - One step forward
cardTops["Sneaky"] = new CardHalf("Sneaky ", "Move 1",
  (card)=>card.owner.move(1));

// Walking - Two steps forward
cardTops["Walking"] = new CardHalf("Walking ", "Move 2",
  (card)=>card.owner.move(2));

// Runnning - Three steps forward
cardTops["Running"] = new CardHalf("Running ", "Move 3",
  (card)=>card.owner.move(3));

// Right - Turn right
cardTops["Right"] = new CardHalf("Right ", "Turn right",
  (card)=>card.owner.turn(90));

// Back - Turn around
cardTops["Back"] = new CardHalf("Back ", "Turn around",
  (card)=>card.owner.turn(180));

// Left - Turn left
cardTops["Left"] = new CardHalf("Left ", "Turn left",
  (card)=>card.owner.turn(270));

// Stabby - Attack ahead weakly
cardTops["Stabby"] = new CardHalf("Stabby ", "Attack ahead for 10 damage",
  (card)=>card.owner.attack(1,0,10));

function randomCardTop(){
  let keys = Object.keys(cardTops);
  return cardTops[keys[Math.floor(Math.random()*keys.length)]]
}

export {cardTops, randomCardTop}
