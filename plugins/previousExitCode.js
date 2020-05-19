const color = require("../lib/color.js");

module.exports = function(config) {
  const colorize = color(config.environment.shellEscape);

  let exitCodePrompt = "";

  if (config.environment.previousExitCode !== 0) {
    exitCodePrompt += config.environment.previousExitCode;
  }

  if (config.previousExitCode.color) {
    exitCodePrompt = colorize(config.previousExitCode.color, exitCodePrompt);
  }

  return exitCodePrompt;
};
