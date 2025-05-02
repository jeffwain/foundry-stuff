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
  console.log(deadeye);
  let maxCharges = deadeye.system.uses.max
  let totalHits = deadeye.system.uses.spent - 1
  updateDeadeye(deadeye, totalHits)
  let newCritThreshold = 20 - deadeye.system.uses.value - 1

  if (deadeye.system.uses.value >= maxCharges) {
    await ui.notifications.warn("Already have max Deadeye charges.")
    await ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({
        token: temp
      }),
      content: `<h2>Hit!</h2>Gak hits with a ranged shot, but has already maxxed out Deadeye charges, critting on a ${newCritThreshold}-20.`
    });
    return;
  }

  await deadeye.update({ "system.uses.value": deadeye.system.uses.value + 1 })
  await ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({
      token: temp
    }),
    content: `<h2>Hit!</h2>Gak hits with a ranged shot, gaining a charge of Deadeye. Gak now crits on a ${newCritThreshold}-20.`
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
  await console.log("No token found.")
  await ui.notifications.error("No token found or selected.")
}

async function updateCritRange(attack, newCritThreshold) {
  await attack.update({ "attack.critical.threshold": newCritThreshold });
}
function updateDeadeye(feature, totalHits) {
  feature.update({ "system.uses.spent": totalHits });
}