// Cards is a "dictionary" between every card's identifier and the card
// itself. Let's cards be easily found between holders.
let cards = {};

// CardTop contain the top half of the effect and half the title of the card
// They happen before the CardBottomtom. No image of their own
class CardTop{
  constructor(titleHalf, effectText, effect){
    this.titleHalf = titleHalf;
    this.effectText = effectText;
    this.effect = effect; // The function to call to activate the effect
  }
}

// CardBottom contain the bottom half of the effect and half the title of the card
// They happen after the CardTop. No image of their own. Sometimes optional
class CardBottom{
  constructor(titleHalf, effectText, effect){
    this.titleHalf = titleHalf;
    this.effectText = effectText;
    this.effect = effect; // The function to call to activate the effect
  }
}

// Cards are made up of two parts, card-top and card-bottom. They're stored in
// Cardslots while displayed, but can be hidden, such as in deck
class Card{
  constructor(cardTop,cardBottom,identifier){
    let cardImage = document.createElement("div");
    // Generate the text on the card based on the top and bottom halfs
    let cardHTML = "<h3>" + cardTop.titleHalf + " " + cardBottom.titleHalf + "</h3> ";
    cardHTML += "<p>" + cardTop.effectText + "</p> ";
    cardHTML += "<p>" + cardBottom.effectText + "</p> ";
    cardHTML += "<p><i>" + identifier + "</i></p>";
    cardImage.innerHTML = cardHTML;
    cardImage.setAttribute('class', 'card');
    // The "identifier" attribute let us go from the image to the card instance
    // via the "cards" object through: cards[identifier]
    cardImage.setAttribute('identifier', identifier);
    // Using the above method we find the pressed card from the image and
    // trigger it's "pressed" function
    cardImage.setAttribute('onClick', "cards[event.target.closest('.card').getAttribute('identifier')].pressed()")

    this.cardTop = cardTop;
    this.cardBottom = cardBottom;
    this.title = cardTop.titleHalf + " " + cardBottom.titleHalf;
    this.image = cardImage;
    this.identifier = identifier;
    this.slot = null;

    //Add it to the list of all cards
    cards[identifier] = this;
  }

  setActive(){
    this.image.setAttribute('class', 'card active-card');
  }

  setInActive(){
    this.image.setAttribute('class', 'card');
  }

  // Activate the effect of playing the card. First the top then the bottom
  play(){
    this.cardTop.effect();
    this.cardBottom.effect();
  }

  // Toggle active status when pressed. Only one card active at a time.
  pressed(event){
    let activeCard = getActiveCard();

    if (activeCard == this){//If active become unactive
      this.setInActive();
    }
    else if (!activeCard){//No other selected, become active
      this.setActive();
    }
  }
}

// CardSlot contain displayed cards. They can be empty. Displayed cards
// Are always stored in a card slot.
// Card slots are always stored in a holders "slot" property
class CardSlot{
  constructor(identifier, holder){
    let slotImage = document.createElement('div');
    slotImage.setAttribute('class','card-slot');
    // "identifier" and "holder" attributes let us find the objects themselves
    // from the image via holders[holder].slots[identifier]
    slotImage.setAttribute('identifier',identifier);
    slotImage.setAttribute('holder',holder);
    // Use the above description to find the correct slots instance and trigger
    // It's "pressed" function when the image is pressed
    slotImage.setAttribute('onClick','\
      holders[event.target.closest(".card-slot").getAttribute("holder")]\
     .slots[event.target.closest(".card-slot").getAttribute("identifier")]\
     .pressed();');
    this.image = slotImage;
    this.identifier = identifier;
    this.holder = holder; //Name of the object holding the .slots the slot is stored in
    this.card = null;
  }

  // Adds a card to the slot. Takes the card-object, not card ID
  placeCard(card){
    this.card = card;
    this.card.slot = this;
    this.image.append(card.image);
  }

  // Removes the current card from the object and returns it
  // Takes a parameter for if the slot will be empty afterwards
  // Which can be used by child-classes, such as hand-slot
  removeCard(leavingEmpty = false){
    if (this.card){ //If it contains a card, remove it
      let card = this.card;
      card.image.remove();
      card.slot = null;
      this.card = null;
      return card;
    }
  }

  // Switches card with the requested slot. Both must have a card
  switchCard(switchSlot){
    let currentCard = this.removeCard();
    let switchCard = switchSlot.removeCard();
    console.log("Current: " + currentCard + "\nSwitch: " + switchCard)
    this.placeCard(switchCard);
    switchSlot.placeCard(currentCard);
  }

  // When pressed, place the active card in this slot. Switches cards with
  // Current active if already contains a card
  pressed(){
    let activeCard = getActiveCard();
    if (this.card){ // If it contains a card
        // If another card is active, switch with it
        if (activeCard && activeCard != this.card){
          this.switchCard(activeCard.slot);
          activeCard.setInActive();
        }
    }
    else if (activeCard){ // If it doesn't contain and another is active
      activeCard.slot.removeCard(true);
      this.placeCard(activeCard);
      activeCard.setInActive();
    }
  }
}

