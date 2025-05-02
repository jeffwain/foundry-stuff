//Check if token is selected
let temp = ""
if (game.user.character) {
  temp = game.user.character
}
else if (canvas.tokens.controlled.length > 0) {
  temp = canvas.tokens.controlled[0].actor
}
await console.log(temp)

if (temp) {
  let deadeye = temp.items.find(i => i.name == "Deadeye")
  let newCritThreshold = 20

  await deadeye.update({ "system.uses.spent": deadeye.system.uses.max })
  await console.log("Reset Deadeye charges")
  await ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({
      token: temp
    }),
    content: `<h2>Miss!</h2>Gak misses with a ranged shot, resetting Deadeye.`
  });

  let allFirearms = temp.items.filter(i => i.system.properties && i.system.properties.has("fir"))
  allFirearms.forEach(firearm => {
    console.log(firearm);
    let attack = firearm.system.activities.find(a => a.type == "attack");
    if (attack) {
      console.log(attack);
      console.log(attack.attack.critical.threshold);
      updateCritRange(attack, newCritThreshold);
    }
  });
}
else {
  await console.log("No token could be found to reload.")
  await ui.notifications.error("No token could be found to reload.")
}


async function updateCritRange(attack, newCritThreshold) {
  await attack.update({ "attack.critical.threshold": newCritThreshold });
}
function updateDeadeye(feature, totalHits) {
  feature.update({ "system.uses.spent": totalHits });
}