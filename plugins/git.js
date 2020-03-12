const Git = require("nodegit");

const color = require("../lib/color.js");

async function getRepository(repoPath) {
  const repository = await Git.Repository.open(repoPath).catch(() => {
    return false;
  });
  return repository;
}

// TODO: Test cases where HEAD isn't a symbolic ref to see if the `shorthand` is
// a short hash
async function getCurrentBranchName(repository) {
  // `getCurrentBranch` and `head` do the same thing
  const branch = await repository.getCurrentBranch();
  return branch.shorthand();
}

async function getStatus(repository) {
  const statuses = await repository.getStatus();
  // `INDEX` represents status of file in index relative to HEAD
  // `WT` represents status of file in working directory relative to index
  // https://libgit2.org/libgit2/#HEAD/type/git_status_t
  const statusMap = {
    INDEX_DELETED: 0,
    INDEX_MODIFIED: 0,
    INDEX_NEW: 0,
    INDEX_RENAMED: 0,
    INDEX_TYPECHANGE: 0,
    WT_DELETED: 0,
    WT_MODIFIED: 0,
    WT_NEW: 0,
    WT_RENAMED: 0,
    WT_TYPECHANGE: 0,
    WT_UNREADABLE: 0
  };
  statuses.forEach((statusEntry) => {
    const entryStatus = statusEntry.status();
    if (entryStatus in statusMap) {
      statusMap[entryStatus]++;
    }
  });
  return statusMap;
}

// TODO detect stash entries (proposed flag: "$")
// Just have to check `Stash.foreach`?
// TODO support custom flag symbols
function getFlagPrompt(currentStatus) {
  let flagPrompt = "";

  const INDEX_STATUSES = [
    "INDEX_DELETED",
    "INDEX_MODIFIED",
    "INDEX_NEW",
    "INDEX_RENAMED",
    "INDEX_TYPECHANGE"
  ];
  let indexChanges = 0;
  INDEX_STATUSES.forEach((indexStatus) => {
    indexChanges += currentStatus[indexStatus];
  });

  if (indexChanges > 0) {
    flagPrompt += "+";
  }

  const TRACKED_WT_STATUSES = ["WT_DELETED", "WT_MODIFIED", "WT_RENAMED"];
  let trackedChanges = 0;
  TRACKED_WT_STATUSES.forEach((trackedWTStatus) => {
    trackedChanges += currentStatus[trackedWTStatus];
  });

  if (trackedChanges > 0) {
    flagPrompt += "!";
  }

  if (currentStatus.WT_NEW > 0) {
    flagPrompt += "?";
  }

  if (flagPrompt.length) {
    flagPrompt = ` [${flagPrompt}]`;
  }

  return flagPrompt;
}

module.exports = async function(config) {
  let gitPrompt = "";

  const repository = await getRepository(
    config.environment.currentWorkingDirectory.path
  );

  if (!repository) {
    return gitPrompt;
  }

  const [currentBranch, currentStatus] = await Promise.all([
    getCurrentBranchName(repository),
    getStatus(repository)
  ]);

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

  if (config.git.status) {
    let flagPrompt = getFlagPrompt(currentStatus);

    if (flagPrompt.length) {
      if (config.git.status.color) {
        flagPrompt = color(config.git.status.color)(flagPrompt);
      }

      gitPrompt += flagPrompt;
    }
  }

  return gitPrompt;
};
