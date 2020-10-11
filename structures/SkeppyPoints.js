const { Guild, GuildMember, MessageAttachment } = require("discord.js");
const Point = require("../db/models/Point");
const PointsUtils = require("../utils/PointsUtils");

class SkeppyPoints {
  constructor(client) {
    this.client = client;
  }

  /**
   * Get a member's points
   * @param {Guild} guild The guild of the user
   * @param {GuildMember} member The member in question
   */
  async get(guild, member) {
    const foundUser = await Point.findOne({
      guildID: guild.id,
      userID: member.id,
    });

    if (foundUser) {
      return foundUser;
    } else {
      const newUser = new Point({
        guildID: guild.id,
        userID: member.id,
      });
      await newUser.save();

      return newUser;
    }
  }

  /**
   * Give a user points
   * @param {Guild} guild The guild
   * @param {GuildMember} member The member
   * @param {Number} amount The amount of points to give
   */
  async givePoints(guild, member, amount) {
    const points = await this.get(guild, member);

    points.points += amount;
    points.level = PointsUtils.generateLevel(points.points);

    await points.save();

    return points;
  }
}

module.exports = SkeppyPoints;
