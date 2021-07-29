import {CardTop} from "./card_classes.js";

let cardTops = {};

// Greet1 - Says hi
cardTops["Sneaky"] = new CardTop("Sneaky ", "Move 1", ()=>player.move(1))

// Greet2 - Says hello
cardTops["Walking"] = new CardTop("Walking ", "Move 2", ()=>player.move(2))

function randomCardTop(){
  let keys = Object.keys(cardTops);
  return cardTops[keys[Math.floor(Math.random()*keys.length)]]
}

export {cardTops, randomCardTop}
