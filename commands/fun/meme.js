const { MessageEmbed } = require("discord.js");
const SkeppyCommand = require("../../structures/SkeppyCommand");

class MemeCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "meme",
      memberName: "meme",
      aliases: [],
      group: "fun",
      description: "Sends a meme from reddit!",
      throttling: {
        duration: 3,
        usages: 1,
      },
      credits: [
        {
          name: "KSoft.Si",
          for: "Memes API",
          url: "https://api.ksoft.si/",
        },
      ],
    });
  }

  async run(message) {
    let meme;

    try {
      meme = await this.client.ksoft.images.meme();
    } catch (e) {
      console.error(e);
    }

    if (!meme) {
      return message.reply("⚠️ | I couldn't get a meme!");
    }

    const { url: imageURL, post } = meme;

    const { title, subreddit, upvotes, comments, author, link: postURL } = post;

    const embed = new MessageEmbed()
      .setTitle(title)
      .setColor("RANDOM")
      .setAuthor(
        author,
        "https://media.discordapp.net/attachments/398235373282787348/644566893021364275/iu.png"
      )
      .setImage(imageURL)
      .setURL(postURL)
      .setFooter(`⬆️ ${upvotes}  💬 ${comments} | ${subreddit}`);

    message.embed(embed);
  }
}

module.exports = MemeCommand;
