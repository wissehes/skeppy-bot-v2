const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");

module.exports = class KillemCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "killme",
      memberName: "killme",
      aliases: ["furry"],
      group: "image",
      description: "Puts your (or someone else's) avatar on a furry 💀",
      args: [
        {
          key: "user",
          prompt: "Who's avatar do you want to use?",
          type: "user",
          default: (m) => m.author,
        },
      ],
    });
  }

  async run(message, { user }) {
    const canvas = Canvas.createCanvas(640, 871);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage("./assets/furry.jpg");

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const avatar = await Canvas.loadImage(
      user.displayAvatarURL({ format: "jpg" })
    );

    ctx.drawImage(avatar, 256.5, 145.1, 145, 145);

    const attachment = new MessageAttachment(canvas.toBuffer(), "furry.jpg");

    message.channel.send(attachment);
  }
};
