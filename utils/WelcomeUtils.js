const { GuildMember } = require("discord.js");

const variables = [
  ["members", (member) => member.guild.memberCount],
  ["server", (member) => member.guild.name],
  ["user", (member) => member.user.toString()],
  ["usertag", (member) => member.user.tag],
  ["username", (member) => member.user.username],
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
        `{${variable[0]}}`,
        variable[1](member)
      );
    }

    return formattedMessage;
  }

  static get variables() {
    return variables;
  }
}

module.exports = WelcomeUtils;
