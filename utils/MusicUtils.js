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
        `Playing in #${channel.name}`,
        currentTrack.requestedBy.avatarURL
      )
      .setTitle(currentTrack.info.title || "Unknown title")
      .setURL(currentTrack.info.uri)
      .setColor("RANDOM");

    embed.setFooter(
      `Requested by ${requestedBy.tag} | ${queue.length} ${
        queue.length > 1 ? "tracks" : "track"
      } remaining in the queue...`
    );

    return embed;
  }

  /**
   * Generate the "added to queue" embed
   * @param {SkeppyTrack} newTrack The new track
   */
  addedToQueueEmbed(newTrack) {
    const requestedBy = this.client.users.resolve(newTrack.requestedBy.id);

    const embed = new MessageEmbed()
      .setAuthor(`Added to the queue`, newTrack.requestedBy.avatarURL)
      .setTitle(newTrack.info.title || "Unknown title")
      .setURL(newTrack.info.uri)
      .setColor("RANDOM")
      .setDescription(
        `Length: **${this.formatMS(newTrack.info.length)}**
        ${
          newTrack.info.author ? `Uploaded by: **${newTrack.info.author}**` : ""
        }
Requested by: **${requestedBy.username}**\`#${requestedBy.discriminator}\`
`
      );

    return embed;
  }

  /**
   * Format milliseconds to hh:mm:ss style
   * @param {number} millisec The number of milliseconds
   */
  formatMS(millisec) {
    // Credit: https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript

    var seconds = (millisec / 1000).toFixed(0);
    var minutes = Math.floor(seconds / 60);
    var hours = "";
    if (minutes > 59) {
      hours = Math.floor(minutes / 60);
      hours = hours >= 10 ? hours : "0" + hours;
      minutes = minutes - hours * 60;
      minutes = minutes >= 10 ? minutes : "0" + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = seconds >= 10 ? seconds : "0" + seconds;
    if (hours != "") {
      return hours + ":" + minutes + ":" + seconds;
    }

    return minutes + ":" + seconds;
  }
}

module.exports = MusicUtils;
