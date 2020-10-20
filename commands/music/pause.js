const { MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");
const MusicPermUtils = require("../../utils/MusicPermUtils");

module.exports = class PauseCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "pause",
      memberName: "pause",
      aliases: [],
      group: "music",
      description: "Pauses the music playback",
      guildOnly: true,
    });
    this.utils = new MusicPermUtils();
  }

  async run(message) {
    if (!this.utils.canPause(message)) return;

    //const dispatcher = this.client.queue.get(message.guild.id);

    const player = this.client.player.getPlayer(message.guild.id);

    if (player.paused) {
      const embed = new MessageEmbed()
        .setColor("RED")
        .setDescription("Player is already paused!");

      message.embed(embed);
    } else {
      await player.setPaused(true);

      const embed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription("Paused player!");

      message.embed(embed);
    }
  }
};
