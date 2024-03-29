const fs = require("fs");
const path = require("path");

const del = require("del");
const git = require("isomorphic-git");

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
  const repoPath = path.join(TEMP_GIT_FOLDER, repoName);
  await git.init({ dir: repoPath, fs });

  const fileName = INITIAL_FILE;
  const filePath = path.join(repoPath, fileName);
  const fileContent = "Hello, World!\n";
  await fs.promises.writeFile(filePath, fileContent);

  await git.add({ dir: repoPath, filepath: fileName, fs });

  const author = {
    email: "pilot@example.com",
    name: "Pilot",
  };
  const message = "Initial commit";
  await git.commit({ author, dir: repoPath, fs, message });
}

async function checkoutNewBranch(repoPath, branchName) {
  await git.branch({ checkout: true, dir: repoPath, fs, ref: branchName });
}

async function commitAndDetach(repoPath) {
  const startingRef = await git.resolveRef({ dir: repoPath, fs, ref: "HEAD" });

  const newFileName = "additional_file.txt";
  const newFilePath = path.join(repoPath, newFileName);
  await fs.promises.writeFile(newFilePath, newFileName);

  await git.add({ dir: repoPath, filepath: newFileName, fs });

  const author = {
    email: "pilot@example.com",
    name: "Pilot",
  };
  const message = "Second commit";
  await git.commit({ author, dir: repoPath, fs, message });

  await git.checkout({ dir: repoPath, fs, ref: startingRef });
  return startingRef;
}

async function dirtyRepo(repoPath) {
  const modifiedFileName = INITIAL_FILE;
  const modifiedFilePath = path.join(repoPath, modifiedFileName);
  const appendText = "MODIFIED\n";

  const stagedFileName = "staged.txt";
  const stagedFilePath = path.join(repoPath, stagedFileName);

  const unstagedFileName = "unstaged.txt";
  const unstagedFilePath = path.join(repoPath, unstagedFileName);

  await Promise.all([
    fs.promises.appendFile(modifiedFilePath, appendText),
    fs.promises.writeFile(stagedFilePath, stagedFileName),
    fs.promises.writeFile(unstagedFilePath, unstagedFileName),
  ]);

  await git.add({ dir: repoPath, filepath: stagedFileName, fs });
}

async function setupCleanRepo() {
  await createRepoWithCommit(CLEAN_REPO);
  await checkoutNewBranch(CLEAN_REPO_PATH, CLEAN_BRANCH_NAME);
}

async function setupDirtyRepo() {
  await createRepoWithCommit(DIRTY_REPO);
  await dirtyRepo(DIRTY_REPO_PATH);
}

beforeEach(async () => {
  await fs.promises.mkdir(TEMP_GIT_FOLDER);
  await Promise.all([setupCleanRepo(), setupDirtyRepo()]);
});

afterEach(async () => {
  await del(TEMP_GIT_FOLDER);
});

test("prints the correct branch name", async () => {
  const config = {
    environment: { currentWorkingDirectory: { path: CLEAN_REPO_PATH } },
    git: { branch: {} },
  };

  const gitPrompt = await gitPlugin(config);

  expect(gitPrompt).toBe(CLEAN_BRANCH_NAME);
});

test("prints the ref's short hash when in a detached HEAD state", async () => {
  const config = {
    environment: { currentWorkingDirectory: { path: CLEAN_REPO_PATH } },
    git: { branch: {} },
  };
  const detachedReference = await commitAndDetach(CLEAN_REPO_PATH);
  const shortHash = detachedReference.substring(0, 7);

  const gitPrompt = await gitPlugin(config);

  expect(gitPrompt).toBe(shortHash);
});

test("doesn't show status flags on a clean tree", async () => {
  const config = {
    environment: { currentWorkingDirectory: { path: CLEAN_REPO_PATH } },
    git: { branch: {}, status: {} },
  };

  const gitPrompt = await gitPlugin(config);

  expect(gitPrompt).toBe(CLEAN_BRANCH_NAME);
});

test("includes a preposition when specified", async () => {
  const preposition = "on";
  const config = {
    environment: { currentWorkingDirectory: { path: CLEAN_REPO_PATH } },
    git: { branch: { preposition: { value: preposition } } },
  };

  const gitPrompt = await gitPlugin(config);

  expect(gitPrompt).toBe(`${preposition} ${CLEAN_BRANCH_NAME}`);
});

// TODO Can make more comprehensive tests for this
test("prints the correct status flags", async () => {
  const statusFlags = "[+!?]";
  const config = {
    environment: { currentWorkingDirectory: { path: DIRTY_REPO_PATH } },
    git: { branch: {}, status: {} },
  };

  const gitPrompt = await gitPlugin(config);

  expect(gitPrompt).toBe(`master ${statusFlags}`);
});
