const SkeppyCommand = require("../../structures/SkeppyCommand");
const fs = require("fs");
const { randomValue } = require("../../utils/GeneralUtils");
const { MessageAttachment, MessageEmbed } = require("discord.js");

module.exports = class A6dCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "a6d",
      memberName: "a6d",
      aliases: [],
      group: "fun",
      description: "Sends a random picture of a6d!",
      throttling: {
        duration: 5,
        usages: 1,
      },
    });
  }

  async run(message) {
    const pics = fs
      .readdirSync("./assets/a6d")
      .filter((f) => f.endsWith(".jpg"));

    const picture = randomValue(pics);

    const attachment = new MessageAttachment(
      `./assets/a6d/${picture}`,
      picture
    );

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .attachFiles(attachment)
      .setImage(`attachment://${picture}`);

    message.embed(embed);
  }
};
