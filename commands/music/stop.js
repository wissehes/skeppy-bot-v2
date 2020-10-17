const SkeppyCommand = require("../../structures/SkeppyCommand");
const MusicUtils = require("../../utils/MusicUtils");

module.exports = class StopCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "stop",
      memberName: "stop",
      aliases: ["dc", "disconnect", "sotp", "leave"],
      group: "music",
      description: "Stop the music player!",
      guildOnly: true,
    });
  }

  async run(message) {
    const dispatcher = MusicUtils.checkIfAllowed({
      message,
      client: this.client,
    });

    if (dispatcher) {
      dispatcher.destroy("stop");
    }
  }
};
