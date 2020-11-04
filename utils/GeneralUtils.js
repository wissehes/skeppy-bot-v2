class GerneralUtils {
  /**
   * Get a random number
   * @param {number} min the minimum amount of numbers
   * @param {number} max the maximum amount of numbers
   */
  static randomNumber(min, max) {
    return Math.round(Math.random() * max) + min;
  }

  /**
   * Shuffles an aray
   * @param {array} array The array you want to shuffle
   */
  static shuffleArray(array) {
    let counter = array.length;

    while (counter) {
      let index = Math.floor(Math.random() * counter);

      counter--;

      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  }

  /**
   * Returns a random value of an array
   * @param {array} array
   */
  static randomValue(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

module.exports = GerneralUtils;
