// These tests require you to have the proper Node.js version installed, so by
// default they're placed into a `describe` block with `skip`
// If you use `asdf-vm`, the `.tool-versions` file that is read ensures that the
// right version will be used in the project directory

const fs = require("fs").promises;
const path = require("path");

const nodejs = require("./nodejs.js");

let NODESHIP_NODE_VERSION;
const PROJECT_PATH = path.resolve(__dirname, "..");

describe.skip("nodejs tests (when Node.js is installed)", () => {
  beforeAll(async () => {
    const toolVersionFile = path.resolve(PROJECT_PATH, ".tool-versions");
    let toolVersions = await fs.readFile(toolVersionFile, "utf8");
    toolVersions = toolVersions.replace("\n", "");
    NODESHIP_NODE_VERSION = toolVersions.split(" ")[1];
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

    expect(nodejsPrompt).toMatch(NODESHIP_NODE_VERSION);
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

    expect(nodejsPrompt).toMatch(NODESHIP_NODE_VERSION);
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

    expect(nodejsPrompt).toMatch(NODESHIP_NODE_VERSION);
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

    expect(nodejsPrompt).toMatch(NODESHIP_NODE_VERSION);
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

  test("doesn't fail when using colors", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: ["node_modules"],
          files: [],
          path: PROJECT_PATH
        }
      },
      nodejs: {
        color: {
          type: "keyword",
          value: "green"
        },
        preposition: {
          color: {
            type: "keyword",
            value: "white"
          },
          value: "using"
        },
        symbol: "Node"
      }
    };

    await nodejs(config);
  });
});
