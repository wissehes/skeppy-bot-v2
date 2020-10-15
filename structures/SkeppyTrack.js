const { User } = require("discord.js");
const { ShoukakuTrack } = require("shoukaku");

class SkeppyTrack {
  /**
   * Create a new track
   * @constructor
   * @param {ShoukakuTrack} track
   * @param {User} user
   */
  constructor(track, user) {
    this.track = track.track;
    this.info = track.info;
    this.requestedBy = {
      id: user.id,
      avatarURL: user.displayAvatarURL({ dynamic: true }),
      mention: user.toString(),
    };
  }
}

module.exports = SkeppyTrack;
