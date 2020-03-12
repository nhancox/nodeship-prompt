const color = require("../lib/color.js");

module.exports = function(config) {
  let hostPrompt = "";

  if (config.host.preposition) {
    let prepositionPrompt = `${config.host.preposition.value} `;

    if (config.host.preposition.color) {
      prepositionPrompt = color(config.host.preposition.color)(
        prepositionPrompt
      );
    }

    hostPrompt += prepositionPrompt;
  }

  let hostName = config.environment.host;

  if (config.host.color) {
    hostName = color(config.host.color)(hostName);
  }

  hostPrompt += hostName;

  return hostPrompt;
};
