const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const { CommandoMessage } = require("discord.js-commando");
const SkeppyCommand = require("../../structures/SkeppyCommand");

module.exports = class AnnounceCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "announce",
      memberName: "announce",
      aliases: [],
      group: "misc",
      description: "Announces a message to all the servers!",
      ownerOnly: true,
      args: [
        {
          key: "msg",
          prompt: "What do you want to announce?",
          type: "string",
        },
      ],
    });
  }

  async run(message, { msg }) {
    if (msg == "update") {
      const embed = new MessageEmbed()
        .setTitle("🥳 I was updated!")
        .setAuthor("Skeppy bot", this.client.user.avatarURL())
        .setColor("GREEN")
        .setDescription(
          stripIndents`I was just updated to version 2!
            **What does this mean?**
            
            I can now do more things, (and better) such as playing music (again) and you can now  play games with me!
            
            For the server admins:
            If you had autorole (now called rewards) set up, you need to set that up again. You can do so with the \`createreward\` command.
            `
        )
        .setFooter("Use my help command to see all of my commands!");

      this.announce(message, embed);
    }
  }

  /**
   *
   * @param {CommandoMessage} message
   * @param {*} toSend
   */
  async announce(message, toSend) {
    const client = message.client;
    const guilds = client.guilds.cache.array();
    const sent = {
      success: 0,
      failed: 0,
      total: guilds.length,
      done: 0,
      currentGuild: guilds[0],
    };

    this.announceEmbed = await message.embed(
      await this.updateAnnounceEmbed(sent)
    );

    for (const guild of guilds) {
      sent.currentGuild = guild;
      await this.updateAnnounceEmbed(sent);

      const channels = guild.channels.cache.filter((c) => c.type == "text");
      try {
        if (channels.size) {
          const channel =
            guild.systemChannel ||
            channels.cache.find((c) => c.name.includes("general")) ||
            channels.cache.random();

          channel
            .send(toSend)
            .then(() => sent.success++)
            .catch(() => sent.failed++)
            .finally(async () => {
              sent.done++;
              await this.updateAnnounceEmbed(sent);
            });

          await this.wait(5000);
        }
      } catch (e) {
        continue;
      }
    }

    message.say("Done announcing!");
  }

  async updateAnnounceEmbed(stats) {
    const guilds = this.client.guilds.cache.array();
    const currentGuildIndex =
      guilds.map((a) => a.id).indexOf(stats.currentGuild.id) + 1;

    const embed = new MessageEmbed()
      .setTitle("Announcing...")
      .setDescription(`Announcing message to all guilds...`)
      .setColor("GREEN")
      .addField(
        "Current guild",
        `${stats.currentGuild.name} (${currentGuildIndex} / ${stats.total})`
      )
      .addField("Total guilds", stats.total, true)
      .addField("Successful", stats.success, true)
      .addField("Failed", stats.failed, true);

    if (this.announceEmbed) this.announceEmbed.edit(embed);
    else return embed;
  }

  wait(ms) {
    return new Promise((res) => setTimeout(() => res(), ms));
  }
};
