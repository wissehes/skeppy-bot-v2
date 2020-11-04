const { User, Guild } = require("discord.js");
const Braincell = require("../db/models/Braincell");

class SkeppyBraincells {
  constructor(client) {
    this.client = client;
  }

  /**
   * Get the amount of braincells for someone
   * @param {User} user The user you want to get the amount of braincells of
   */
  async get(user) {
    const foundUser = await Braincell.findOne({ userId: user.id });

    if (foundUser) {
      return foundUser;
    } else {
      const newUser = new Braincell({
        userId: user.id,
      });

      await newUser.save();

      return newUser;
    }
  }

  /**
   * Give a user braincells
   * @param {User} user The user you want to give braincells
   * @param {Number} amount The amount of braincells you wanna give
   */
  async add(user, amount) {
    const braincells = await this.get(user);

    braincells.braincells += amount;

    await braincells.save();
    return braincells;
  }

  /**
   * Get a leaderboard for a guild
   * @param {number} max maximum amount of users to return
   */
  async leaderboard(max) {
    const all = await Braincell.find();
    const sorted = all
      .filter((a) => this.client.users.cache.has(a.userId))
      .sort((a, b) => a.braincells - b.braincells);

    if (sorted.length > max) {
      sorted.splice(max, all.length);
    }

    return sorted;
  }
}

module.exports = SkeppyBraincells;
