const { exec } = require("child_process");

const color = require("../lib/color.js");

const NODE_DIRECTORIES = ["node_modules"];
const NODE_EXTENSIONS = [".js"];
const NODE_FILES = ["package.json"];

function checkDirectories(directories) {
  let match = false;
  directories.forEach((directory) => {
    if (!match && NODE_DIRECTORIES.includes(directory)) {
      match = true;
    }
  });
  return match;
}

function checkExtensions(files) {
  let match = false;
  files.forEach((file) => {
    NODE_EXTENSIONS.forEach((extension) => {
      if (!match && !file.startsWith(".") && file.endsWith(extension)) {
        match = true;
      }
    });
  });
  return match;
}

function checkFiles(files) {
  let match = false;
  files.forEach((file) => {
    if (!match && NODE_FILES.includes(file)) {
      match = true;
    }
  });
  return match;
}

function getNodeVersion(currentWorkingDirectory) {
  return new Promise((resolve) => {
    exec(
      "/usr/bin/env node --version",
      { cwd: currentWorkingDirectory },
      (err, stdout, stderr) => {
        if (err || stderr) {
          return resolve(false);
        }

        // Output is only the version starting with "v"
        resolve(stdout.replace("\n", "").slice(1));
      }
    );
  });
}

module.exports = async function(config) {
  let nodejsPrompt = "";

  if (
    !checkDirectories(config.environment.currentWorkingDirectory.directories) &&
    !checkExtensions(config.environment.currentWorkingDirectory.files) &&
    !checkFiles(config.environment.currentWorkingDirectory.files)
  ) {
    return nodejsPrompt;
  }

  const nodeVersion = await getNodeVersion(
    config.environment.currentWorkingDirectory.path
  );

  if (!nodeVersion) {
    return nodejsPrompt;
  }

  if (config.nodejs.preposition) {
    let prepositionPrompt = `${config.nodejs.preposition.value} `;

    if (config.nodejs.preposition.color) {
      prepositionPrompt = color(config.nodejs.preposition.color)(
        prepositionPrompt
      );
    }

    nodejsPrompt += prepositionPrompt;
  }

  let versionPrompt = nodeVersion;

  if (config.nodejs.symbol) {
    versionPrompt = `${config.nodejs.symbol} ${versionPrompt}`;
  }

  if (config.nodejs.color) {
    versionPrompt = color(config.nodejs.color)(versionPrompt);
  }

  nodejsPrompt += versionPrompt;

  return nodejsPrompt;
};
