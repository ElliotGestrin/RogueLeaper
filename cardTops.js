let cardTops = {};

// Greet1 - Says hi
cardTops["Greet1"] = new CardTop("Greet1 ", "Say hi!", ()=>console.log("Hi!"))

// Greet2 - Says hello
cardTops["Greet2"] = new CardTop("Greet2 ", "Say hello!", ()=>console.log("Hello!"))

function randomCardTop(){
  let keys = Object.keys(cardTops);
  return cardTops[keys[Math.floor(Math.random()*keys.length)]]
}
