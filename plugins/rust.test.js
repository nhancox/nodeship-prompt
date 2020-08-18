// These tests require you to have the proper Rust toolchain version installed.
// All tests are enclosed in a `describe` block with `skip` so they do not run
// by default.
// If you use `asdf-vm`, the `.tool-versions` file that is read ensures that the
// right version will be used in the project directory.

const path = require("path");

const rust = require("./rust.js");
const toolVersion = require("../lib/toolVersion.js");

let NODESHIP_RUST_VERSION;
const PROJECT_PATH = path.resolve(__dirname, "..");

describe.skip("rust tests (when Rust is installed)", () => {
  beforeAll(async () => {
    NODESHIP_RUST_VERSION = await toolVersion("rust");
  });

  // Note that this is the same as the next test. Wanted to make the different
  // cases explicit. Might want to look at a way to separate them later.
  test("prints the correct Rust version", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["Cargo.toml"],
          path: PROJECT_PATH,
        },
      },
      rust: {},
    };

    const rustPrompt = await rust(config);

    expect(rustPrompt).toBe(NODESHIP_RUST_VERSION);
  });

  test("triggers on `Cargo.toml` file", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["Cargo.toml"],
          path: PROJECT_PATH,
        },
      },
      rust: {},
    };

    const rustPrompt = await rust(config);

    expect(rustPrompt).toBe(NODESHIP_RUST_VERSION);
  });

  test("triggers on any `.rs` file", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["README.md", "main.rs"],
          path: PROJECT_PATH,
        },
      },
      rust: {},
    };

    const rustPrompt = await rust(config);

    expect(rustPrompt).toBe(NODESHIP_RUST_VERSION);
  });

  test("doesn't trigger on dot files", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["README.md", ".config.rs"],
          path: PROJECT_PATH,
        },
      },
      rust: {},
    };

    const rustPrompt = await rust(config);

    expect(rustPrompt).toBe("");
  });

  test("includes a preposition when specified", async () => {
    const preposition = "using";
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["Cargo.toml"],
          path: PROJECT_PATH,
        },
      },
      rust: {
        preposition: { value: preposition },
      },
    };

    const rustPrompt = await rust(config);

    expect(rustPrompt).toBe(`${preposition} ${NODESHIP_RUST_VERSION}`);
  });

  test("includes a symbol when specified", async () => {
    const symbol = "Rust";
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["Cargo.toml"],
          path: PROJECT_PATH,
        },
      },
      rust: { symbol },
    };

    const rustPrompt = await rust(config);

    expect(rustPrompt).toBe(`${symbol} ${NODESHIP_RUST_VERSION}`);
  });

  test("doesn't trigger with no directory or file matches", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: ["build", "dist", "lib"],
          files: ["README.md", "__init__.py", "LICENSE"],
          path: PROJECT_PATH,
        },
      },
      rust: {},
    };

    const rustPrompt = await rust(config);

    expect(rustPrompt).toBe("");
  });
});
