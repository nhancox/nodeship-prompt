const fs = require("fs").promises;
const path = require("path");

const PROJECT_PATH = path.resolve(__dirname, "..");
const TOOL_VERSION_FILE = path.resolve(PROJECT_PATH, ".tool-versions");

module.exports = async function(language) {
  let toolVersions = await fs.readFile(TOOL_VERSION_FILE, "utf8");
  toolVersions = toolVersions.split("\n");
  toolVersions.pop();

  const languageVersion = toolVersions.find((entry) => {
    return entry.split(" ")[0] === language;
  });

  if (!languageVersion) {
    throw new Error(`Language ${language} not found in .tool-versions`);
  }

  return languageVersion.split(" ")[1];
};
