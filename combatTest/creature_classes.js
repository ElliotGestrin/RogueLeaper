import {Card, CardHalf} from "./card_classes.js";
// The base class for every creature. Can move and attack
class Creature{
  constructor(copy = false){
    if(!copy){
      this.health = null;
      this.vulnerabilities = {};
      this.resistances = {};
      this.statusImmune = [];
      this.statuses = {};
      this.x = null; //x,y coordinates
      this.y = null;
      this.direction = 0; //Value between 0 and 360, rotation from up clockwise
      this.field = field; // The field the creature is attached to, used for simulating
    }
  }

  setImage(imgPath){
    let creatureImage = document.createElement('img');
    creatureImage.setAttribute('class','creature');
    creatureImage.setAttribute('src',imgPath);
    this.image = creatureImage;
    this.imagePath = imgPath;
  }

  // Points the creature to deg degrees. Assumes pointing up first
  point(deg){
    this.direction = deg % 360;
    if(this.image) this.image.style.transform ='rotate(' + deg % 360 + 'deg)';
  }

  // Turns the creature clockwise "deg" degrees
  turn(deg){
    if (deg < 0) deg = 360 + deg;
    this.point(this.direction + deg);
  }

  // Moves the creature "steps" steps forward, checking before each to
  // See if it's possible. Uses teleportTo for final move
  // If steps is negative it backs off
  move(steps){
    let newX = this.x;
    let newY = this.y;
    let xStep = (this.direction == 90)  ?   1 :
                (this.direction == 270) ?  -1 : 0;
    let yStep = (this.direction == 0)   ?  -1 :
                (this.direction == 180) ?   1 : 0;

    if (steps < 0){
      xStep *= -1;
      yStep *= -1;
      steps *= -1;
    }

    let delay = 0;

    for(let step = 0; step < steps; step++){
      let nextTile = this.field.getTile(newX + xStep, newY + yStep);
      if (nextTile && nextTile.walkable()){
        // Check if the new position even exists
        newX += xStep;
        newY += yStep;
        if(!combatController.simulating){
          // If not simulating, have 100ms between each step
          setTimeout(this.teleportTo.bind(this,newX,newY),delay);
          delay += 100;
        }
        else  this.teleportTo(newX,newY)
      }
    }
  }

  // Teleports the creature to x,y. Used for initial placement & move
  teleportTo(x,y){
    // Remove from current tile
    let currentTile = this.field.getTile(this.x, this.y);
    if (currentTile) currentTile.creature = null;
    // Update the stored position
    this.x = x;
    this.y = y;
    // Move the image
    let landingTile = this.field.getTile(this.x, this.y);
    if(landingTile.image) landingTile.image.append(this.image);
    landingTile.creature = this;
  }

  // Attack the designated steps away
  attack(forwardSteps,rightSteps,damage,type = null,statuses = null){
    let attackX = this.x;
    let attackY = this.y;
    switch (this.direction) {
      case 0:   attackY -= forwardSteps;
                attackX += rightSteps;
                break;
      case 90:  attackX += forwardSteps;
                attackY += rightSteps;
                break;
      case 180: attackY += forwardSteps;
                attackX -= rightSteps;
                break;
      case 270: attackX -= forwardSteps;
                attackY -= rightSteps;
                break;
    }
    let attackedTile = this.field.getTile(attackX, attackY);
    if(attackedTile) attackedTile.attacked(damage,type,statuses);
  }

  // Take damage, possibly after applying resistances or vulnerabilities
  takeDamage(damage, type = null){
    if (type in this.resistances) damage *= this.resistances[type];
    if (type in this.vulnerabilities) damage *= this.resistances[type];
    this.health -= damage;
  }

  applyStatus(statuses){
    for(status in statuses){
      if(!(status in this.statusImmune)) this.statuses[status] = statuses[status];
    }
  }

  // Returns the manhattan distance to another creature
  distanceTo(creature){
    return Math.abs(this.x - creature.x) + Math.abs(this.y - creature.y);
  }

