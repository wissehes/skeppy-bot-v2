const SkeppyCommand = require("../../structures/SkeppyCommand");

module.exports = class PlayCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "play",
      memberName: "play",
      aliases: [],
      group: "music",
      description: "Play music!",
      guildOnly: true,
      clientPermissions: ["CONNECT", "SPEAK"],
      args: [
        {
          key: "song",
          prompt: "Which song do you want to play?",
          type: "string",
        },
      ],
    });
  }

  async run(message, { song }) {
    if (!message.member.voice.channel) {
      return message.reply("you're not in a voicechannel!");
    }
    const node = this.client.player.getNode();

    const results = await node.rest.resolve(song, "youtube");
    if (!results) return;

    const dispatcher = await this.client.queue.handle({
      message,
      node,
      track: results.tracks[0],
    });

    if (dispatcher) {
      await dispatcher.play();
    }
  }
};
