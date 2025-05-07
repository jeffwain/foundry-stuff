let controlled = canvas.tokens.controlled
let tokens = controlled.map(token => token.actor)
if (tokens == null || tokens.length == null || tokens.length == 0) {
  tokens = canvas.tokens.placeables.filter(token => token.actor.type = 'character')
}
if (!tokens) {
  ui.notifications.warn(`No PC tokens.`)
  return
}
let tokenNames = tokens.map(t => t.name);

let characterSelect = ``;
let tokenName = "";
if (tokenNames.length > 1) {
  characterSelect = `
    <div class="form-group">
      <label for="token-name">Character</label>
      <select id="token-name" name="token-name">
        ${tokenNames.map(name => `<option value="${name}">${name}</option>`)}
      </select>
    </div>`;
}
else {
  tokenName = tokenNames[0];
}

new Dialog({
  title: '🌈 Spend Inspiration',
  content: `
  <style>
    .dialog-content {
      max-height: none !important;
    }
    .app.window-app.dialog {
      height: auto !important;
    }
  </style>
  <form>
    ${characterSelect}
    <div class="form-group" id="flashback-points">
      <label for="points">Points to spend</label>
      <select id="points" name="points">
        <option value="1" selected>1 - Easy opportunity</option>
        <option value="2">2 - Unlikely opportunity</option>
        <option value="3">3 - Special opportunity</option>
      </select>
    </div>
    <div class="form-group">
      <p id="description">Spend inspiration below, or select the level of flashback you want to have.<br><br></p>
    </div>
  </form>
`,
  buttons: {
    inspiration: {
      label: 'Spend Inspiration',
      callback: async (html) => {
        tokenName = html.find('[name="token-name"]').val();
        let points = 1;

        let token = tokens.find(t => t.name === tokenName);
        let currentPoints = token.actor.data.data.resources.primary.value;
        if (currentPoints < points) {
          ui.notifications.warn(`Not enough points. Current points: ${currentPoints}`);
          return;
        }

        token.actor.update({ "data.resources.primary.value": currentPoints - points });
        ui.notifications.info(`Points spent. Current points: ${currentPoints - points}`);
      }
    },
    flashback: {
      label: 'Have a Flashback',
      callback: async (html) => {
        let tokenName = html.find('[name="token-name"]').val();
        let points = parseInt(html.find('[name="points"]').val());

        let token = tokens.find(t => t.name === tokenName);
        let currentPoints = token.actor.data.data.resources.primary.value;
        if (currentPoints < points) {
          ui.notifications.warn(`Not enough points. Current points: ${currentPoints}`);
          return;
        }

        token.actor.update({ "data.resources.primary.value": currentPoints - points });
        ui.notifications.info(`Points spent. Current points: ${currentPoints - points}`);
      }
    },
    cancel: {
      label: 'Cancel'
    }
  },
  default: 'cancel',
  close: () => { },
  render: (html) => {
    html.find('.dialog-buttons').prepend('<button type="button" name="flashback">Have a Flashback</button>');
    html.find('button[name="flashback"]').click(() => {
      html.find('#flashback-points').show();
    });

    html.find('[name="points"]').change((event) => {
      let points = parseInt(event.target.value);
      let description;
      switch (points) {
        case 1:
          description = 'An ordinary action for which you had easy opportunity. The rogue persuaded her friend Chael to agree to arrive at the dice game ahead of time, to suddenly spring out as a surprise ally.';
          break;
        case 2:
          description = 'A complex action or unlikely opportunity. The ranger hid his pistols into a hiding spot near the card table so he could retrieve them after the pat-down at the front door.';
          break;
        case 3:
          description = 'An elaborate action that involved special opportunities or contingencies. The wizard has already studied the history of the property and learned of a ghost that is known to haunt the sewers leading into the basement—a ghost that can be compelled to reveal the location of the hidden vault.';
          break;
      }
      html.find('#description').text(description);
    });

  }
}).render(true);