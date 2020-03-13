const fs = require("fs");

const git = require("isomorphic-git");

const color = require("../lib/color.js");

async function getCurrentBranchName(repository) {
  const branch = await git.currentBranch({ dir: repository, fs });
  // TODO: Returns `undefined` if HEAD is detached; maybe get shorthand hash?
  return branch || "";
}

// TODO (PERF) This is a very slow solution because it goes through every single
// file. Any way to speed it up?
async function getStatus(repository) {
  const fileStatuses = await git.statusMatrix({
    dir: repository,
    fs
  });

  // HEAD:    0 absent, 1 present
  // WORKDIR: 0 absent, 1 =HEAD, 2 !=HEAD
  // STAGE:   0 absent, 1 =HEAD, 2 =WORKDIR, 3 !=WORKDIR

  // eslint-disable-next-line
  const FILE = 0;
  const HEAD = 1;
  const WORKDIR = 2;
  const STAGE = 3;

  const statusMap = {
    stagedChanges: 0,
    unstagedAdditions: 0,
    unstagedChanges: 0
  };

  for (const file of fileStatuses) {
    if (file[WORKDIR] !== file[STAGE]) {
      if (file[HEAD] === 0) {
        statusMap.unstagedAdditions++;
      } else {
        statusMap.unstagedChanges++;
      }
    } else if (file[HEAD] !== file[STAGE]) {
      statusMap.stagedChanges++;
    }
  }

  return statusMap;
}

module.exports = async function(config) {
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
    gitOperations.push(getStatus(repository));
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
      prepositionPrompt = color(config.git.branch.preposition.color)(
        prepositionPrompt
      );
    }

    gitPrompt += prepositionPrompt;
  }

  let branchPrompt = currentBranch;

  if (config.git.branch.color) {
    branchPrompt = color(config.git.branch.color)(branchPrompt);
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
        statusFlags = color(config.git.status.color)(statusFlags);
      }
    }

    gitPrompt += statusFlags;
  }

  return gitPrompt;
};
