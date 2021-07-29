let numTilesWidth = 7;
let numTilesHeight = 7;
let numCardsPerTurn = 2;
let maxCardsInHand = 10;
let initialCardsInHand = 5;

import {Hand, PlayZone, Deck, Discard, Card} from "./card_classes.js";
import {Player} from "./creature_classes.js";
import {Field} from "./field_classes.js";
import {cardTops, randomCardTop} from "./cardTops.js";
import {cardBottoms, randomCardBottom} from "./cardBottoms.js";

// Used as "window.var" to become global variables for all modules
window.player = new Player("images/player.png");
window.hand = new Hand(maxCardsInHand);
window.playZone = new PlayZone(numCardsPerTurn);
window.deck = new Deck();
window.discard = new Discard();
window.field = new Field(numTilesWidth,numTilesHeight);
// This is used to convert from the card-zones image attribute "holder",
// Holders is a "dictionary" of every item containing card-zones
// Which is string only, to the correct holder object
window.holders = {"hand" : hand, "playZone"  : playZone,
                  "deck" : deck, "discard"   : discard   }

function setup() {
  let root = document.querySelector(":root");

  //Setup the tile-size
  root.style.setProperty("--tile-width", "60px");
  root.style.setProperty("--tile-height", "60px");


  //Set up the player
  player.point(90);
  player.teleportTo(1,4);
}

window.playClicked = function (){
  for(let slotID in playZone.slots){
    let cardToPlay = playZone.slots[slotID].card
    if(cardToPlay) cardToPlay.play();
  }
}
setup();

for(let i = 0; i < 10; i++){
  deck.add(new Card(randomCardTop(), randomCardBottom(), "D" + i));
}
deck.shuffle();
for(let i = 0; i < initialCardsInHand; i++){
  hand.addCard(deck.draw());
}
