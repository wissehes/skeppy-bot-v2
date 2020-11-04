const { Command } = require("discord.js-commando");
const Usage = require("../db/models/Usage");
const SkeppyCommandoClient = require("./SkeppyCommandoClient");

class SkeppyUsages {
  /**
   * @param {SkeppyCommandoClient} client
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get the overall usages of all commands
   */
  async all() {
    const all = await Usage.find();
    const usages = all.reduce((prv, curr) => prv + curr.usages, 0);
    return usages;
  }
  /**
   * Get a command's usages
   * @param {Command} command command id
   */
  async get(command) {
    const find = {
      command: command.name,
    };
    const dbCommand = await Usage.findOne(find);
    if (dbCommand) {
      return dbCommand;
    } else {
      return new Usage({ ...find, usages: 0 });
    }
  }

  /**
   * Increment the number of usages for a command by 1
   * @param {Command} command command id
   */
  async inc(command) {
    const cmd = await this.get(command);

    cmd.usages++;

    await cmd.save();
    return cmd;
  }
}

module.exports = SkeppyUsages;
