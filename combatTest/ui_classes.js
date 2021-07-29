class PlayButton{
  constructor(){
    this.image = document.querySelector('.play-button');
  }

  pressed(){
    let wait = 0;
    for(let slotID in playZone.slots){
      let cardToPlay = playZone.slots[slotID].card;
      if(cardToPlay){
        setTimeout(cardToPlay.play.bind(cardToPlay),wait);
        wait += 1000;
    }}
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
