const { KSoftClient } = require("@ksoft/api");
const { CommandoClient } = require("discord.js-commando");

const Keyv = require("keyv");
const KeyvProvider = require("commando-provider-keyv");

const connectToMongoDB = require("../db/connect");

const SkeppyBraincells = require("./SkeppyBraincells");
const SkeppyPoints = require("./SkeppyPoints");

const fs = require("fs");
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

    // Presence stuff
    this.defaultPresence = `with {guilds} servers | {prefix} help`;
    this.presenceText = "";
  }

  /**
   * Update the presence data
   */
  async updatePresence() {
    this.loadPresence();

    this.user.setActivity(this.formatPresence(this.presenceText));
  }

  /**
   * Set a custom presence
   * @param {string} text the presence to set
   */
  setPresence(text) {
    this.presenceText = text;
    this.user.setActivity(this.formatPresence(text));
    fs.writeFileSync("./db/presence.txt", text);
  }

  /**
   * Loads the presence
   */
  loadPresence() {
    if (fs.existsSync("./db/presence.txt")) {
      this.presenceText = fs.readFileSync("./db/presence.txt", "utf-8");
    } else {
      this.presenceText = this.defaultPresence;
    }
    return this.presenceText;
  }

  formatPresence(text) {
    const guilds = this.guilds.cache.size;
    return text
      .replace("{guilds}", guilds)
      .replace("{prefix}", this.commandPrefix);
  }
}

module.exports = SkeppyCommandoClient;
