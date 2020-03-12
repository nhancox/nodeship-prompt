const color = require("./lib/color.js");
const plugins = require("./plugins/index.js");

// TODO Test the final steps (mock plugins)
module.exports = async function(config) {
  let nodeshipPrompt = "";

  if (config.newline) {
    nodeshipPrompt += "\n";
  }

  let pluginOperations = [...config.prompt];
  pluginOperations = pluginOperations.map(async (plugin) => {
    const pluginResult = await plugins[plugin](config);
    return pluginResult;
  });
  const pluginResults = await Promise.all(pluginOperations);

  let resultPrompt = "";
  pluginResults.forEach((result) => {
    if (result.length) {
      resultPrompt += `${resultPrompt.length ? " " : ""}${result}`;
    }
  });
  nodeshipPrompt += resultPrompt;

  if (config.symbol) {
    let symbolPrompt = "";

    if (config.symbol.newline) {
      symbolPrompt += "\n";
    }

    symbolPrompt += `${config.symbol.value} `;

    if (config.symbol.color) {
      symbolPrompt = color(config.symbol.color)(symbolPrompt);
    }

    nodeshipPrompt += symbolPrompt;
  }

  return nodeshipPrompt;
};
