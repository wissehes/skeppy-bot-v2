const { MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");
const { stripIndents } = require("common-tags");

module.exports = class QueueCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "queue",
      memberName: "queue",
      aliases: ["q"],
      group: "music",
      description: "Displays the current playing queue",
      guildOnly: true,
    });
  }

  async run(message) {
    if (this.client.queue.has(message.guild.id)) {
      const dispatcher = this.client.queue.get(message.guild.id);

      const embed = new MessageEmbed()
        .setTitle(`Queue for ${message.guild.name}`)
        .setColor("BLUE").setDescription(stripIndents`🔊 Now playing: 
        ${this.displayCurrent(dispatcher)}

        🔊 Playing next:
        ${this.displayQueue(dispatcher)}
        `);

      message.embed(embed);
    }
  }

  displayCurrent(dispatcher) {
    const { current, player } = dispatcher;

    const totalTimeFormatted = this.client.music.formatMS(current.info.length);
    const currentPosFormatted = this.client.music.formatMS(player.position);
    return `[${current.info.title}](${current.info.uri}) [${currentPosFormatted}/${totalTimeFormatted}]`;
  }

  displayQueue(dispatcher) {
    const queue = dispatcher.getQueue();

    const mapped = queue.map(
      (t, i) =>
        `**${i + 1}**. [${t.info.title}](${
          t.info.uri
        }) [${this.client.music.formatMS(t.info.length)}]`
    );

    if (mapped.length > 10) {
      mapped.splice(10, mapped.length - 1);

      const remainingLength = queue.length - 10;

      return `${mapped.join("\n")}
      
        *and ${remainingLength}* more...`;
    } else {
      return mapped.join("\n");
    }
  }
};
