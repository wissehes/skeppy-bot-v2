class GerneralUtils {
  /**
   * Get a random number
   * @param {number} min the minimum amount of numbers
   * @param {number} max the maximum amount of numbers
   */
  static randomNumber(min, max) {
    return Math.round(Math.random() * max) + min;
  }
}

module.exports = GerneralUtils;
