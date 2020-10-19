const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");
const MusicPermUtils = require("../../utils/MusicPermUtils");

module.exports = class NowplayingCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "nowplaying",
      memberName: "nowplaying",
      aliases: ["np", "current", "song"],
      group: "music",
      description: "Displays info about the current playing track",
      guildOnly: true,
    });
    this.utils = new MusicPermUtils();
  }

  async run(message) {
    if (!this.utils.isPlaying(message)) return;

    const { current, player } = this.client.queue.get(message.guild.id);

    const currentPosFormatted = this.client.music.formatMS(player.position);
    const totalTimeFormatted = this.client.music.formatMS(current.info.length);

    const embed = new MessageEmbed()
      .setTitle(current.info.title)
      .setURL(current.info.uri)
      .setColor("random").setDescription(stripIndents`${this.genProgressBar(
      this.client,
      message
    )} [${currentPosFormatted} / ${totalTimeFormatted}]
        **Requested by:** ${current.requestedBy.mention}`);

    message.embed(embed);
  }

  genProgressBar(client, message) {
    const dots = 20;
    const currentposDot = "🔘";
    const empty = "▬";
    const dispatcher = client.queue.get(message.guild.id);

    const totalTime = dispatcher.current.info.length;
    const currentTime = dispatcher.player.position;

    const percentage = (currentTime / totalTime) * 100;
    const rounded = this.roundToFive(percentage);

    const bar = [];

    for (let i = 0; i < dots; i++) {
      if (this.roundToFive(i * 5) == rounded) {
        bar.push(currentposDot);
      } else bar.push(empty);
    }

    return bar.join("");
  }

  roundToFive(num) {
    return Math.floor(num / 5) * 5;
  }
};
