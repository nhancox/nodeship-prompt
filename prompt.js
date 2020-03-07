const plugins = require("./plugins/index.js");

// TODO Test the final steps (mock plugins)
module.exports = async function(config) {
  let pluginOperations = [...config.prompt];
  pluginOperations = pluginOperations.map(async (plugin) => {
    const pluginResult = await plugins[plugin](config);
    return pluginResult;
  });
  const pluginResults = await Promise.all(pluginOperations);

  let nodeshipPrompt = pluginResults.join(" ");

  if (config.newline) {
    nodeshipPrompt += "\n";
  }

  if (config.symbol) {
    nodeshipPrompt += `${config.symbol} `;
  }

  return nodeshipPrompt;
};
