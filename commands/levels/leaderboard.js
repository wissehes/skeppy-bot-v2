const { MessageEmbed, Message } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");

const { getRankEmoji } = require("../../utils/PointsUtils");

module.exports = class LeaderboardCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "leaderboard",
      memberName: "leaderboard",
      aliases: [],
      group: "levels",
      description: "Shows the members with the most points",
      guildOnly: true,
    });
  }

  async run(message) {
    const allPoints = await this.client.points.getAll(message.guild);

    // Filter our users that are not in the server anymore and
    // sort the array.
    const points = allPoints
      .filter((p) => message.guild.members.cache.has(p.userID))
      .sort((a, b) => b.points - a.points);

    if (points.length > 10) {
      points.splice(10, points.length - 1);
    }

    const winningMember = message.guild.members.resolve(points[0].userID);

    const embed = new MessageEmbed()
      .setTitle(`${message.guild.name}'s leaderboard`)
      .setColor("BLUE")
      .setFooter(`Congratulations ${winningMember.user.username}!!!`);

    points.forEach((p, i) => {
      let member = message.guild.members.cache.get(p.userID);
      if (!member.user) {
        member = message.guild.members.resolve(p.userID);
      }
      const rankEmoji = getRankEmoji(i + 1);

      embed.addField(
        `${rankEmoji} ${i + 1}. ${member.user.username}`,
        `Level ${p.level} - ${p.points} points`
      );
    });

    message.embed(embed);
  }
};
