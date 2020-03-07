module.exports = function(config) {
  let directoryPrompt = "";

  if (config.directory.preposition) {
    directoryPrompt += `${config.directory.preposition} `;
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

  directoryPrompt += transformedPath;

  return directoryPrompt;
};
