const Canvas = require("canvas");
const { MessageAttachment, MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");

module.exports = class BaldCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "bald",
      memberName: "bald",
      aliases: [],
      group: "image",
      description: "Puts your avatar on a bald head!",
      args: [
        {
          key: "user",
          prompt: "Who's avatar do you want to put on a chicken?",
          type: "user",
          default: (m) => m.author,
        },
      ],
    });
  }

  async run(message, { user }) {
    const canvas = Canvas.createCanvas(176, 176);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage("./assets/bald.jpg");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const avatar = await Canvas.loadImage(
      user.displayAvatarURL({ format: "jpg" })
    );
    ctx.drawImage(avatar, 54.1, 72, 87, 87);

    const attachment = new MessageAttachment(canvas.toBuffer(), "bald.jpg");

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .attachFiles(attachment)
      .setImage(`attachment://bald.jpg`);

    message.embed(embed);
  }
};
