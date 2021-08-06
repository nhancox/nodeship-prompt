const { exec } = require("child_process");
const fs = require("fs");

const git = require("isomorphic-git");

const color = require("../lib/color.js");

async function getCurrentBranchName(repository) {
  const branch = await git.currentBranch({ dir: repository, fs });

  if (branch) {
    return branch;
  }

  // In a detached HEAD state. Return the short hash of the current ref instead.
  const reference = await git.resolveRef({
    dir: repository,
    fs,
    ref: "HEAD",
  });
  return reference.substring(0, 7);
}

// On a clean repo with 129 files and `tokei`-measured ~39k LOC:
// `git status`                  2.3ms (measured with `hyperfine`)
// `isomorphic-git.statusMatrix` 263ms (measured with `console.time` in code)
// New method                    7-8ms (measured with `console.time` in code)
// Why? `statusMatrix` examines every file in the directory structure.
// Considering this is for a shell prompt, definitely a necessary optimization.
// A dependency on `git` isn't a big deal considering the use case.
function getStatus(repository) {
  return new Promise((resolve) => {
    exec(
      "/usr/bin/env git status --porcelain",
      { cwd: repository },
      (err, stdout, stderr) => {
        if (err || stderr) {
          return resolve([]);
        }

        const results = stdout.split("\n");
        results.pop();
        resolve(results);
      }
    );
  });
}

async function parseStatus(repository) {
  const currentStatus = await getStatus(repository);

  const statusMap = {
    stagedChanges: 0,
    unstagedAdditions: 0,
    unstagedChanges: 0,
  };

  // Currently in "short format": XY FILEPATH
  const STAGED_CHANGES = [
    /[ACMR][\sDM]/u, // Added, copied, modified or renamed in index
    /[D]./u, // Deleted from index
  ];
  const UNSTAGED_ADDITIONS = "??";
  const UNSTAGED_CHANGES = [
    /[\sARCM][DM]/u, // Deleted in work tree or work tree changed since index
    /[\sD][CR]/u, // Copied or renamed in work tree
  ];
  currentStatus.forEach((statusEntry) => {
    const state = statusEntry.slice(0, 2);
    let searching = true;

    if (state === UNSTAGED_ADDITIONS) {
      statusMap.unstagedAdditions++;
      searching = false;
    }

    if (searching) {
      UNSTAGED_CHANGES.forEach((regex) => {
        if (searching && regex.test(state)) {
          statusMap.unstagedChanges++;
          searching = false;
        }
      });
    }

    if (searching) {
      STAGED_CHANGES.forEach((regex) => {
        if (searching && regex.test(state)) {
          statusMap.stagedChanges++;
          searching = false;
        }
      });
    }
  });

  return statusMap;
}

module.exports = async function(config) {
  const colorize = color(config.environment.shellEscape);

  let gitPrompt = "";

  const repository = await git
    .findRoot({ filepath: config.environment.currentWorkingDirectory.path, fs })
    .catch(() => {
      // Allow errors because that just means there was no repo found
    });

  if (!repository) {
    return gitPrompt;
  }

  const gitOperations = [getCurrentBranchName(repository)];

  if (config.git.status) {
    gitOperations.push(parseStatus(repository));
  }

  const operationResults = await Promise.all(gitOperations);

  const currentBranch = operationResults[0];
  let currentStatus;

  if (config.git.status) {
    currentStatus = operationResults[1];
  }

  if (config.git.branch.preposition) {
    let prepositionPrompt = `${config.git.branch.preposition.value} `;

    if (config.git.branch.preposition.color) {
      prepositionPrompt = colorize(
        config.git.branch.preposition.color,
        prepositionPrompt
      );
    }

    gitPrompt += prepositionPrompt;
  }

  let branchPrompt = currentBranch;

  if (config.git.branch.color) {
    branchPrompt = colorize(config.git.branch.color, branchPrompt);
  }

  gitPrompt += branchPrompt;

  // TODO Detect stash entries (proposed flag: "$")
  // TODO Support custom flag symbols
  if (config.git.status) {
    let statusFlags = "";

    if (currentStatus.stagedChanges) {
      statusFlags += "+";
    }

    if (currentStatus.unstagedChanges) {
      statusFlags += "!";
    }

    if (currentStatus.unstagedAdditions) {
      statusFlags += "?";
    }

    if (statusFlags.length) {
      statusFlags = ` [${statusFlags}]`;

      if (config.git.status.color) {
        statusFlags = colorize(config.git.status.color, statusFlags);
      }
    }

    gitPrompt += statusFlags;
  }

  return gitPrompt;
};
