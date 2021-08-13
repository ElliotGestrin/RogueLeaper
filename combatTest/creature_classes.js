import {Card, CardHalf} from "./card_classes.js";
// The base class for every creature. Can move and attack
class Creature{
  constructor(){
    this.health = null;
    this.vulnerabilities = {};
    this.resistances = {};
    this.statusImmune = [];
    this.statuses = {};
    this.x = null; //x,y coordinates
    this.y = null;
    this.direction = 0; //Value between 0 and 360, rotation from up clockwise
  }

  setImage(imgPath){
    let creatureImage = document.createElement('img');
    creatureImage.setAttribute('class','creature');
    creatureImage.setAttribute('src',imgPath);
    this.image = creatureImage;
  }

  // Points the creature to deg degrees. Assumes pointing up first
  point(deg){
    this.direction = deg % 360;
    this.image.style.transform ='rotate(' + deg % 360 + 'deg)';
  }

  // Turns the creature clockwise "deg" degrees
  turn(deg){
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
      let nextTile = field.getTile(newX + xStep, newY + yStep);
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
    let currentTile = field.getTile(this.x, this.y);
    if (currentTile) currentTile.creature = null;
    // Update the stored position
    this.x = x;
    this.y = y;
    // Move the image
    let landingTile = field.getTile(this.x, this.y);
    landingTile.image.append(this.image);
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
    let attackedTile = field.getTile(attackX, attackY);
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
}

class Player extends Creature{
  constructor(imgPath, health = 100){
    super();
    this.health = health;
    this.setImage(imgPath);
    this.image.setAttribute('class',this.image.getAttribute('class') + ' player');
  }
}

class Enemy extends Creature{
  constructor(name){
    let jsonPath = "./enemies/" + name + ".json";
    super()
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
      console.log(this);
    }.bind(this)
  }

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
}

export{Player, Enemy};
