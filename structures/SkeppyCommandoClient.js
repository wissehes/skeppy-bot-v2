const { KSoftClient } = require("@ksoft/api");
const { CommandoClient } = require("discord.js-commando");

const Keyv = require("keyv");
const KeyvProvider = require("commando-provider-keyv");

const connectToMongoDB = require("../db/connect");

const SkeppyBraincells = require("./SkeppyBraincells");
const SkeppyPoints = require("./SkeppyPoints");

class SkeppyCommandoClient extends CommandoClient {
  constructor(options) {
    super(options);

    // Bind config to this
    this.config = options.config;
    // Bind ksoft to this
    this.ksoft = new KSoftClient(this.config.api.ksoft);
    // Bind SkeppyBraincells to this
    this.braincells = new SkeppyBraincells(this);
    // Bind SkeppyPoints to this
    this.points = new SkeppyPoints(this);

    // DB stuff
    connectToMongoDB(this.config.mongoURI);
    this.settingsKeyv = new Keyv("sqlite://db/settings.sqlite");
    this.setProvider(new KeyvProvider(this.settingsKeyv));
  }
}

module.exports = SkeppyCommandoClient;
