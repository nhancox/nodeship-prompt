const directory = require("./directory.js");

describe("directory plugin", () => {
  test("prints the correct directory", async () => {
    const currentWorkingDirectory = "/var/data/nodeship";
    const config = {
      directory: {},
      environment: {
        currentWorkingDirectory: {
          path: currentWorkingDirectory,
        },
      },
    };

    const directoryPrompt = await directory(config);

    expect(directoryPrompt).toBe(currentWorkingDirectory);
  });

  test("includes a preposition when specified", async () => {
    const currentWorkingDirectory = "/var/data/nodeship";
    const preposition = "in";
    const config = {
      directory: { preposition: { value: preposition } },
      environment: {
        currentWorkingDirectory: { path: currentWorkingDirectory },
      },
    };

    const directoryPrompt = await directory(config);

    expect(directoryPrompt).toBe(`${preposition} ${currentWorkingDirectory}`);
  });

  test("replaces $HOME with a symbol when specified", async () => {
    const home = "/home/pilot";
    const innerDirectory = "/Documents";
    const currentWorkingDirectory = `${home}${innerDirectory}`;
    const homeSymbol = "~";
    const config = {
      directory: { homeSymbol },
      environment: {
        currentWorkingDirectory: { path: currentWorkingDirectory },
        home,
      },
    };

    const directoryPrompt = await directory(config);

    expect(directoryPrompt).toBe(`${homeSymbol}${innerDirectory}`);
  });

  test("ignores $HOME patterns after the root", async () => {
    const currentWorkingDirectory = "/var/data/home/pilot";
    const home = "/home/pilot";
    const homeSymbol = "~";
    const config = {
      directory: { homeSymbol },
      environment: {
        currentWorkingDirectory: { path: currentWorkingDirectory },
        home,
      },
    };

    const directoryPrompt = await directory(config);

    expect(directoryPrompt).toBe(currentWorkingDirectory);
  });
});
