class PointsUtils {
  static generateLevel(points) {
    return Math.floor(0.1 * Math.sqrt(points));
  }
}

module.exports = PointsUtils;
