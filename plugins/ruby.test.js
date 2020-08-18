// These tests require you to have the proper Ruby version installed.
// All tests are enclosed in a `describe` block with `skip` so they do not run
// by default.
// If you use `asdf-vm`, the `.tool-versions` file that is read ensures that the
// right version will be used in the project directory.

const path = require("path");

const ruby = require("./ruby.js");
const toolVersion = require("../lib/toolVersion.js");

let NODESHIP_RUBY_VERSION;
const PROJECT_PATH = path.resolve(__dirname, "..");

describe.skip("ruby tests (when Ruby is installed)", () => {
  beforeAll(async () => {
    NODESHIP_RUBY_VERSION = await toolVersion("ruby");
  });

  // Note that this is the same as the next test. Wanted to make the different
  // cases explicit. Might want to look at a way to separate them later.
  test("prints the correct Ruby version", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["Gemfile"],
          path: PROJECT_PATH,
        },
      },
      ruby: {},
    };

    const rubyPrompt = await ruby(config);

    // Use match because there can be characters (patch version?) appended
    expect(rubyPrompt).toMatch(NODESHIP_RUBY_VERSION);
  });

  test("triggers on `Gemfile` file", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["Gemfile"],
          path: PROJECT_PATH,
        },
      },
      ruby: {},
    };

    const rubyPrompt = await ruby(config);

    expect(rubyPrompt).toMatch(NODESHIP_RUBY_VERSION);
  });

  test("triggers on any `.rb` file", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["README.md", "app.rb"],
          path: PROJECT_PATH,
        },
      },
      ruby: {},
    };

    const rubyPrompt = await ruby(config);

    expect(rubyPrompt).toMatch(NODESHIP_RUBY_VERSION);
  });

  test("doesn't trigger on dot files", async () => {
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["README.md", ".config.rb"],
          path: PROJECT_PATH,
        },
      },
      ruby: {},
    };

    const rubyPrompt = await ruby(config);

    expect(rubyPrompt).toBe("");
  });

  test("includes a preposition when specified", async () => {
    const preposition = "using";
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["Gemfile"],
          path: PROJECT_PATH,
        },
      },
      ruby: {
        preposition: { value: preposition },
      },
    };

    const rubyPrompt = await ruby(config);

    expect(rubyPrompt).toMatch(`${preposition} ${NODESHIP_RUBY_VERSION}`);
  });

  test("includes a symbol when specified", async () => {
    const symbol = "Ruby";
    const config = {
      environment: {
        currentWorkingDirectory: {
          directories: [],
          files: ["Gemfile"],
          path: PROJECT_PATH,
        },
      },
      ruby: { symbol },
    };

    const rubyPrompt = await ruby(config);

    expect(rubyPrompt).toMatch(`${symbol} ${NODESHIP_RUBY_VERSION}`);
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
      ruby: {},
    };

    const rubyPrompt = await ruby(config);

    expect(rubyPrompt).toBe("");
  });
});
