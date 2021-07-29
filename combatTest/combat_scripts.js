let numTilesWidth = 7;
let numTilesHeight = 7;
let numCardsPerTurn = 2;
let maxCardsInHand = 10;
let initialCardsInHand = 5;

import {Hand, PlayZone, Deck, Discard} from "./card_classes.js";
import {Player} from "./creature_classes.js";
import {Field} from "./field_classes.js";

// Used as "window.var" to become global variables for all modules
let window.player = new Player("images/player.png");
let window.hand = new Hand(maxCardsInHand);
let window.playZone = new PlayZone(numCardsPerTurn);
let window.deck = new Deck();
let window.discard = new Discard();
let window.field = new Field(numTilesWidth,numTilesHeight);
// Holders is a "dictionary" of every item containing card-zones
// This is used to convert from the card-zones image attribute "holder",
// Which is string only, to the correct holder object
let holders = {"hand" : hand, "playZone"  : playZone,
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

function playClicked(){
  for(slotID in playZone.slots){
    cardToPlay = playZone.slots[slotID].card
    if(cardToPlay) cardToPlay.play();
  }
}

function tileAttacked(tile){
  tile.setAttribute('class', 'tile attacked');
  setTimeout(function () {
    tile = document.querySelector(".attacked")
    tile.setAttribute('class', tile.getAttribute('class').replace(' attacked',''));
  },1000)
}

setup();

let topCard = new CardTop("Top ", "Top-Effect", "Break", () => console.log("Top!"));
let botCard = new CardBottom("Bottom ", "Bottom-Effect", () => console.log("Bot!"))

for(let i = 0; i < 10; i++){
  deck.add(new Card(randomCardTop(), randomCardBottom(), "D" + i));
}
deck.shuffle();
for(let i = 0; i < initialCardsInHand; i++){
  hand.addCard(deck.draw());
}
