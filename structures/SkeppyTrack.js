const { User, TextChannel } = require("discord.js");
const { ShoukakuTrack } = require("shoukaku");

class SkeppyTrack {
  /**
   * Create a new track
   * @constructor
   * @param {ShoukakuTrack} track
   * @param {User} user
   * @param {TextChannel} textChannel
   */
  constructor(track, user, textChannel) {
    this.track = track.track;
    this.info = track.info;
    this.requestChannel = textChannel;
    this.requestedBy = {
      id: user.id,
      avatarURL: user.displayAvatarURL({ dynamic: true }),
      mention: user.toString(),
    };
  }
}

module.exports = SkeppyTrack;
