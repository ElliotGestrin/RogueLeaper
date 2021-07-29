class Tile{
  // Creates the tile and automatically attaches it to the field
  constructor(x,y,field){
    let image = document.createElement('div');
    image.setAttribute('class','tile');
    image.setAttribute('id', x + ','+y);
    image.style.gridRow = y;
    image.style.gridColumn = x;
    field.image.append(image);

    this.image = image;
    this.x = x;
    this.y = y;
    this.identifier = x + ',' + y;
    this.statuses = {};
    this.creature = null;
  }

  attacked(damage,type,statuses){
    this.image.style.animation = "";
    setTimeout(Tile.animateTileAttack.bind(this),10);
    if (damage > 0) this.creature.takeDamage(damage,type);
    if (statuses) this.creature.applyStatus(statuses);
  }

  static animateTileAttack(){
    this.image.style.animation = "tileAttacked 500ms 2 alternate";
  }
}

class Field{
  constructor(width,height){
    let image = document.querySelector('.field');
    this.image = image;
    // Place all the tiles correctly
    this.tiles = {}
    for (let y = 1; y <= height; y++){
       for (let x = 1; x <= width; x++){
         this.tiles[x + "," + y] = new Tile(x,y,this);
    }}
    image.style.gridTemplateRows = "auto ".repeat(height);
    image.style.gridTemplateColumns = "auto ".repeat(width);
  }

  // Returns the tile at x,y
  getTile(x,y){
    return this.tiles[x + "," + y];
  }
}
