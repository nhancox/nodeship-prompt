const color = require("../lib/color.js");

module.exports = function(config) {
  let userPrompt = "";

  let user = config.env.USER;

  if (config.user.color) {
    user = color(config.user.color)(user);
  }

  userPrompt += user;

  return userPrompt;
};
