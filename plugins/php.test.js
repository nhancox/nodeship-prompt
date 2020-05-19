// These tests require you to have the proper PHP version installed.
// All tests are enclosed in a `describe` block with `skip` so they do not run
// by default.
// If you use `asdf-vm`, the `.tool-versions` file that is read ensures that the
// right version will be used in the project directory.

const path = require("path");

const php = require("./php.js");
const toolVersion = require("../lib/toolVersion.js");

let NODESHIP_PHP_VERSION;
const PROJECT_PATH = path.resolve(__dirname, "..");

describe.skip("php tests (when PHP is installed)", () => {
  beforeAll(async () => {
    NODESHIP_PHP_VERSION = await toolVersion("php");
  });

  // Note that this is the same as the next test. Wanted to make the different
  // cases explicit. Might want to look at a way to separate them later.
  test("prints the correct PHP version", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["composer.json"],
          path: PROJECT_PATH
        }
      },
      php: {}
    };

    const phpPrompt = await php(config);

    expect(phpPrompt).toBe(NODESHIP_PHP_VERSION);
  });

  test("triggers on `composer.json` file", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["composer.json"],
          path: PROJECT_PATH
        }
      },
      php: {}
    };

    const phpPrompt = await php(config);

    expect(phpPrompt).toBe(NODESHIP_PHP_VERSION);
  });

  test("triggers on any `.php` file", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["README.md", "ini.php"],
          path: PROJECT_PATH
        }
      },
      php: {}
    };

    const phpPrompt = await php(config);

    expect(phpPrompt).toBe(NODESHIP_PHP_VERSION);
  });

  test("doesn't trigger on dot files", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["README.md", ".config.php"],
          path: PROJECT_PATH
        }
      },
      php: {}
    };

    const phpPrompt = await php(config);

    expect(phpPrompt).toBe("");
  });

  test("includes a preposition when specified", async () => {
    const preposition = "using";
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["composer.json"],
          path: PROJECT_PATH
        }
      },
      php: {
        preposition: { value: preposition }
      }
    };

    const phpPrompt = await php(config);

    expect(phpPrompt).toBe(`${preposition} ${NODESHIP_PHP_VERSION}`);
  });

  test("includes a symbol when specified", async () => {
    const symbol = "PHP";
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["composer.json"],
          path: PROJECT_PATH
        }
      },
      php: { symbol }
    };

    const phpPrompt = await php(config);

    expect(phpPrompt).toBe(`${symbol} ${NODESHIP_PHP_VERSION}`);
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
      php: {}
    };

    const phpPrompt = await php(config);

    expect(phpPrompt).toBe("");
  });
});
