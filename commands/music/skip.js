const SkeppyCommand = require("../../structures/SkeppyCommand");
const MusicPermUtils = require("../../utils/MusicPermUtils");

module.exports = class SkipCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "skip",
      memberName: "skip",
      aliases: ["next"],
      group: "music",
      description: "Skips to the next song!",
      guildOnly: true,
    });
    this.utils = new MusicPermUtils();
  }

  async run(message) {
    if (!this.utils.canSkip(message)) {
      return;
    }

    const dispatcher = this.client.queue.get(message.guild.id);

    await dispatcher.player.stopTrack();

    message.react("✅");
  }
};
