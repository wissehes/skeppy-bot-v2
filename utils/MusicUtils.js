const { MessageEmbed } = require("discord.js");
const { ShoukakuPlayer } = require("shoukaku");
const SkeppyTrack = require("../structures/SkeppyTrack");

class MusicUtils {
  constructor(client) {
    this.client = client;
  }
  /**
   * Generate the now playing embed
   * @param {Array} queue the queue
   * @param {ShoukakuPlayer} player The current player
   * @param {SkeppyTrack} currentTrack The current track
   */
  nowPlayingEmbed(queue, player, currentTrack) {
    const channel = this.client.channels.resolve(
      player.voiceConnection.voiceChannelID
    );
    const requestedBy = this.client.users.resolve(currentTrack.requestedBy.id);

    const embed = new MessageEmbed()
      .setAuthor(
        `Playing in ${channel.name}`,
        currentTrack.requestedBy.avatarURL
      )
      .setTitle(currentTrack.info.title || "Unknown title")
      .setColor("RANDOM").setDescription(`
Length: **${currentTrack.info.length}**
Requested by: **${requestedBy.username}**\`#${requestedBy.discriminator}\`
`);

    return embed;
  }

  /**
   * Format seconds to hh:mm:ss style
   * @param {number} seconds The number of seconds
   */
  formatSeconds(seconds) {}
}

module.exports = MusicUtils;
