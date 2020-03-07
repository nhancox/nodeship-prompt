const fs = require("fs").promises;
const os = require("os");
const path = require("path");

/* eslint-disable no-process-env */
// Only access `process.env` here to lower overhead
const { USER, XDG_CONFIG_HOME } = process.env;
const HOME = os.homedir();
const HOSTNAME = os.hostname();

const CURRENT_WORKING_DIRECTORY = process.cwd();
const NODE_WORKING_DIRECTORY = __dirname;

const DEFAULT_CONFIG_LOCATION = path.join(
  NODE_WORKING_DIRECTORY,
  "defaultConfig.json"
);
const USER_CONFIG_LOCATION = XDG_CONFIG_HOME || path.join(HOME, ".config");
const NODESHIP_CONFIG = path.join(USER_CONFIG_LOCATION, "nodeship-prompt.json");

async function getDefaultConfig(previousExitCode) {
  let defaultConfig = await fs.readFile(DEFAULT_CONFIG_LOCATION, "utf8");
  defaultConfig = JSON.parse(defaultConfig);

  defaultConfig.env = { HOME, HOSTNAME, USER };
  defaultConfig.previousExitCode = previousExitCode || 0;
  defaultConfig.workingDirectories = {
    current: CURRENT_WORKING_DIRECTORY,
    nodeship: NODE_WORKING_DIRECTORY
  };

  return defaultConfig;
}

async function resolveConfig(previousExitCode) {
  const resolvedConfig = await getDefaultConfig(previousExitCode);

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
