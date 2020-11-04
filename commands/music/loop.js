const { MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");
const MusicPermUtils = require("../../utils/MusicPermUtils");

module.exports = class LoopCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "loop",
      memberName: "loop",
      aliases: [],
      group: "music",
      description: "Loops the queue!",
      guildOnly: true,
      args: [
        {
          key: "option",
          prompt: "How would you like to loop?",
          type: "string",
          default: "toggle",
        },
      ],
    });
    this.utils = new MusicPermUtils();
  }

  async run(message, { option }) {
    if (!this.utils.canLoop(message)) return;

    const dispatcher = this.client.queue.get(message.guild.id);

    if (option == "toggle") {
      if (!dispatcher.loop) {
        dispatcher.loop = 1;
      } else if (dispatcher.loop == 1) {
        dispatcher.loop = 2;
      } else {
        dispatcher.loop = 0;
      }
    } else if (option == "track" || option == "single" || option == "1") {
      dispatcher.loop = 1;
    } else if (option == "queue" || option == "all" || option == "2") {
      dispatcher.loop = 2;
    } else if (option == "off" || option == "0") {
      dispatcher.loop = 0;
    }

    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setDescription(this.readableOption(dispatcher.loop));

    message.embed(embed);
  }

  readableOption(loop) {
    const values = [
      "Looping is disabled",
      "Looping a single track",
      "Looping the whole queue",
    ];
    return values[loop];
  }
};
