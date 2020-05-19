const color = require("../lib/color.js");

module.exports = function(config) {
  const colorize = color(config.environment.shellEscape);

  let hostPrompt = "";

  if (config.host.preposition) {
    let prepositionPrompt = `${config.host.preposition.value} `;

    if (config.host.preposition.color) {
      prepositionPrompt = colorize(
        config.host.preposition.color,
        prepositionPrompt
      );
    }

    hostPrompt += prepositionPrompt;
  }

  let hostName = config.environment.host;

  if (config.host.color) {
    hostName = colorize(config.host.color, hostName);
  }

  hostPrompt += hostName;

  return hostPrompt;
};
