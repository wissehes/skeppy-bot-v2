const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");

const chickens = [
  {
    filename: "chicken1.jpg",
    image: {
      width: 1200,
      height: 900,
    },
    x: 534,
    y: 20,
    width: 200,
    height: 200,
  },
  {
    filename: "chicken2.jpg",
    image: {
      width: 320,
      height: 237,
    },
    x: 106,
    y: 12,
    width: 46.5,
    height: 46.5,
  },
  {
    filename: "chicken3.jpg",
    image: {
      width: 720,
      height: 816,
    },
    x: 468.1,
    y: 51.3,
    width: 163.3,
    height: 163.3,
  },
  {
    filename: "chicken4.jpg",
    image: {
      width: 1400,
      height: 788,
    },
    x: 550.5,
    y: 84.7,
    width: 294.8,
    height: 294.8,
  },
];

module.exports = class ChickenCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "chicken",
      memberName: "chicken",
      aliases: [],
      group: "image",
      description: "Puts your (or someone else's) head on a chicken!",
      throttling: {
        duration: 5,
        usages: 1,
      },
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
    const chicken = this.getChicken();

    const canvas = Canvas.createCanvas(
      chicken.image.width,
      chicken.image.height
    );
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage(
      `./assets/chickens/${chicken.filename}`
    );

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    const avatar = await Canvas.loadImage(
      user.displayAvatarURL({ format: "jpg" })
    );

    ctx.drawImage(avatar, chicken.x, chicken.y, chicken.width, chicken.height);

    const attachment = new MessageAttachment(canvas.toBuffer(), "chicken.jpg");
    message.channel.send(attachment);
  }

  getChicken() {
    const chicken = chickens[Math.floor(Math.random() * chickens.length)];

    return chicken;
  }
};
