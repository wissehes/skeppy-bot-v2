const Point = require("../db/models/Point");

class PointsUtils {
  /**
   * Generate the level
   * @param {Number} points the amount of points
   */
  static calculateLevel(points) {
    return Math.floor(0.1 * Math.sqrt(points));
  }

  /**
   * Calculate the amount of points a level requires
   * @param {number} level the level
   */
  static calculatePointsForLevel(level) {
    let points = 0;
    let currentLevel = 0;

    while (currentLevel != level) {
      points++;
      currentLevel = this.calculateLevel(points);
    }
    return points;
  }

  /**
   * Calculate the amount of points that are needed to level up
   * @param {number} points Amount of points
   */
  static calculateNeededPoints(points) {
    let currentLevel = this.calculateLevel(points);

    const nextLevel = this.calculateLevel(points) + 1;

    let neededPoints = 0;
    while (currentLevel < nextLevel) {
      neededPoints++;
      currentLevel = this.calculateLevel(points + neededPoints);
    }
    return neededPoints;
  }

  /**
   * Calculate the rank the user has
   * @param {object} userPoints The points received from MongoDB
   */
  static async calculateRank(userPoints) {
    const allUsers = await Point.find({
      guildID: userPoints.guildID,
    });

    const sorted = allUsers.sort((a, b) => b.points - a.points);

    const mappedWithRankNumber = sorted.map((a, i) => ({
      userID: a.userID,
      rank: i + 1,
    }));

    const { rank } = mappedWithRankNumber.find(
      (a) => a.userID == userPoints.userID
    );
    return rank;
  }
}

module.exports = PointsUtils;
