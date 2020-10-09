const { MessageEmbed, Message } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");
const LyricsUtils = require("../../utils/LyricsUtils");

module.exports = class LyricsCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "lyrics",
      memberName: "lyrics",
      aliases: ["lyric", "songtext"],
      group: "music",
      description: "Shows the lyrics of a song!",
      examples: ["lyrics bts - dynamite"],
      throttling: {
        duration: 5,
        usages: 1,
      },
      credit: [
        {
          name: "KSoft.Si",
          for: "Lyrics API",
          url: "https://api.ksoft.si/",
        },
      ],
      args: [
        {
          key: "query",
          prompt: "Which song's lyrics would you like to get?",
          type: "string",
        },
      ],
    });
  }

  async run(message, { query }) {
    let songs;
    try {
      songs = await this.client.ksoft.lyrics.search(query);
    } catch (e) {
      void e;
    }

    if (!songs || !songs.length) {
      return message.reply("I couldn't find any songs...");
    }

    const song = songs[0];

    const lyricUtils = new LyricsUtils(song, message);

    const embeds = lyricUtils.generateEmbeds(song, message.author.tag);

    for (let i = 0; i < embeds.length; i++) {
      await message.embed(embeds[i]);
    }
  }
};
