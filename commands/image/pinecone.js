const Canvas = require("canvas");
const { MessageAttachment, MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");

module.exports = class PineconeCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "pinecone",
      memberName: "pinecone",
      aliases: [],
      group: "image",
      description: "Puts your avatar on a pinecone!",
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
    const canvas = Canvas.createCanvas(474, 474);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage("./assets/pinecone.jpg");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const avatar = await Canvas.loadImage(
      user.displayAvatarURL({ format: "jpg" })
    );
    ctx.drawImage(avatar, 167.1, 142.6, 130, 130);

    const attachment = new MessageAttachment(canvas.toBuffer(), "pinecone.jpg");

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .attachFiles(attachment)
      .setImage(`attachment://pinecone.jpg`);

    message.embed(embed);
  }
};
