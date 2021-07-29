cardBottoms = []

// Farewell - Say "Bye!"
cardBottoms["Farewell"] = new CardBottom("Farewell", "Say bye", ()=>console.log("Bye!"))

function randomCardBottom(){
  let keys = Object.keys(cardBottoms);
  return cardBottoms[keys[Math.floor(Math.random()*keys.length)]]
}
