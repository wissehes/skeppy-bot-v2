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
      args: [
        {
          key: "page",
          prompt: "Which page do you want to view?",
          type: "integer",
          default: 1,
          min: 1,
        },
      ],
    });
  }

  async run(message, { page }) {
    if (!this.client.queue.has(message.guild.id)) {
      return message.reply("there's nothing playing right now!");
    }

    const dispatcher = this.client.queue.get(message.guild.id);

    const embed = new MessageEmbed()
      .setTitle(`Queue for ${message.guild.name}`)
      .setColor("BLUE")
      .setFooter(`Page ${page} | ${dispatcher.queue.length} tracks`);

    const mappedQueue = this.displayQueue(dispatcher, page);
    if (page > 1 && !mappedQueue.length) {
      return message.reply("that page doesn't exist!");
    }

    if (mappedQueue.length > 10) {
      mappedQueue.splice(10, mappedQueue.length);
    }

    if (page == 1) {
      embed.setDescription(stripIndents`🔊 Now Playing:
        ${this.displayCurrent(dispatcher)}

        🔊 Playing next:
        ${mappedQueue.length ? mappedQueue.join("\n") : "*Nothing...*"}
        `);
    } else {
      embed.setDescription(mappedQueue.join("\n"));
    }

    message.embed(embed);
  }

  displayCurrent(dispatcher) {
    const { current, player } = dispatcher;

    const totalTimeFormatted = this.client.music.formatMS(current.info.length);
    const currentPosFormatted = this.client.music.formatMS(player.position);
    return `[${current.info.title}](${current.info.uri}) [${currentPosFormatted}/${totalTimeFormatted}]`;
  }

  displayQueue(dispatcher, page) {
    const queue = dispatcher.getQueue();

    const mapped = queue.map(
      (t, i) =>
        `**${i + 1}**. [${t.info.title}](${
          t.info.uri
        }) [${this.client.music.formatMS(t.info.length)}]`
    );

    if (page > 1) {
      return mapped.splice((page - 1) * 10, page * 10);
    } else {
      return mapped;
    }
  }
};
