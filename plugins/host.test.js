const host = require("./host.js");

describe("host plugin", () => {
  test("prints the correct host name", async () => {
    const hostName = "nodeship";
    const config = {
      environment: { host: hostName },
      host: {},
    };

    const hostPrompt = await host(config);

    expect(hostPrompt).toBe(hostName);
  });

  test("includes a preposition when specified", async () => {
    const hostName = "nodeship";
    const preposition = "at";
    const config = {
      environment: { host: hostName },
      host: { preposition: { value: preposition } },
    };

    const hostPrompt = await host(config);

    expect(hostPrompt).toBe(`${preposition} ${hostName}`);
  });
});
