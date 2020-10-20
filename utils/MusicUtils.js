const { MessageEmbed, Message } = require("discord.js");
const { ShoukakuPlayer } = require("shoukaku");
const SkeppyTrack = require("../structures/SkeppyTrack");
const SkeppyCommandoClient = require("../structures/SkeppyCommandoClient");
const { stripIndents } = require("common-tags");

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
      .setColor("RANDOM").setDescription(stripIndents`Length: **${this.formatMS(
      newTrack.info.length
    )}**
        ${
          newTrack.info.author ? `Uploaded by: **${newTrack.info.author}**` : ""
        }
Requested by: **${requestedBy.username}**\`#${requestedBy.discriminator}\`
`);

    return embed;
  }

  /**
   * Check if the user is allowed to execute the music commands
   * @param {object} opts The options object
   * @param {Message} opts.message The message object
   * @param {SkeppyCommandoClient} opts.client The client
   */
  static checkIfAllowed(opts) {
    const { message, client } = opts;

    if (!message.member.voice.channel) {
      message.reply("You need to be in a voice channel!");
      return false;
    }

    if (!client.queue.has(message.guild.id)) {
      message.reply("Nothing's playing!");
      return false;
    }

    const dispatcher = client.queue.players.get(message.guild.id);

    const memberVCID = message.member.voice.channel.id;
    const playerVCID = dispatcher.player.voiceConnection.voiceChannelID;

    if (memberVCID !== playerVCID) {
      message.reply("You need to be in the same channel as me!");
      return false;
    }

    return dispatcher;
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
