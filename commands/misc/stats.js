const { MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");
const InfoUtils = require("../../utils/InfoUtils");

module.exports = class StatsCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "stats",
      memberName: "stats",
      aliases: ["info"],
      group: "misc",
      description: "Shows info about me!",
    });
  }
  async run(message) {
    const info = new InfoUtils();
    const owners = this.client.owners.map((o) => o.tag).join(", ");

    const embed = new MessageEmbed()
      .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
      .setColor("RANDOM")
      .setTitle("Here's some info about me")
      .setDescription(
        "Hi! I'm the Skeppy Bot, a Discord bot created with NodeJS and Discord.js Commando."
      )
      .addField("Guild count", this.client.guilds.cache.size, true)
      .addField("Developers", owners, true)
      .addField("Node JS Version", process.version, true)
      .addField("Discord.js version", info.getModuleVersion("discord.js"), true)
      .addField("Uptime", info.getNodeUptime(), true)
      .addField("System uptime", info.getOSUptime(), true)
      .addField("Platform", info.getPlatform(), true)
      .addField(
        "Memory usage",
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        true
      )
      .addField(`Total memory`, info.getTotalMemory(), true)
      .addField(
        "GitHub Repo",
        `[TheChicken14/skeppy-bot-v2](https://github.com/TheChicken14/skeppy-bot-v2)`
      );
    message.embed(embed);
  }
};
