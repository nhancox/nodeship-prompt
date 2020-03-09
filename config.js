const fs = require("fs").promises;
const os = require("os");
const path = require("path");

const defaultConfig = require("./defaultConfig.js");

/* eslint-disable no-process-env */
// Only access `process.env` here to lower overhead
const { USER, XDG_CONFIG_HOME } = process.env;
const HOME = os.homedir();
const HOSTNAME = os.hostname();

const CURRENT_WORKING_DIRECTORY = process.cwd();
const NODE_WORKING_DIRECTORY = __dirname;

const USER_CONFIG_LOCATION = XDG_CONFIG_HOME || path.join(HOME, ".config");
const NODESHIP_CONFIG = path.join(USER_CONFIG_LOCATION, "nodeship-prompt.json");

function getDefaultConfig(previousExitCode) {
  // TODO Should be able to optimize by skipping this. No state preserved
  // between runs so the side effects don't matter.
  const defaults = JSON.parse(JSON.stringify(defaultConfig));

  defaults.env = { HOME, HOSTNAME, USER };
  defaults.previousExitCode = previousExitCode || 0;
  defaults.workingDirectories = {
    current: CURRENT_WORKING_DIRECTORY,
    nodeship: NODE_WORKING_DIRECTORY
  };

  return defaults;
}

async function resolveConfig(previousExitCode) {
  const resolvedConfig = getDefaultConfig(previousExitCode);

  let userConfig = false;
  userConfig = await fs.readFile(NODESHIP_CONFIG, "utf8").catch(() => {
    // Allow errors because the file's existence is optional
  });

  if (userConfig) {
    userConfig = JSON.parse(userConfig);

    for (const property in userConfig) {
      if (
        !["env", "previousExitCode", "workingDirectories"].includes(property)
      ) {
        resolvedConfig[property] = userConfig[property];
      }
    }
  }

  return resolvedConfig;
}

module.exports = resolveConfig;
