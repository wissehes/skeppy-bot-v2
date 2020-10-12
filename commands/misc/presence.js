const SkeppyCommand = require("../../structures/SkeppyCommand");

module.exports = class PresenceCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "presence",
      memberName: "presence",
      aliases: [],
      group: "misc",
      description: "Change my presence!",
      ownerOnly: true,
      args: [
        {
          key: "text",
          prompt:
            "What do you want to change my presence to? (`reset` to reset to default)",
          type: "string",
        },
      ],
    });
  }

  async run(message, { text }) {
    if (text.toLowerCase() == "reset") {
      this.client.setPresence(this.client.defaultPresence);
      message.reply(`Reset prefix to \`${this.client.defaultPresence}\``);
    } else {
      this.client.setPresence(text);
      message.reply(`Set presence to \`${text}\``);
    }
  }
};
