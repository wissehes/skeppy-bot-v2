const { Collection, User, Message } = require("discord.js");
const SkeppyDispatcher = require("./SkeppyDispatcher");
const SkeppyTrack = require("./SkeppyTrack");

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
  get(id) {
    return this.players.get(id);
  }

  /**
   *
   * @param {object} trackData The trackdata
   * @param {Message} trackData.message The message object
   * @param {object} trackData.node The node to use
   * @param {SkeppyTrack} trackData.track The track object
   */
  async handle(trackData) {
    let { message, node, track } = trackData;

    const exists = this.players.get(message.guild.id);

    if (exists) {
      exists.addTrack(track);
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

      dispatcher.addTrack(track);
      this.players.set(message.guild.id, dispatcher);

      return dispatcher;
    }
  }
}

module.exports = QueueHandler;
