const { Argument } = require("discord.js-commando");
const SkeppyCommand = require("../../structures/SkeppyCommand");
const RewardUtils = require("../../utils/RewardUtils");

const { embed: generateEmbed } = require("../../utils/RewardUtils");

module.exports = class RemoverewardCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "removereward",
      memberName: "removereward",
      aliases: ["deletereward"],
      group: "levels",
      description: "Remove a reward!",
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"],
    });
  }

  async run(message) {
    const rewards = await this.client.rewards.all(message.guild);

    const embed = RewardUtils.createOverviewEmbed(message.guild, rewards);
    await message.embed(embed);

    if (!rewards.length) return;

    const myArg = new Argument(this.client, {
      prompt: "Which reward do you want to remove?",
      type: "integer",
      key: "number",
      parse: (v) => rewards[v - 1],
      min: 1,
      max: rewards.length,
    });
    const { value, cancelled } = await myArg.obtain(message);

    if (cancelled) return;

    try {
      await value.remove();
      const role = message.guild.roles.cache.get(value.roleID);
      const mention = role ? role.toString() : "**Not found**";

      const embed = generateEmbed({
        type: "removed",
        role: mention,
        level: value.level,
      });

      message.embed(embed);
    } catch {
      const embed = generateEmbed({
        type: "error",
      });

      message.embed(embed);
    }
  }
};
