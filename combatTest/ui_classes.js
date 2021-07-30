class PlayButton{
  constructor(){
    this.image = document.querySelector('.play-button');
  }

  pressed(){
    combatController.endTurn();
  }
}

class OptionsButton{
  constructor(){
    this.image = document.querySelector('.option-button')
    this.optionsStatus = "Hidden";
  }

  pressed(){
    let optionsMeny = document.querySelector('.options-meny')
    if (this.optionsStatus == "Hidden"){
      optionsMeny.style.display = "block";
      this.optionsStatus = "Showing";
    }
    else{
      optionsMeny.style.display = "none";
      this.optionsStatus = "Hidden";
    }
  }
}

export {PlayButton,OptionsButton}
