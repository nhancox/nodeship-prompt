const fs = require("fs").promises;
const os = require("os");
const path = require("path");

const defaultConfig = require("./defaultConfig.js");

/* eslint-disable no-process-env */
// Only access `process.env` here to lower overhead
const SYSTEM_ENVIRONMENT_VARIABLES = process.env;
const { USER, XDG_CONFIG_HOME } = SYSTEM_ENVIRONMENT_VARIABLES;
const HOME = os.homedir();
const HOSTNAME = os.hostname();

const CURRENT_WORKING_DIRECTORY = process.cwd();
const NODE_WORKING_DIRECTORY = __dirname;

const USER_CONFIG_LOCATION = XDG_CONFIG_HOME || path.join(HOME, ".config");
const NODESHIP_CONFIG = path.join(USER_CONFIG_LOCATION, "nodeship-prompt.json");

async function getDefaultConfig(previousExitCode) {
  // TODO Should be able to optimize by skipping this. No state preserved
  // between runs so the side effects don't matter.
  const defaults = JSON.parse(JSON.stringify(defaultConfig));

  // TODO (PERF) should this be grouped with other `fs` operation?
  const directoryContents = await fs.readdir(CURRENT_WORKING_DIRECTORY, {
    withFileTypes: true
  });
  const directories = [];
  const files = [];
  directoryContents.forEach((element) => {
    if (element.isDirectory()) {
      directories.push(element.name);
    } else {
      files.push(element.name);
    }
  });

  defaults.environment = {
    currentWorkingDirectory: {
      directories,
      files,
      path: CURRENT_WORKING_DIRECTORY
    },
    home: HOME,
    host: HOSTNAME,
    nodeshipDirectory: NODE_WORKING_DIRECTORY,
    previousExitCode: previousExitCode || 0,
    user: USER,
    variables: SYSTEM_ENVIRONMENT_VARIABLES
  };

  return defaults;
}

async function resolveConfig(previousExitCode) {
  const resolvedConfig = await getDefaultConfig(previousExitCode);

  let userConfig = await fs.readFile(NODESHIP_CONFIG, "utf8").catch(() => {
    // Allow errors because the file's existence is optional
  });

  if (userConfig) {
    userConfig = JSON.parse(userConfig);

    for (const property in userConfig) {
      if (property !== "environment") {
        resolvedConfig[property] = userConfig[property];
      }
    }
  }

  return resolvedConfig;
}

module.exports = resolveConfig;
