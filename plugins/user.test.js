const user = require("./user.js");

describe("user plugin", () => {
  test("prints the correct user", async () => {
    const username = "pilot";
    const config = { environment: { user: username }, user: {} };

    const userPrompt = await user(config);

    expect(userPrompt).toBe(username);
  });
});
