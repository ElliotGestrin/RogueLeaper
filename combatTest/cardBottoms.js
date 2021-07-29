import {CardBottom} from "./card_classes.js";

let cardBottoms = {}

// Sneak - Forward one step
cardBottoms["Sneak"] = new CardBottom("Sneak", "Move 1", ()=>player.move(1));

// Walking - Two steps forward
cardBottoms["Walk"] = new CardBottom("Walk", "Move 2", ()=>player.move(2));

// Retreat - Back one step
cardBottoms["Retreat"] = new CardBottom("Retreat", "Back of one space",
  ()=>player.move(-1))

// Stab - Attack ahead weakly
cardBottoms["Stab"] = new CardBottom("Stab", "Attack ahead for 10 damage",
  ()=>player.attack(1,0,10));

// Bash - Attack ahead hard
cardBottoms["Bash"] = new CardBottom("Bash", "Attack ahead for 20 damage",
  ()=>player.attack(1,0,20));

// Skewer - Attack ahead hard
cardBottoms["Skewer"] = new CardBottom("Skewer", "Attack both spaces ahead for 15 damage",
  ()=>{player.attack(1,0,15),player.attack(2,0,15)});




function randomCardBottom(){
  let keys = Object.keys(cardBottoms);
  return cardBottoms[keys[Math.floor(Math.random()*keys.length)]]
}

export {cardBottoms, randomCardBottom};
