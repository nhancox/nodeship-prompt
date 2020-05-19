const chalk = require("chalk");

// Always use truecolor
// If you don't hard code this then `chalk` will see no color support when going
// through the shell adapter and no colors will show up
// Switching between the levels could be a feature in the future, but this is
// really meant to be modern
const chalkContext = new chalk.Instance({ level: 3 });

module.exports = function(shellEscape) {
  return function(colorConfig, text) {
    let chalkChain = chalkContext;

    if (colorConfig.modifier) {
      chalkChain = chalkChain[colorConfig.modifier];
    }

    if (Array.isArray(colorConfig.value)) {
      chalkChain = chalkChain[colorConfig.type](...colorConfig.value);
    } else {
      chalkChain = chalkChain[colorConfig.type](colorConfig.value);
    }

    return `${shellEscape(chalkChain._styler.open)}${text}${shellEscape(
      chalkChain._styler.close
    )}`;
  };
};
