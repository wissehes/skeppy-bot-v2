const SkeppyCommand = require("../../structures/SkeppyCommand");

module.exports = class PointsCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "points",
      memberName: "points",
      aliases: ["xp", "rank", "level"],
      group: "levels",
      description: "Shows your points!",
      guildOnly: true,
      args: [
        {
          key: "member",
          prompt: "Who's points do you want to see?",
          type: "member",
          default: (m) => m.member,
        },
      ],
    });
  }

  async run(message, { member }) {
    message.channel.startTyping();

    try {
      const card = await this.client.points.generateCard(message.guild, member);

      message.channel.send(card);
      message.channel.stopTyping();
    } catch (e) {
      message.channel.stopTyping();
      throw e;
    }
  }
};
