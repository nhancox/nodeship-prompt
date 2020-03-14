const { exec } = require("child_process");

const color = require("../lib/color.js");

const RUBY_DIRECTORIES = [];
const RUBY_EXTENSIONS = [".rb"];
const RUBY_FILES = ["Gemfile"];

function checkDirectories(directories) {
  let match = false;
  directories.forEach((directory) => {
    if (!match && RUBY_DIRECTORIES.includes(directory)) {
      match = true;
    }
  });
  return match;
}

function checkExtensions(files) {
  let match = false;
  files.forEach((file) => {
    RUBY_EXTENSIONS.forEach((extension) => {
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
    if (!match && RUBY_FILES.includes(file)) {
      match = true;
    }
  });
  return match;
}

function getRubyVersion(currentWorkingDirectory) {
  return new Promise((resolve) => {
    exec(
      "/usr/bin/env ruby --version",
      { cwd: currentWorkingDirectory },
      (err, stdout, stderr) => {
        if (err || stderr) {
          return resolve(false);
        }

        // Output is in the form:
        // ruby 2.7.0p0 (2019-12-25 revision 647ee6f091) [x86_64-linux]
        let result = stdout.replace("\n", "");
        result = result.split(" ");

        resolve(result[1]);
      }
    );
  });
}

module.exports = async function(config) {
  let rubyPrompt = "";

  if (
    !checkDirectories(config.environment.currentWorkingDirectory.directories) &&
    !checkExtensions(config.environment.currentWorkingDirectory.files) &&
    !checkFiles(config.environment.currentWorkingDirectory.files)
  ) {
    return rubyPrompt;
  }

  const rubyVersion = await getRubyVersion(
    config.environment.currentWorkingDirectory.path
  );

  if (!rubyVersion) {
    return rubyPrompt;
  }

  if (config.ruby.preposition) {
    let prepositionPrompt = `${config.ruby.preposition.value} `;

    if (config.ruby.preposition.color) {
      prepositionPrompt = color(config.ruby.preposition.color)(
        prepositionPrompt
      );
    }

    rubyPrompt += prepositionPrompt;
  }

  let versionPrompt = rubyVersion;

  if (config.ruby.symbol) {
    versionPrompt = `${config.ruby.symbol} ${versionPrompt}`;
  }

  if (config.ruby.color) {
    versionPrompt = color(config.ruby.color)(versionPrompt);
  }

  rubyPrompt += versionPrompt;

  return rubyPrompt;
};
