const { MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");
const Moment = require("moment");

module.exports = class EmojiCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "emoji",
      memberName: "emoji",
      aliases: ["emojis"],
      group: "misc",
      description: "Shows a list of all server emojis",
      guildOnly: true,
      args: [
        {
          key: "emoji",
          prompt: "Which emoji's info do you want to see?",
          type: "custom-emoji",
          default: "",
        },
      ],
    });
  }

  async run(message, { emoji }) {
    if (emoji) {
      const fields = [
        ["Emoji:", emoji.toString()],
        ["Name:", emoji.name],
        ["ID:", emoji.id],
        ["Animated?", emoji.animated ? "Yes" : "No"],
        ["URL:", emoji.url],
        [
          "Created:",
          `${this.formatDate(emoji.createdAt)} (${this.getFromnow(
            emoji.createdAt
          )})`,
        ],
      ];

      if (message.guild.me.hasPermission("MANAGE_EMOJIS")) {
        try {
          const author = await emoji.fetchAuthor();
          if (!author) return;

          fields.push(["Created by:", author.tag]);
        } catch (e) {}
      }

      const emojiEmbed = new MessageEmbed()
        .setTitle(`${emoji.name} emoji`)
        .setColor("RANDOM")
        .setImage(emoji.url)
        .setDescription(fields.map((f) => `> **${f[0]}** ${f[1]}`));

      message.embed(emojiEmbed);
    } else {
      const emojis = message.guild.emojis.cache.filter((a) => a.available);

      if (emojis.size) {
        message.say(`${message.guild.name}'s emojis:`);
        message.say(
          emojis
            .sort()
            .map((e) => e.toString())
            .join("  ")
        );
      } else {
        message.say(
          `${message.guild.name} doesn't have any custom emoji's yet!`
        );
      }
    }
  }

  getFromnow(date) {
    const moment = new Moment(date);
    return moment.fromNow();
  }

  formatDate(date) {
    const moment = new Moment(date);
    return moment.format("DD MMM, YYYY | h:mm a");
  }
};
