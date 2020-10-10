const { User, Guild } = require("discord.js");
const Point = require("../db/models/Point");
const PointsUtils = require("../utils/PointsUtils");

class SkeppyPoints {
  constructor(client) {
    this.client = client;
  }

  /**
   * Get a user's points
   * @param {Guild} guild The guild of the user
   * @param {User} user The user in question
   */
  async get(guild, user) {
    const foundUser = await Point.findOne({
      guildID: guild.id,
      userID: user.id,
    });

    if (foundUser) {
      return foundUser;
    } else {
      const newUser = new Point({
        guildID: guild.id,
        userID: user.id,
      });
      await newUser.save();

      return newUser;
    }
  }

  /**
   * Give a user points
   * @param {Guild} guild The guild
   * @param {User} user The user
   * @param {Number} amount The amount of points to give
   */
  async givePoints(guild, user, amount) {
    const points = await this.get(guild, user);

    points.points += amount;
    points.level = PointsUtils.generateLevel(points.points);

    await points.save();

    return points;
  }
}

module.exports = SkeppyPoints;
