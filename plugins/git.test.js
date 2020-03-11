const fs = require("fs").promises;
const path = require("path");

const del = require("del");
const Git = require("nodegit");

const gitPlugin = require("./git.js");

const TEMP_GIT_FOLDER = path.join(__dirname, "tmpgit");
const INITIAL_FILE = "hello_world.txt";

// 1 commit with a single file
// Nothing pending/modified
// On a non-master branch
const CLEAN_REPO = "clean-repo";
const CLEAN_REPO_PATH = path.join(TEMP_GIT_FOLDER, CLEAN_REPO);
const CLEAN_BRANCH_NAME = "staging";

// 1 commit with a single file
// The committed file is modified but unstaged
// A new file, unstaged
// A new file, staged
const DIRTY_REPO = "dirty-repo";
const DIRTY_REPO_PATH = path.join(TEMP_GIT_FOLDER, DIRTY_REPO);

async function createRepoWithCommit(repoName) {
  const isBare = 0;
  const repoPath = path.join(TEMP_GIT_FOLDER, repoName);
  const repository = await Git.Repository.init(repoPath, isBare);

  const fileName = INITIAL_FILE;
  const filePath = path.join(repoPath, fileName);
  const fileContent = "Hello, World!\n";
  await fs.writeFile(filePath, fileContent);

  const index = await repository.refreshIndex();
  await index.addByPath(fileName);
  await index.write();
  const oid = await index.writeTree();

  const author = Git.Signature.now("Pilot", "pilot@example.com");
  const committer = Git.Signature.now("Pilot", "pilot@example.com");
  const message = "Initial commit";
  await repository.createCommit("HEAD", author, committer, message, oid, []);
}

async function checkoutNewBranch(repoPath, branchName) {
  const repository = await Git.Repository.open(repoPath);
  const headCommit = await repository.getHeadCommit();
  const force = false;
  const branchReference = await repository.createBranch(
    branchName,
    headCommit,
    force
  );
  await repository.checkoutBranch(branchReference);
}

async function dirtyRepo(repoName) {
  const repoPath = path.join(TEMP_GIT_FOLDER, repoName);
  const repository = await Git.Repository.open(repoPath);

  // TODO (PERF) run these file operations in parallel

  const modifiedFileName = INITIAL_FILE;
  const modifiedFilePath = path.join(repoPath, modifiedFileName);
  const appendText = "MODIFIED\n";
  await fs.appendFile(modifiedFilePath, appendText);

  const stagedFileName = "staged.txt";
  const stagedFilePath = path.join(repoPath, stagedFileName);
  await fs.writeFile(stagedFilePath, stagedFileName);
  const index = await repository.refreshIndex();
  await index.addByPath(stagedFileName);
  await index.write();

  const unstagedFileName = "unstaged.txt";
  const unstagedFilePath = path.join(repoPath, unstagedFileName);
  await fs.writeFile(unstagedFilePath, unstagedFileName);
}

beforeAll(async () => {
  await fs.mkdir(TEMP_GIT_FOLDER);
  await Promise.all([
    createRepoWithCommit(CLEAN_REPO),
    createRepoWithCommit(DIRTY_REPO)
  ]);
  await Promise.all([
    checkoutNewBranch(CLEAN_REPO_PATH, CLEAN_BRANCH_NAME),
    dirtyRepo(DIRTY_REPO)
  ]);
});

afterAll(async () => {
  await del(TEMP_GIT_FOLDER);
});

test("prints the correct branch name", async () => {
  const config = {
    git: {},
    workingDirectories: {
      current: CLEAN_REPO_PATH
    }
  };

  const gitPrompt = await gitPlugin(config);

  expect(gitPrompt).toBe(CLEAN_BRANCH_NAME);
});

test("doesn't show flags on a clean tree", async () => {
  const config = {
    git: { flag: true },
    workingDirectories: {
      current: CLEAN_REPO_PATH
    }
  };

  const gitPrompt = await gitPlugin(config);

  expect(gitPrompt).toBe(CLEAN_BRANCH_NAME);
});

test("includes a preposition when specified", async () => {
  const preposition = "on";
  const config = {
    git: { preposition },
    workingDirectories: {
      current: CLEAN_REPO_PATH
    }
  };

  const gitPrompt = await gitPlugin(config);

  expect(gitPrompt).toBe(`${preposition} ${CLEAN_BRANCH_NAME}`);
});

test("prints the correct status flags", async () => {
  const statusFlags = "[+!?]";
  const config = {
    git: { flag: true },
    workingDirectories: { current: DIRTY_REPO_PATH }
  };

  const gitPrompt = await gitPlugin(config);

  expect(gitPrompt).toBe(`master ${statusFlags}`);
});

test("doesn't fail when using colors", async () => {
  const branchColor = {
    type: "keyword",
    value: "purple"
  };
  const preposition = "on";
  const prepositionColor = {
    type: "keyword",
    value: "red"
  };
  const flagColor = {
    type: "keyword",
    value: "blue"
  };
  const config = {
    git: {
      branchColor,
      flag: true,
      flagColor,
      preposition,
      prepositionColor
    },
    workingDirectories: {
      current: DIRTY_REPO_PATH
    }
  };

  await gitPlugin(config);
});
