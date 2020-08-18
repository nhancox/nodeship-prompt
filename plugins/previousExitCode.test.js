const previousExitCode = require("./previousExitCode.js");

test("print nothing on code 0", async () => {
  const config = { environment: { previousExitCode: 0 }, previousExitCode: {} };

  const previousExitCodePrompt = await previousExitCode(config);

  expect(previousExitCodePrompt).toBe("");
});

test("print the correct exit code when non-zero", async () => {
  const exitCode = String(101);
  const config = {
    environment: { previousExitCode: exitCode },
    previousExitCode: {},
  };

  const previousExitCodePrompt = await previousExitCode(config);

  expect(previousExitCodePrompt).toBe(exitCode);
});
