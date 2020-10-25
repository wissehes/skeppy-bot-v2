const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");
const WelcomeUtils = require("../../utils/WelcomeUtils");

module.exports = class WelcomeCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "welcome",
      memberName: "welcome",
      aliases: [],
      examples: ["welcome enable", "welcome message Welcome {{user}}!"],
      group: "admin",
      description: "Set up welcome messages!",
      userPermissions: ["MANAGE_GUILD"],
      guildOnly: true,
      guarded: true,
      args: [
        {
          key: "action",
          prompt: "What do you want to do?",
          type: "string",
          oneOf: ["view", "enable", "disable", "channel", "example", "message"],
          default: "view",
        },
        {
          key: "value",
          prompt: "What do you want to set as value",
          type: "string",
          default: "",
        },
      ],
    });
  }

  async run(message, { action, value }) {
    if (action == "view") {
      this.sendOverview(message);
    }

    if (action == "message") {
      const embed = new MessageEmbed()
        .setTitle("Set new welcome message")
        .setColor("BLUE")
        .setDescription(
          `You can use these variables when setting up your new welcome message!`
        )
        .setFooter(
          `You have 1 minute to type your new message in chat. Type \`cancel\` to cancel`
        );

      WelcomeUtils.variables.forEach((a) => {
        embed.addField(`{{${a[0]}}}`, `${a[1]}: ${a[2](message.member)}`);
      });

      await message.embed(embed);

      const filter = (m) => m.author.id == message.author.id;

      const collected = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 60000,
      });

      if (!collected.size) {
        message.say("Timed out!");
        return;
      }

      const newMessage = collected.first().content;

      if (newMessage.toLowerCase() == "cancel") {
        message.reply("cancelled!");
        return;
      }

      message.guild.settings.set("welcomeMessage", newMessage);

      this.sendOverview(message);
    }

    if (action == "channel") {
      if (message.mentions.channels.first()) {
        const channel = message.mentions.channels.first();

        await message.guild.settings.set("welcomeChannel", channel.id);
      } else {
        await message.reply(
          "What do you want to set as welcome message channel?"
        );

        const filter = (m) =>
          m.author.id == message.author.id && m.mentions.channels.first();

        const collected = await message.channel.awaitMessages(filter, {
          time: 30000,
          max: 1,
        });

        if (!collected.size) {
          return message.say("Timed out!");
        }

        const channel = collected.first().mentions.channels.first();

        await message.guild.settings.set("welcomeChannel", channel.id);
      }
      this.sendOverview(message);
    }

    if (action == "enable" || action == "disable") {
      const newValue = action == "enable";
      await message.guild.settings.set("welcome", newValue);

      this.sendOverview(message);
    }

    if (action == "example") {
      const welcomeMsg = await message.guild.settings.get(
        "welcomeMessage",
        "Welcome {{user}} to {{server}}!"
      );

      const formattedMessage = WelcomeUtils.formatMessage(
        message.member,
        welcomeMsg
      );

      message.say(stripIndents`Here's what the welcome message will look like:
        ${formattedMessage}
        `);
    }
  }

  async sendOverview(message) {
    const embed = await WelcomeUtils.overviewEmbed(message.guild);
    message.embed(embed);
  }
};
