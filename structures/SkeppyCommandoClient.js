const { KSoftClient } = require("@ksoft/api");
const { CommandoClient } = require("discord.js-commando");

const config = require("../config");

class SkeppyCommandoClient extends CommandoClient {
  constructor(options) {
    super(options);

    this.config = config;
    this.ksoft = new KSoftClient(config.api.ksoft);
  }
}

module.exports = SkeppyCommandoClient;
