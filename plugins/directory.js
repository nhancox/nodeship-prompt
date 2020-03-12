const color = require("../lib/color.js");

module.exports = function(config) {
  let directoryPrompt = "";

  if (config.directory.preposition) {
    let prepositionPrompt = `${config.directory.preposition.value} `;

    if (config.directory.preposition.color) {
      prepositionPrompt = color(config.directory.preposition.color)(
        prepositionPrompt
      );
    }

    directoryPrompt += prepositionPrompt;
  }

  let transformedPath = config.environment.currentWorkingDirectory.path;

  if (
    config.directory.homeSymbol &&
    transformedPath.startsWith(config.environment.home)
  ) {
    transformedPath = `${config.directory.homeSymbol}${transformedPath.slice(
      config.environment.home.length
    )}`;
  }

  if (config.directory.color) {
    transformedPath = color(config.directory.color)(transformedPath);
  }

  directoryPrompt += transformedPath;

  return directoryPrompt;
};