  // Returns 2 if poining the closest direction, 1 if pointing second closest
  // -1 if pointing third closest, -2 if pointing furthest away, 0 if orthogonal
  pointingTowards(creature){
    let dX = creature.x - this.x;
    let dY = creature.y - this.y;
    // The "strongest" delta gets strength 2, the weakest one
    let dXPower = (Math.abs(dX) >= Math.abs(dY)) ? 2 : 1;
    let dYPower = (Math.abs(dY) >= Math.abs(dX)) ? 2 : 1;
    switch (this.direction) {
      case 0:   return -dYPower * Math.sign(dY);
      case 90:  return dXPower * Math.sign(dX);
      case 180: return dYPower * Math.sign(dY);
      case 270: return -dXPower * Math.sign(dX);
    }
  }

  // Copies all the elements except hand,deck and image onto a returned copy
  copy(copy){
    for(let element in this){
      // Don't try to copy hand, image or deck elements
      if (["hand","deck","image"].includes(element)) continue;
      let value = this[element]
      if (Array.isArray(value)){
        copy[element] = Array.from(value);
      }
      else if (typeof value == "object"){
        if (value != null){
          copy[element] = {}; // Copy's element must be object before assign
          Object.assign(copy[element], value);
        }
        else copy[element] = null;
      }
      else{
        // Otherwise its a "simple" data-type
        copy[element] = value;
      }
    }
    return copy;
  }
}

class Player extends Creature{
  constructor(copy = false){
    super(copy);
    if(!copy){
      this.health = 100;
      this.setImage("./images/player.png");
      this.image.setAttribute('class',this.image.getAttribute('class') + ' player');
    }
  }

  copy(){
    let copy = new Player(true);
    return super.copy(copy);
  }
}

class Enemy extends Creature{
  constructor(name, copy = false){
    super(copy)
    if(!copy){
      let jsonPath = "./enemies/" + name + ".json";
      let request = new XMLHttpRequest;
      request.open("GET",jsonPath);
      request.responseType = "json";
      request.send();
      request.onload = function(){
        let info = request.response;
        for (let stat in info){
          this[stat] = info[stat];
        }
        this.setupDeck();
        this.setImage("./enemies/images/" + this.imageName);
        this.hand = [];
        this.plan = [];
      }.bind(this)
    }
  }

  // Adds actual Card elements into .deck for the cards saved in json
  setupDeck(){
    for (let cardName in this.deck){
      let cardJSON = this.deck[cardName];
      let cardTop = new CardHalf(cardJSON.topTitle,cardJSON.topText,
                                 new Function("card", cardJSON.topEffect));
      let cardBottom = new CardHalf(cardJSON.bottomTitle,cardJSON.bottomText,
                                 new Function("card", cardJSON.bottomEffect));
      let card = new Card(cardTop,cardBottom,cardName);
      card.owner = this;
      this.deck[cardName] = card;
    }
  }

  // Adds handSize cards from deck into an array called ".hand"
  draw(){
    this.hand = [];
    let cardNames = Object.keys(this.deck);
    let numCardsInDeck = cardNames.length;
    for (let i = 0; i < this.handSize ; i++){
      // Pick a random card from the deck
      let pick = cardNames[Math.floor(Math.random()*numCardsInDeck)];
      this.hand[i] = this.deck[pick];
    }
  }

  // Return an array of arrays, each subarray being a possible line of play
  // Based on cards in hand
  possiblePlays(){
    return this.nextCards(this.hand, this.cardsPerTurn);
  }

  // Recursively generates every possible play. Creates an array of arrays
  nextCards(remainingHand, toPick){
    if (toPick <= 0 || !remainingHand) return [];
    let possiblePlays = [];

    for (let currentCard of remainingHand){
      // Create a shallow copy of the current hand, then remove the card based on index
      let handWithout = remainingHand.slice();
      let cardIndex = handWithout.indexOf(currentCard);
      handWithout.splice(cardIndex,1);

      let nextCards = this.nextCards(handWithout,toPick - 1)
      if (nextCards.length != 0){
        // If there were cards to follow, add this to the start
        for (let followUp of nextCards){
          followUp.unshift(currentCard)
          possiblePlays.push(followUp);
      }}else{
        // If there weren't, start a new sequence with this card
        possiblePlays.push([currentCard]);
      }
    }
    return possiblePlays;
  }

  // Returns a deep copy of the creature
  copy(){
    let copy = new Enemy(this.name, true);
    return super.copy(copy);
  }
}

export{Player, Enemy};
