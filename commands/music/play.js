const SkeppyCommand = require("../../structures/SkeppyCommand");
const SkeppyTrack = require("../../structures/SkeppyTrack");

module.exports = class PlayCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "play",
      memberName: "play",
      aliases: ["p"],
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

    if (!results) {
      return message.reply("I couldn't find anything...");
    }

    const track = new SkeppyTrack(
      results.tracks[0],
      message.author,
      message.channel
    );

    const dispatcher = await this.client.queue.handle({
      message,
      node,
      track,
    });

    if (dispatcher) {
      await dispatcher.play();
    }
  }
};
