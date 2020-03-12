const color = require("../lib/color.js");

module.exports = function(config) {
  let userPrompt = "";

  let user = config.environment.user;

  if (config.user.color) {
    user = color(config.user.color)(user);
  }

  userPrompt += user;

  return userPrompt;
};
