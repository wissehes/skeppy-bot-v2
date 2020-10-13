const SkeppyCommand = require("../../structures/SkeppyCommand");

const { CaptchaGenerator } = require("captcha-canvas");
const { MessageAttachment, MessageEmbed, Message } = require("discord.js");
const { randomNumber } = require("../../utils/GeneralUtils");

module.exports = class CaptchaCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "captcha",
      memberName: "captcha",
      aliases: [],
      group: "games",
      description: "Solve a captcha and earn braincells!",
      throttling: {
        duration: 60,
        usages: 3,
      },
    });
  }

  /**
   * @param {Message} message
   */

  async run(message) {
    const captcha = new CaptchaGenerator({
      width: 300,
      height: 100,
    });

    const attachment = new MessageAttachment(
      await captcha.generate(),
      "captcha.png"
    );

    const embed = new MessageEmbed()
      .setTitle("Captcha")
      .setDescription("What does this captcha say?")
      .setColor("RANDOM")
      .setFooter("You have 15 seconds!")
      .setImage("attachment://captcha.png")
      .attachFiles(attachment);

    await message.embed(embed);

    const filter = (m) => m.author.id == message.author.id;

    const messages = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 15000,
    });

    if (!messages.size) {
      message.say(`Times up... It was ${captcha.text}`);
    }

    if (messages.first().content == captcha.text) {
      const amount = randomNumber(2, 50);
      this.client.braincells.add(message.author, amount);

      message.reply(`Congratulations! You earned **${amount} braincells!**`);
    } else {
      message.reply(`Sorry, it was ${captcha.text}...`);
    }
  }
};
