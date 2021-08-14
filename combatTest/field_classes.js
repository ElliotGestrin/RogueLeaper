class Tile{
  // Creates the tile and automatically attaches it to the field
  constructor(x,y,field,copy = false){
    if(!copy){
      // If it's not a copy, attach it to the image
      let image = document.createElement('div');
      image.setAttribute('class','tile');
      image.setAttribute('id', x + ','+y);
      image.style.gridRow = y;
      image.style.gridColumn = x;
      field.image.append(image);
      this.image = image;
    }
    this.x = x;
    this.y = y;
    this.identifier = x + ',' + y;
    this.statuses = {};
    this.attackedFor = 0;
    this.creature = null;
  }

  attacked(damage,type,statuses){
    if(!combatController.simulating) this.image.style.animation = "";
    if(!combatController.simulating) setTimeout(Tile.animateTileAttack.bind(this),10);
    if (this.creature && damage > 0) this.creature.takeDamage(damage,type);
    if (this.creature && statuses) this.creature.applyStatus(statuses);
    this.attackedFor += damage;
  }

  walkable(){
    if (this.creature || this.statuses["blocked"]) return false;
    return true;
  }

  // Creates a deep copy of the tile. Does not copy creatures
  copy(){
    let copy = new Tile(this.x,this.y,null,true);
    Object.assign(copy.statuses, this.statuses);
    return copy
  }

  static animateTileAttack(){
      this.image.style.animation = "tileAttacked 400ms 2 alternate";
  }
}

class Field{
  constructor(width,height,copy = false){
    this.width = width;
    this.height = height;
    this.tiles = {}
    if(!copy){
      // If it's not a copy, correctly place the tiles
      let image = document.querySelector('.field');
      this.image = image;
      for (let y = 1; y <= height; y++){
         for (let x = 1; x <= width; x++){
           this.tiles[x + "," + y] = new Tile(x,y,this);
      }}
      image.style.gridTemplateRows = "auto ".repeat(height);
      image.style.gridTemplateColumns = "auto ".repeat(width);
    }
  }

  // Returns the tile at x,y, or null
  getTile(x,y){
    let tile = this.tiles[x + "," + y];
    return tile ? tile : null;
  }

  // Returns a deep copy of the field. All creatures on the field are also copied
  copy(){
    let copy = new Field(this.width,this.height,true);
    for (let y = 1; y <= this.height; y++){
       for (let x = 1; x <= this.width; x++){
         copy.tiles[x + "," + y] = this.tiles[x + "," + y].copy();
    }}
    return copy;
  }

  clearAttacked(){
    for (let tileID in this.tiles){
      this.tiles[tileID].wasAttacked = 0;
    }
  }
}

export {Field, Tile};
