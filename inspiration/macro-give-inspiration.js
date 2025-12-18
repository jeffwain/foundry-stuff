// Default
var itemName = "Inspiration";

/* Get available tokens */
let tokens = canvas.tokens.controlled.map(token => token.actor);
if (tokens == null || tokens.length == 0) {
    tokens = canvas.tokens.placeables.map(t => t.actor).filter(token => token.type == "character")
}
if (!tokens) {
    ui.notifications.warn(`No PC tokens.`)
    return
}
let tokenNames = tokens.map(t => t.name);
let tokenPoints = tokens.map(t => getItem(t).system.uses.value);
let selectedToken = "";

function getItem(token) {
  let item = token.items.getName(itemName);
  if (!item) {
    ui.notifications.warn(`Couldn't find ${itemName}.`)
    return
  }
  return item;
}

/* Create a dialog to select characters. */
let tokenName = tokenNames[0];

async function givePoints(html, points, characterName) {
  // Get the character
  let selectedToken = game.actors.getName(characterName);
  console.log(selectedToken);

  // Get the inspiration item
  let item = selectedToken.items.getName(itemName);
  let currentPoints = item.system.uses.value;
  console.log(currentPoints);

  let newChargeValue = item.system.uses.spent - points;
  console.log("newChargeValue:" + newChargeValue)
  let update = {"system.uses.spent": newChargeValue};
  let updatedItem = item.update(update);
  console.log(item);
    ui.notifications.info(`${selectedToken.name} given a point of inspiration. Current points: ${item.system.uses.value + points}`);

  ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({token: selectedToken}),
    content: `<p>${selectedToken.name} gains ${points} point${points != 1 ? "s" : ""} of inspiration, and now has ${item.system.uses.value + points}.</p>`
  });
}

new Dialog({
  title: '🌈 Give Inspiration',
  content: `
  <style>
    .dialog-content {
      max-height: none !important;
    }
    .app.window-app.dialog {
      height: auto !important;
    }
    .dialog .dialog-buttons button {
      flex-basis: content;
    }
    fieldset {
      border: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }
    .input type=["checkbox"] {

    }
  </style>
  <form>
    <div class="form-group">
      <label for="token-name">Character</label>
      <div>
      ${tokenNames.map(name => `
        <label>
          <input type="checkbox" name="characters" value="${name}" checked/>
          ${name} (${tokenPoints[tokenNames.indexOf(name)] ?? 0})
        </label>`).join("")
      }
      </div>
    </div>
    <div class="form-group">
      <p id="description">Select the number of points to give.<br></p>
    </div>
  </form>
`,
  buttons: {
    single: {
      label: '1 point of inspiration',
      callback: async (html) => {
        let selected = html.find('[name="characters"]').toArray();
        await console.log(selected)
        selected.forEach(character => {
	  if (character.checked) {
            console.log(character.value);
            givePoints(html, 1, character.value);
	  }
        });
      }
    },
    cancel: {
      label: 'Cancel'
    }
  },
  default: 'cancel',
  close: () => {},
  render: (html) => {
  }
}).render(true);
