const { Command, CommandInfo } = require("discord.js-commando");

class SkeppyCommand extends Command {
  /**
   *
   * @param {*} client Client
   * @param {CommandInfo} info Command info
   */

  constructor(client, info) {
    super(client, info);

    this.credit = info.credit || [];
    this.credit.push({
      name: "TheChicken14",
      for: "Developer",
      url: "https://github.com/TheChicken14/skeppy-bot-v2",
    });
  }
}

module.exports = SkeppyCommand;
