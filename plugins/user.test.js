const user = require("./user.js");

describe("user plugin", () => {
  test("prints the corret user", async () => {
    const username = "pilot";
    const config = { env: { USER: username } };

    const userPrompt = await user(config);
    expect(userPrompt).toBe(username);
  });
});
