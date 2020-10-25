const { Guild, GuildMember, MessageAttachment } = require("discord.js");
const Point = require("../db/models/Point");
const PointsUtils = require("../utils/PointsUtils");

const { Rank } = require("canvacord");

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
   * Get all points for a guild
   * @param {Guild} guild the guild in question
   */
  async getAll(guild) {
    const allPoints = await Point.find({
      guildID: guild.id,
    });

    return allPoints;
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

    const currentLevel = points.level;
    const newLevel = PointsUtils.calculateLevel(points.points);

    const leveledUp = newLevel > currentLevel;

    points.level = newLevel;

    await points.save();
    return {
      leveledUp,
      points,
    };
  }

  /**
   * Generate a member's xp card
   * @param {Guild} guild The guild the member is in
   * @param {GuildMember} member The member
   */
  async generateCard(guild, member) {
    const userPoints = await this.get(guild, member);
    const cardData = await this.generateCardData(userPoints);

    const card = new Rank()
      .setAvatar(member.user.displayAvatarURL({ format: "png" }))
      .setCurrentXP(cardData.currentXP)
      .setRequiredXP(cardData.neededXP)
      .setLevel(userPoints.level)
      .setRank(cardData.rank)
      .setStatus(member.presence.status)
      .setProgressBar(["#FF0000", "#0000FF"], "GRADIENT")
      .setUsername(member.user.username)
      .setDiscriminator(member.user.discriminator);

    const built = await card.build();

    const attachment = new MessageAttachment(built, "card.png");
    return attachment;
  }

  /**
   * Generate the card data
   * @param {object} userPoints The points received from MongoDB
   */
  async generateCardData(userPoints) {
    // Get the current rank of the user
    const rank = await PointsUtils.calculateRank(userPoints);

    // Get the points that are needed for the current level
    const neededPointsForLevel = PointsUtils.calculatePointsForLevel(
      userPoints.level
    );

    // Get the points that are needed to level up
    const neededPointsForLevelUp = PointsUtils.calculateNeededPoints(
      userPoints.points
    );

    // Subtract the points that are needed from
    // the current level from the user's points
    const currentPoints = userPoints.points - neededPointsForLevel;

    // Add the needed points to level up to the currentpoints
    const neededPoints = neededPointsForLevelUp + currentPoints;

    return {
      rank,
      level: userPoints.level,
      neededXP: neededPoints,
      currentXP: currentPoints,
    };
  }
}

module.exports = SkeppyPoints;
