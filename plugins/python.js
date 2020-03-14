const { exec } = require("child_process");

const color = require("../lib/color.js");

const PYTHON_DIRECTORIES = [];
const PYTHON_EXTENSIONS = [".py"];
const PYTHON_FILES = [
  ".python-version",
  "Pipfile",
  "pyproject.toml",
  "requirements.txt",
  "tox.ini"
];

function checkDirectories(directories) {
  let match = false;
  directories.forEach((directory) => {
    if (PYTHON_DIRECTORIES.includes(directory)) {
      match = true;
    }
  });
  return match;
}

function checkExtensions(files) {
  let match = false;
  files.forEach((file) => {
    PYTHON_EXTENSIONS.forEach((extension) => {
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
    if (PYTHON_FILES.includes(file)) {
      match = true;
    }
  });
  return match;
}

function getPythonVersion(currentWorkingDirectory) {
  return new Promise((resolve) => {
    exec(
      "/usr/bin/env python --version",
      { cwd: currentWorkingDirectory },
      (err, stdout, stderr) => {
        if (err || stderr) {
          return resolve(false);
        }

        // Output is in the form: Python 3.8.1
        let result = stdout.replace("\n", "");
        result = result.split(" ");

        resolve(result[1]);
      }
    );
  });
}

module.exports = async function(config) {
  let pythonPrompt = "";

  if (
    !checkDirectories(config.environment.currentWorkingDirectory.directories) &&
    !checkExtensions(config.environment.currentWorkingDirectory.files) &&
    !checkFiles(config.environment.currentWorkingDirectory.files)
  ) {
    return pythonPrompt;
  }

  const pythonVersion = await getPythonVersion(
    config.environment.currentWorkingDirectory.path
  );

  if (!pythonVersion) {
    return pythonPrompt;
  }

  if (config.python.preposition) {
    let prepositionPrompt = `${config.python.preposition.value} `;

    if (config.python.preposition.color) {
      prepositionPrompt = color(config.python.preposition.color)(
        prepositionPrompt
      );
    }

    pythonPrompt += prepositionPrompt;
  }

  let versionPrompt = pythonVersion;

  if (config.python.symbol) {
    versionPrompt = `${config.python.symbol} ${versionPrompt}`;
  }

  if (config.python.color) {
    versionPrompt = color(config.python.color)(versionPrompt);
  }

  pythonPrompt += versionPrompt;

  return pythonPrompt;
};
