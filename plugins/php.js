const { exec } = require("child_process");

const color = require("../lib/color.js");

const PHP_DIRECTORIES = [];
const PHP_EXTENSIONS = [".php"];
const PHP_FILES = ["composer.json"];

function checkDirectories(directories) {
  let match = false;
  directories.forEach((directory) => {
    if (PHP_DIRECTORIES.includes(directory)) {
      match = true;
    }
  });
  return match;
}

function checkExtensions(files) {
  let match = false;
  files.forEach((file) => {
    PHP_EXTENSIONS.forEach((extension) => {
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
    if (PHP_FILES.includes(file)) {
      match = true;
    }
  });
  return match;
}

function getPHPVersion(currentWorkingDirectory) {
  return new Promise((resolve) => {
    exec(
      "/usr/bin/env php --version",
      { cwd: currentWorkingDirectory },
      (err, stdout, stderr) => {
        if (err || stderr) {
          return resolve(false);
        }

        // First line of the output looks like:
        // PHP 7.4.3 (cli) (built: Feb 18 2020 15:35:13) ( NTS )

        let result = stdout.split("\n");
        result = result[0].split(" ");

        resolve(result[1]);
      }
    );
  });
}

module.exports = async function(config) {
  let phpPrompt = "";

  if (
    !checkDirectories(config.environment.currentWorkingDirectory.directories) &&
    !checkExtensions(config.environment.currentWorkingDirectory.files) &&
    !checkFiles(config.environment.currentWorkingDirectory.files)
  ) {
    return phpPrompt;
  }

  const phpVersion = await getPHPVersion(
    config.environment.currentWorkingDirectory.path
  );

  if (!phpVersion) {
    return phpPrompt;
  }

  if (config.php.preposition) {
    let prepositionPrompt = `${config.php.preposition.value} `;

    if (config.php.preposition.color) {
      prepositionPrompt = color(config.php.preposition.color)(
        prepositionPrompt
      );
    }

    phpPrompt += prepositionPrompt;
  }

  let versionPrompt = phpVersion;

  if (config.php.symbol) {
    versionPrompt = `${config.php.symbol} ${versionPrompt}`;
  }

  if (config.php.color) {
    versionPrompt = color(config.php.color)(versionPrompt);
  }

  phpPrompt += versionPrompt;

  return phpPrompt;
};
