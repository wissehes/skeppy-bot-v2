const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const { ShoukakuTrackList } = require("shoukaku");
const SkeppyCommand = require("../../structures/SkeppyCommand");
const SkeppyTrack = require("../../structures/SkeppyTrack");
const MusicPermUtils = require("../../utils/MusicPermUtils");

module.exports = class SearchCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "search",
      memberName: "search",
      aliases: [],
      group: "music",
      description: "Search videos on YouTube to play",
      guildOnly: true,
      args: [
        {
          key: "query",
          prompt: "What would you like to search?",
          type: "string",
        },
      ],
    });
    this.utils = new MusicPermUtils();
  }

  async run(message, { query }) {
    if (!this.utils.canStartOrPlay(message)) {
      return;
    }

    message.channel.startTyping();

    const node = this.client.player.getNode();

    const results = await node.rest.resolve(query, "youtube");

    if (!results.tracks.length) {
      message.channel.stopTyping();
      message.reply("I couldn't find anything...");
      return;
    }

    const mapped = this.mapResults(results);

    const embed = new MessageEmbed()
      .setTitle(`YouTube search results`)
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setColor("RANDOM").setDescription(stripIndents`${mapped.join("\n\n")}
      
      *Type a number to choose your track, type \`cancel\` to cancel*`);

    const sentMessage = await message.embed(embed);

    const filter = (m) =>
      m.author.id == message.author.id &&
      (m.content.toLowerCase() == "cancel" || !isNaN(m.content));

    const answers = await message.channel.awaitMessages(filter, {
      max: 1,
    });

    const answer = answers.first();

    if (answer.content == "cancel") {
      const cancelEmbed = new MessageEmbed()
        .setColor("RED")
        .setTitle("Cancelled.")
        .setDescription("The track chooser has been cancelled.");

      sentMessage.edit(cancelEmbed);
      return;
    }

    if (Number(answer.content) < 1 || Number(answer.content) > 10) {
      message.say("The number should be between 1 and 10!");
      return;
    }

    const track = new SkeppyTrack(
      this.getTrackByNumber(results, Number(answer.content)),
      message.author,
      message.channel
    );

    const dispatcher = await this.client.queue.handle({
      message,
      node,
      track,
    });

    message.embed(this.client.music.addedToQueueEmbed(track));

    if (dispatcher) {
      dispatcher.play();
    }
  }

  /**
   * Map the found tracks
   * @param {ShoukakuTrackList} results
   */
  mapResults(results) {
    const { tracks } = results;

    const mapped = tracks.map((t, i) => `**${i + 1}**. ${t.info.title}`);

    if (mapped.length > 10) mapped.splice(10, mapped.length);

    return mapped;
  }

  /**
   * Get the track by number
   * @param {ShoukakuTrackList} results
   * @param {number} number
   */
  getTrackByNumber(results, number) {
    const { tracks } = results;

    const track = tracks[number - 1];

    return track;
  }
};
