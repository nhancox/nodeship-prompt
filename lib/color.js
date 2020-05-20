const chalk = require("chalk");

// Always use truecolor
// This is not automatically detected by `chalk` because of how the application
// is packaged and run, so it must be hard-coded.
// Switching between the levels could be a feature in the future, but this is
// really meant to be modern
const CHALK_OPTIONS = { level: 3 };

module.exports = function(shellEscape) {
  return function(colorConfig, text) {
    let styledText = "";

    let colorChain = new chalk.Instance(CHALK_OPTIONS);
    if (Array.isArray(colorConfig.value)) {
      colorChain = colorChain[colorConfig.type](...colorConfig.value);
    } else {
      colorChain = colorChain[colorConfig.type](colorConfig.value);
    }

    styledText = `${shellEscape(colorChain._styler.open)}${text}${shellEscape(
      colorChain._styler.close
    )}`;

    if (colorConfig.modifier) {
      let modifierChain = new chalk.Instance(CHALK_OPTIONS);
      modifierChain = modifierChain[colorConfig.modifier];

      styledText = `${shellEscape(
        modifierChain._styler.open
      )}${styledText}${shellEscape(modifierChain._styler.close)}`;
    }

    return styledText;
  };
};
