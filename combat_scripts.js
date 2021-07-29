let numTilesWidth = 7;
let numTilesHeight = 7;
let numCardsPerTurn = 2;
let maxCardsInHand = 10;
let initialCardsInHand = 5;

let player = new Player("images/player.png");
let hand = new Hand(maxCardsInHand);
let playZone = new PlayZone(numCardsPerTurn);
let deck = new Deck();
let discard = new Discard();
let field = new Field(numTilesWidth,numTilesHeight);
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
