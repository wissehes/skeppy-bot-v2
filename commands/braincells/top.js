const { MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");

module.exports = class TopCommand extends (
  SkeppyCommand
) {
  constructor(client) {
    super(client, {
      name: "top",
      memberName: "top",
      aliases: ["smart", "smort", "smartest"],
      group: "braincells",
      description: "Shows the users with the most braincells 🧠",
    });
  }

  async run(message) {
    const leaderboard = (await this.client.braincells.leaderboard(10)).map(
      (u, i) => {
        const user = this.client.users.cache.get(u.userId);
        const em = this.rankEmoji(i + 1);
        return `${em} **${u.braincells}** - ${user.tag || `*unknown user*`}`;
      }
    );

    const embed = new MessageEmbed()
      .setTitle("🧠 Smartest users")
      .setColor("BLUE")
      .setDescription(leaderboard.join("\n"));

    message.embed(embed);
  }

  rankEmoji(rank) {
    const emojis = {
      1: "🥇",
      2: "🥈",
      3: "🥉",
      else: "🎖️",
    };

    return emojis[rank] || emojis.else;
  }
};
