const { MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");
const MusicPermUtils = require("../../utils/MusicPermUtils");

module.exports = class ResumeCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "resume",
      memberName: "resume",
      aliases: ["unpause"],
      group: "music",
      description: "Resumes music playback if paused",
      guildOnly: true,
    });
    this.utils = new MusicPermUtils();
  }

  async run(message) {
    if (!this.utils.canResume(message)) return;

    const player = this.client.player.getPlayer(message.guild.id);

    if (player.paused) {
      await player.setPaused(false);

      const embed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription("Resumed player!");

      message.embed(embed);
    } else {
      const embed = new MessageEmbed()
        .setColor("RED")
        .setDescription("Player isn't paused!");

      message.embed(embed);
    }
  }
};
