// These tests require you to have the proper Python version installed.
// All tests are enclosed in a `describe` block with `skip` so they do not run
// by default.
// If you use `asdf-vm`, the `.tool-versions` file that is read ensures that the
// right version will be used in the project directory.

const path = require("path");

const python = require("./python.js");
const toolVersion = require("../lib/toolVersion.js");

let NODESHIP_PYTHON_VERSION;
const PROJECT_PATH = path.resolve(__dirname, "..");

describe.skip("python tests (when Python is installed)", () => {
  beforeAll(async () => {
    NODESHIP_PYTHON_VERSION = await toolVersion("python");
  });

  // Note that this is similar to the next test. Wanted to make the different
  // cases explicit. Might want to look at a way to separate them later.
  test("prints the correct Python version", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["Pipfile"],
          path: PROJECT_PATH
        }
      },
      python: {}
    };

    const pythonPrompt = await python(config);

    expect(pythonPrompt).toBe(NODESHIP_PYTHON_VERSION);
  });

  test("triggers on a Python-specific file", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: [
            "app.js",
            ".python-version",
            "Pipfile",
            "pyproject.toml",
            "requirements.txt",
            "tox.ini"
          ],
          path: PROJECT_PATH
        }
      },
      python: {}
    };

    const pythonPrompt = await python(config);

    expect(pythonPrompt).toBe(NODESHIP_PYTHON_VERSION);
  });

  test("triggers on any `.py` file", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["README.md", "__init__.py"],
          path: PROJECT_PATH
        }
      },
      python: {}
    };

    const pythonPrompt = await python(config);

    expect(pythonPrompt).toBe(NODESHIP_PYTHON_VERSION);
  });

  test("doesn't trigger on dot files", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["README.md", ".config.py"],
          path: PROJECT_PATH
        }
      },
      python: {}
    };

    const pythonPrompt = await python(config);

    expect(pythonPrompt).toBe("");
  });

  test("includes a preposition when specified", async () => {
    const preposition = "using";
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["Pipfile"],
          path: PROJECT_PATH
        }
      },
      python: {
        preposition: { value: preposition }
      }
    };

    const pythonPrompt = await python(config);

    expect(pythonPrompt).toBe(`${preposition} ${NODESHIP_PYTHON_VERSION}`);
  });

  test("includes a symbol when specified", async () => {
    const symbol = "Python";
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["Pipfile"],
          path: PROJECT_PATH
        }
      },
      python: { symbol }
    };

    const pythonPrompt = await python(config);

    expect(pythonPrompt).toBe(`${symbol} ${NODESHIP_PYTHON_VERSION}`);
  });

  test("doesn't trigger with no directory or file matches", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: ["build", "dist", "lib"],
          files: ["README.md", "ini.php", "LICENSE"],
          path: PROJECT_PATH
        }
      },
      python: {}
    };

    const pythonPrompt = await python(config);

    expect(pythonPrompt).toBe("");
  });
});
