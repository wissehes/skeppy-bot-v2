const { KSoftClient } = require("@ksoft/api");
const { CommandoClient } = require("discord.js-commando");

class SkeppyCommandoClient extends CommandoClient {
  constructor(options) {
    super(options);

    this.config = options.config;
    this.ksoft = new KSoftClient(this.config.api.ksoft);
  }
}

module.exports = SkeppyCommandoClient;
