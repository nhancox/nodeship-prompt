const { exec } = require("child_process");

const color = require("../lib/color.js");

const RUST_DIRECTORIES = [];
const RUST_EXTENSIONS = [".rs"];
const RUST_FILES = ["Cargo.toml"];

function checkDirectories(directories) {
  let match = false;
  directories.forEach((directory) => {
    if (RUST_DIRECTORIES.includes(directory)) {
      match = true;
    }
  });
  return match;
}

function checkExtensions(files) {
  let match = false;
  files.forEach((file) => {
    RUST_EXTENSIONS.forEach((extension) => {
      if (!file.startsWith(".") && file.endsWith(extension)) {
        match = true;
      }
    });
  });
  return match;
}

function checkFiles(files) {
  let match = false;
  files.forEach((file) => {
    if (RUST_FILES.includes(file)) {
      match = true;
    }
  });
  return match;
}

function getRustVersion(currentWorkingDirectory) {
  return new Promise((resolve) => {
    exec(
      "/usr/bin/env rustc --version",
      { cwd: currentWorkingDirectory },
      (err, stdout, stderr) => {
        if (err || stderr) {
          return resolve(false);
        }

        // Output is in the form:
        // rustc 1.41.0 (5e1a79984 2020-01-27)
        let result = stdout.replace("\n", "");
        result = result.split(" ");

        resolve(result[1]);
      }
    );
  });
}

module.exports = async function(config) {
  let rustPrompt = "";

  if (
    !checkDirectories(config.environment.currentWorkingDirectory.directories) &&
    !checkExtensions(config.environment.currentWorkingDirectory.files) &&
    !checkFiles(config.environment.currentWorkingDirectory.files)
  ) {
    return rustPrompt;
  }

  const rustVersion = await getRustVersion(
    config.environment.currentWorkingDirectory.path
  );

  if (!rustVersion) {
    return rustPrompt;
  }

  if (config.rust.preposition) {
    let prepositionPrompt = `${config.rust.preposition.value} `;

    if (config.rust.preposition.color) {
      prepositionPrompt = color(config.rust.preposition.color)(
        prepositionPrompt
      );
    }

    rustPrompt += prepositionPrompt;
  }

  let versionPrompt = rustVersion;

  if (config.rust.symbol) {
    versionPrompt = `${config.rust.symbol} ${versionPrompt}`;
  }

  if (config.rust.color) {
    versionPrompt = color(config.rust.color)(versionPrompt);
  }

  rustPrompt += versionPrompt;

  return rustPrompt;
};
