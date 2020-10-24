const { GuildMember, MessageEmbed } = require("discord.js");
const { CommandoGuild } = require("discord.js-commando");
const { stripIndents } = require("common-tags");

const variables = [
  ["members", "Member count", (member) => member.guild.memberCount],
  ["server", "Server name", (member) => member.guild.name],
  ["user", "New member mention", (member) => member.user.toString()],
  ["usertag", "New member tag", (member) => member.user.tag],
  ["username", "New member username", (member) => member.user.username],
];

class WelcomeUtils {
  /**
   * Format the welcome message
   * @param {GuildMember} member
   * @param {string} message The message to format
   */
  static formatMessage(member, message) {
    let formattedMessage = message;

    for (const variable of variables) {
      formattedMessage = formattedMessage.replace(
        `{{${variable[0]}}}`,
        variable[2](member)
      );
    }

    return formattedMessage;
  }

  static get variables() {
    return variables;
  }

  /**
   * Generate the overview embed for a guild
   * @param {CommandoGuild} guild
   */
  static async overviewEmbed(guild) {
    const prefix = guild.commandPrefix;

    const status = (await guild.settings.get("welcome", false))
      ? "✅ Enabled"
      : "❌ Disabled";
    const channelID = await guild.settings.get("welcomeChannel", null);
    const channel = guild.channels.resolve(channelID);

    const welcomeMessage = await guild.settings.get(
      "welcomeMessage",
      "Welcome {{user}} to {{server}}!"
    );

    const embed = new MessageEmbed()
      .setTitle(`Welcome settings for ${guild.name}`)
      .setColor("BLUE")
      .setDescription(
        stripIndents`**Status:** ${status}
        **Channel:** ${channel.toString() || `**Not set**`}
        **Message:** ${welcomeMessage}
        `
      )
      .addField(`Setting a channel`, `\`${prefix}welcome channel <#channel>\``)
      .addField(`Setting a message`, `\`${prefix}welcome message\``)
      .addField(`Getting an example`, `\`${prefix}welcome example\``)
      .addField(
        `Enabling or disabling welcome messages`,
        `\`${prefix}welcome <enable/disable>\``
      );

    return embed;
  }
}

module.exports = WelcomeUtils;
