const color = require("../lib/color.js");

module.exports = function(config) {
  let hostPrompt = "";

  if (config.host.preposition) {
    let prepositionPrompt = `${config.host.preposition} `;

    if (config.host.prepositionColor) {
      prepositionPrompt = color(config.host.prepositionColor)(
        prepositionPrompt
      );
    }

    hostPrompt += prepositionPrompt;
  }

  let hostName = config.env.HOSTNAME;

  if (config.host.color) {
    hostName = color(config.host.color)(hostName);
  }

  hostPrompt += hostName;

  return hostPrompt;
};
