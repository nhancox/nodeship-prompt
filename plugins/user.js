const color = require("../lib/color.js");

module.exports = function(config) {
  const colorize = color(config.environment.shellEscape);

  let userPrompt = "";

  let user = config.environment.user;

  if (config.user.color) {
    user = colorize(config.user.color, user);
  }

  userPrompt += user;

  return userPrompt;
};
