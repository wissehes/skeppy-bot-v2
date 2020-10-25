const { Guild, Role } = require("discord.js");
const { CommandoMessage } = require("discord.js-commando");
const Reward = require("../db/models/Reward");
const SkeppyCommandoClient = require("./SkeppyCommandoClient");

class SkeppyRewards {
  /**
   * @param {SkeppyCommandoClient} client
   */
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
   * Check and give the rewards
   * @param {CommandoMessage} message
   */
  async checkAndReward(message) {
    const rewards = await this.all(message.guild);
    const userPoints = await this.client.points.get(
      message.guild,
      message.member
    );

    for (const reward of rewards) {
      if (userPoints.level >= reward.level) {
        message.member.roles.add(reward.roleID).catch((e) => null);
      }
    }
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
