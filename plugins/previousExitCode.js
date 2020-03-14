const color = require("../lib/color.js");

module.exports = function(config) {
  let exitCodePrompt = "";

  if (config.environment.previousExitCode !== 0) {
    exitCodePrompt += config.environment.previousExitCode;
  }

  if (config.previousExitCode.color) {
    exitCodePrompt = color(config.previousExitCode.color)(exitCodePrompt);
  }

  return exitCodePrompt;
};
