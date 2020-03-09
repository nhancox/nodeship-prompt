const color = require("../lib/color.js");

module.exports = function(config) {
  let directoryPrompt = "";

  if (config.directory.preposition) {
    let prepositionPrompt = `${config.directory.preposition} `;

    if (config.directory.prepositionColor) {
      prepositionPrompt = color(config.directory.prepositionColor)(
        prepositionPrompt
      );
    }

    directoryPrompt += prepositionPrompt;
  }

  let transformedPath = config.workingDirectories.current;

  if (
    config.directory.homeSymbol &&
    transformedPath.startsWith(config.env.HOME)
  ) {
    transformedPath = `${config.directory.homeSymbol}${transformedPath.slice(
      config.env.HOME.length
    )}`;
  }

  if (config.directory.color) {
    transformedPath = color(config.directory.color)(transformedPath);
  }

  directoryPrompt += transformedPath;

  return directoryPrompt;
};
