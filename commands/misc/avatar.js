const { MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");

module.exports = class AvatarCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "avatar",
      memberName: "avatar",
      aliases: ["pfp"],
      group: "misc",
      description: "Shows yours or someone else's Discord avatar!",
      args: [
        {
          key: "user",
          type: "user",
          default: (msg) => msg.author,
          prompt: "Who's avatar do you want to see?",
        },
      ],
    });
  }

  async run(message, { user }) {
    const embed = new MessageEmbed()
      .setTitle(`${user.username}'s avatar`)
      .setColor("RANDOM")
      .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      );

    message.embed(embed);
  }
};
