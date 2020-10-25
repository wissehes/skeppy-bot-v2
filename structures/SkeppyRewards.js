const { Guild, Role } = require("discord.js");
const Reward = require("../db/models/Reward");

class SkeppyRewards {
  constructor(client) {
    this.client = client;
  }

  /**
   * Get all rewards for a guild
   * @param {Guild} guild
   */
  async all(guild) {
    const all = await Reward.find({
      guildID: guild.id,
    });

    return all;
  }

  /**
   * Check if a reward exists
   * @param {Role} role
   * @param {Number} level
   */
  async exists(role, level) {
    const exists = await Reward.exists({
      guildID: role.guild.id,
      roleID: role.id,
      level,
    });

    return exists;
  }

  /**
   * Create new reward
   * @param {Role} role The role to give
   * @param {Number} level The required level
   */
  async create(role, level) {
    if (await this.exists(role, level)) {
      throw new Error("Reward already exists!");
    }

    const newReward = new Reward({
      guildID: role.guild.id,
      roleID: role.id,
      level,
    });
    await newReward.save();

    return newReward;
  }

  async remove(role, level) {
    if (!(await this.exists(role, level))) {
      throw new Error("Reward doesn't exist!");
    }

    const reward = await Reward.findOne({
      guildID: role.guild.id,
      roleID: role.id,
      level,
    });

    await reward.remove();

    return true;
  }
}

module.exports = SkeppyRewards;
