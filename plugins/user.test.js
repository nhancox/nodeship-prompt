const user = require("./user.js");

describe("user plugin", () => {
  test("prints the correct user", async () => {
    const username = "pilot";
    const config = { env: { USER: username }, user: {} };

    const userPrompt = await user(config);

    expect(userPrompt).toBe(username);
  });

  test("doesn't fail when using colors", async () => {
    const username = "pilot";
    const color = {
      type: "keyword",
      value: "yellow"
    };
    const config = {
      env: { USER: username },
      user: { color }
    };

    await user(config);
  });
});
