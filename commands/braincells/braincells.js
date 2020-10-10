const { MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");

module.exports = class BraincellsCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "braincells",
      memberName: "braincells",
      aliases: [],
      group: "braincells",
      description: "Shows how many braincells you've got left 🧠",
      args: [
        {
          key: "user",
          prompt: "Who's braincells do you want to see?",
          type: "user",
          default: (m) => m.author,
        },
      ],
    });
  }

  async run(message, { user }) {
    const { braincells } = await this.client.braincells.get(user);

    const embed = new MessageEmbed()
      .setTitle(`${message.author.username}'s braincells`)
      .setDescription(`**Braincells**: ${braincells}`)
      .setColor("BLUE");

    if (braincells < 30) {
      embed.setFooter(
        "Tip: You can gain new braincells with the gain command!"
      );
      message.embed(embed);
    }
  }
};
