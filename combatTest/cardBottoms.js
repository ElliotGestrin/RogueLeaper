import {CardHalf} from "./card_classes.js";

let cardBottoms = {}

// Sneak - Forward one step
cardBottoms["Sneak"] = new CardHalf("Sneak", "Move 1",
  (card)=>card.owner.move(1));

// Walking - Two steps forward
cardBottoms["Walk"] = new CardHalf("Walk", "Move 2",
  (card)=>card.owner.move(2));

// Retreat - Back one step
cardBottoms["Retreat"] = new CardHalf("Retreat", "Back of one space",
  (card)=>card.owner.move(-1))

// Stab - Attack ahead weakly
cardBottoms["Stab"] = new CardHalf("Stab", "Attack ahead for 10 damage",
  (card)=>card.owner.attack(1,0,10));

// Bash - Attack ahead hard
cardBottoms["Bash"] = new CardHalf("Bash", "Attack ahead for 20 damage",
  (card)=>card.owner.attack(1,0,20));

// Skewer - Attack ahead hard
cardBottoms["Skewer"] = new CardHalf("Skewer", "Attack both spaces ahead for 15 damage",
  (card)=>{card.owner.attack(1,0,15); card.owner.attack(2,0,15)});




function randomCardBottom(){
  let keys = Object.keys(cardBottoms);
  return cardBottoms[keys[Math.floor(Math.random()*keys.length)]]
}

export {cardBottoms, randomCardBottom};
