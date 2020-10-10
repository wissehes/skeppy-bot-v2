const { KSoftClient } = require("@ksoft/api");
const { CommandoClient } = require("discord.js-commando");

const Keyv = require("keyv");
const KeyvProvider = require("commando-provider-keyv");

const connectToMongoDB = require("../db/connect");

class SkeppyCommandoClient extends CommandoClient {
  constructor(options) {
    super(options);

    this.config = options.config;
    this.ksoft = new KSoftClient(this.config.api.ksoft);

    this.settingsKeyv = new Keyv("sqlite://db/settings.sqlite");

    this.setProvider(new KeyvProvider(this.settingsKeyv));

    connectToMongoDB(this.config.mongoURI);
  }
}

module.exports = SkeppyCommandoClient;
