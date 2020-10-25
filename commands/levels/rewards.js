const SkeppyCommand = require("../../structures/SkeppyCommand");
const RewardUtils = require("../../utils/RewardUtils");

module.exports = class RewardsCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "rewards",
      memberName: "rewards",
      aliases: ["reward", "autorole"],
      group: "levels",
      description: "See all your rewards!",
      guildOnly: true,
      clientPermissions: ["MANAGE_ROLES"],
    });
  }

  async run(message) {
    const rewards = await this.client.rewards.all(message.guild);

    const embed = RewardUtils.createOverviewEmbed(message.guild, rewards);

    message.embed(embed);
  }
};
