module.exports = function(config) {
  let hostPrompt = "";

  if (config.host.preposition) {
    hostPrompt += `${config.host.preposition} `;
  }

  hostPrompt += config.env.HOSTNAME;

  return hostPrompt;
};
