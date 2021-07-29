import {CardHalf, Card} from "../card_classes.js";

export let troll = {
  "trollBash" : new Card(
      new CardHalf("Bash", "Attack for 20",(card)=>card.owner.attack(20)),
      new CardHalf("","",(card)=>""))
}
