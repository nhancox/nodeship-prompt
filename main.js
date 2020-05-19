const createPrompt = require("./prompt.js");
const resolveConfig = require("./config.js");

const PREVIOUS_EXIT_CODE = Number(process.argv[2]);
const SHELL = process.argv[3];

(async () => {
  const config = await resolveConfig(PREVIOUS_EXIT_CODE, SHELL);
  const nodeshipPrompt = await createPrompt(config);
  process.stdout.write(nodeshipPrompt);
})();