// PlaySlot contain the cards which will be played
class PlaySlot extends CardSlot{
  constructor(position){
    super(position, "playZone");
    let playZone = document.querySelector('.play-zone');
    playZone.append(this.image);
    this.image.setAttribute('class', this.image.getAttribute('class') + " play-slot");
    this.image.style.order = position;
  }
}

// PlayZone is a holder that contains the play-slots
class PlayZone{
  constructor(numInitialSlots){
    this.image = document.querySelector('.play-zone');
    this.slots = {};
    for(let i = 0; i < numInitialSlots; i++){
      this.newSlot();
    }
  }

   // Adds a new slot, always at the end with identifier = position
  newSlot(){
    let position = Object.keys(this.slots).length;
    let slot = new PlaySlot(position);
    this.slots[position] = slot;
    this.image.append(slot.image);
    return(slot);
  }

  // Removes the last slot
  removeSlot(){
    let position = max(Object.keys(this.slots));
    let slot = this.slots[position];
    // Makes sure no reference exists to slot so it can be garbage-collected
    if (slot.card) slot.removeCard();
    slot.image.remove();
    delete this.slots[position]
  }
}

// HandSlot contains the cards in hand. Dynamically removed and added by
// "Hand"
class HandSlot extends CardSlot{
  constructor(position){
    super(position, "hand");
    this.image.setAttribute('class', this.image.getAttribute('class') + " hand-slot");
  }

  // If it's left empty, tell the hand to remove it
  removeCard(leavingEmpty){
    let card = super.removeCard(leavingEmpty);
    if(leavingEmpty){
      hand.removeSlot(this.identifier);
    }
    return card;
  }
}

// Hand is a holder containing hand slots. It dynamially adds and removes them
// As needed.
class Hand{
  constructor(maxCardsInHand){
    this.image = document.querySelector('.hand');
    this.slots = {};
    this.limit = maxCardsInHand;
  }

  // Remove the requested slot based on it's identifier
  removeSlot(identifier){
    this.slots[identifier].image.remove();
    delete this.slots[identifier];
  }

  // Add a new slot. Uses lowest free integer as identifier
  newSlot(){
    let identifier = 0;
    while (identifier in this.slots) identifier += 1; // Get first free integer
    let slot = new HandSlot(identifier);
    this.slots[slot.identifier] = slot;
    this.image.append(slot.image);
    return(slot);
  }

  // Adds a new slot to the hand, and places the new card in it
  addCard(card){
    let slot = this.newSlot();
    slot.placeCard(card);
  }

  pressed(event){
    //Only do somehthing if the hand is pressed
    if(event.target.getAttribute('class') != 'hand') return null;
    let activeCard = getActiveCard();
    if(activeCard && activeCard.slot.holder == 'playZone'){
      // If a card is active and said active card is in play-zone
      // Move the card over to a new slot
      activeCard.slot.removeCard(true);
      this.addCard(activeCard);
      activeCard.setInActive();
    }
  }
}

// Deck contains cards in an ordered list. Can open as a holder. (eventually)
class Deck{
  constructor(){
    // An array of the cards in the deck. 0th index at the top
    this.cards = [];
  }

  // Remove and return the top card
  draw(){
    return this.cards.shift();
  }

  // Adds a card to the bottom of the deck
  add(card){
    this.cards.push(card)
  }

  // Adds a card at the specified place, measured from top (which is 0)
  addAt(card, index){
    // Remove 0 items from the array at the index position, then insert
    this.cards.splice(index, 0, card);
  }

  // Shuffle the deck
  shuffle(){
    // Implements Fisher-Yales shuffle
    let numberUnshuffled = this.cards.length;
    let drawnIndex, lastUnshuffled;
    while (numberUnshuffled > 0){
      // Random integer between 0 and last unshuffled index
      drawnIndex = Math.floor(Math.random() * numberUnshuffled);
      numberUnshuffled -= 1; // Index of last unshuffled card
      lastUnshuffled = this.cards[numberUnshuffled];
      this.cards[numberUnshuffled] = this.cards[drawnIndex];
      this.cards[drawnIndex] = lastUnshuffled;
    }
  }

  // When pressed print the names and id of all card in order into console
  pressed(event){
    let deckContent = "";
    this.cards.forEach(function (card, position){
      deckContent += position + ": " + card.title + " (" + card.identifier + ")\n";
    });
    console.log(deckContent);
  }
}

// Discard contains cards in an ordered list. Can open as a holder. (eventually)
class Discard{
  constructor(){
    // An array of the cards in the deck. 0th index first discarded
    this.cards = [];
  }

  // Adds a card to the the discard
  add(card){
    this.cards.push(card)
  }

  // When pressed print the names and id of all card in order into console
  pressed(event){
    let deckContent = "";
    this.cards.forEach(function (card, position){
      deckContent += position + ": " + card.title + " (" + card.identifier + ")\n";
    });
    console.log(deckContent);
  }
}

// Returns the card identifier of the currently active card, or "null" if none
function getActiveCard(){
  let activeImage = document.querySelector('.active-card');
  return activeImage ? cards[activeImage.getAttribute('identifier')] : null;
}
