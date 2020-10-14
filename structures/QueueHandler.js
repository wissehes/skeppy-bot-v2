const { Collection } = require("discord.js");
const SkeppyDispatcher = require("./SkeppyDispatcher");

class QueueHandler {
  constructor(client) {
    this.client = client;
    this.players = new Collection();
  }

  has(id) {
    return this.players.has(id);
  }
  delete(id) {
    return this.players.delete(id);
  }

  async handle({ message, node, track }) {
    const exists = this.players.get(message.guild.id);

    if (exists) {
      exists.queue.push(track);
    } else {
      const player = await node.joinVoiceChannel({
        guildID: message.guild.id,
        voiceChannelID: message.member.voice.channelID,
      });

      const dispatcher = new SkeppyDispatcher({
        client: this.client,
        guild: message.guild,
        textChannel: message.channel,
        player,
      });

      dispatcher.queue.push(track);
      this.players.set(message.guild.id, dispatcher);

      return dispatcher;
    }
  }
}

module.exports = QueueHandler;
