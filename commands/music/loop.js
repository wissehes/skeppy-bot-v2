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
          oneOf: ["track", "queue", "off", "toggle"],
          default: "toggle",
        },
      ],
    });
    this.utils = new MusicPermUtils();
  }

  async run(message, { option }) {
    if (!this.utils.canLoop(message)) return;

    const dispatcher = this.client.queue.get(message.guild.id);

    if (option == "track") {
      dispatcher.loop = 1;
      message.say("done");
    } else if (option == "queue") {
      dispatcher.loop = 2;
      message.say("done");
    }
  }
};
