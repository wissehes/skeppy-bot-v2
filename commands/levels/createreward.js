const SkeppyCommand = require("../../structures/SkeppyCommand");

const { embed: createEmbed } = require("../../utils/RewardUtils");

module.exports = class CreaterewardCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "createreward",
      memberName: "createreward",
      aliases: ["addreward"],
      group: "levels",
      description: "Create a reward!",
      guildOnly: true,
      userPermissions: ["MANAGE_ROLES"],
      clientPermissions: ["MANAGE_ROLES"],
      args: [
        {
          key: "role",
          prompt: "Which role should I give?",
          type: "role",
        },
        {
          key: "level",
          prompt: "At which level should I give this reward?",
          type: "integer",
          min: 0,
        },
      ],
    });
  }

  async run(message, { role, level }) {
    if (await this.client.rewards.exists(role, level)) {
      message.reply("This reward already exists!");
      return;
    }

    this.client.rewards
      .create(role, level)
      .then(() => {
        const embed = createEmbed({
          type: "created",
          role,
          level,
        });

        message.embed(embed);
      })
      .catch(() => {
        const embed = createEmbed({
          type: "error",
        });

        message.embed(embed);
      });
  }
};
