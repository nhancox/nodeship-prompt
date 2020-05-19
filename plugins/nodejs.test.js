// These tests require you to have the proper Node.js version installed.
// For other languages this would mean that the tests are skipped by default,
// but this is a Node.js project, so it can be expected. Just in case, the tests
// are encased in a `describe` block to easily disable.
// If you use `asdf-vm`, the `.tool-versions` file that is read ensures that the
// right version will be used in the project directory.

const path = require("path");

const nodejs = require("./nodejs.js");
const toolVersion = require("../lib/toolVersion.js");

let NODESHIP_NODE_VERSION;
const PROJECT_PATH = path.resolve(__dirname, "..");

describe("nodejs tests (when Node.js is installed)", () => {
  beforeAll(async () => {
    NODESHIP_NODE_VERSION = await toolVersion("nodejs");
  });

  // Note that this is the same as the next test. Wanted to make the different
  // cases explicit. Might want to look at a way to separate them later.
  test("prints the correct Node.js version", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: ["node_modules"],
          files: [],
          path: PROJECT_PATH
        }
      },
      nodejs: {}
    };

    const nodejsPrompt = await nodejs(config);

    expect(nodejsPrompt).toBe(NODESHIP_NODE_VERSION);
  });

  test("triggers on `node_modules` directory", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: ["dist", "node_modules"],
          files: [],
          path: PROJECT_PATH
        }
      },
      nodejs: {}
    };

    const nodejsPrompt = await nodejs(config);

    expect(nodejsPrompt).toBe(NODESHIP_NODE_VERSION);
  });

  test("triggers on `package.json` file", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["config.json", "package.json"],
          path: PROJECT_PATH
        }
      },
      nodejs: {}
    };

    const nodejsPrompt = await nodejs(config);

    expect(nodejsPrompt).toBe(NODESHIP_NODE_VERSION);
  });

  test("triggers on any `.js` file", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["README.md", "app.js"],
          path: PROJECT_PATH
        }
      },
      nodejs: {}
    };

    const nodejsPrompt = await nodejs(config);

    expect(nodejsPrompt).toBe(NODESHIP_NODE_VERSION);
  });

  test("doesn't trigger on dot files", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["README.md", ".config.js", ".eslintrc.js"],
          path: PROJECT_PATH
        }
      },
      nodejs: {}
    };

    const nodejsPrompt = await nodejs(config);

    expect(nodejsPrompt).toBe("");
  });

  test("includes a preposition when specified", async () => {
    const preposition = "using";
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: ["node_modules"],
          files: [],
          path: PROJECT_PATH
        }
      },
      nodejs: {
        preposition: { value: preposition }
      }
    };

    const nodejsPrompt = await nodejs(config);

    expect(nodejsPrompt).toBe(`${preposition} ${NODESHIP_NODE_VERSION}`);
  });

  test("includes a symbol when specified", async () => {
    const symbol = "Node";
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: ["node_modules"],
          files: [],
          path: PROJECT_PATH
        }
      },
      nodejs: { symbol }
    };

    const nodejsPrompt = await nodejs(config);

    expect(nodejsPrompt).toBe(`${symbol} ${NODESHIP_NODE_VERSION}`);
  });

  test("doesn't trigger with no directory or file matches", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: ["build", "dist", "lib"],
          files: ["README.md", "__init__.py", "LICENSE"],
          path: PROJECT_PATH
        }
      },
      nodejs: {}
    };

    const nodejsPrompt = await nodejs(config);

    expect(nodejsPrompt).toBe("");
  });
});
