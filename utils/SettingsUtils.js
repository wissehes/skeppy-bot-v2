const { MessageEmbed } = require("discord.js");
const { CommandoMessage } = require("discord.js-commando");
const Setting = require("../structures/settings/Setting");

class SettingsUtils {
  /**
   * Generate the settings overview embed
   * @param {CommandoMessage} message
   * @param {Setting[]} settings
   */
  static settingsOverviewEmbed(message, settings) {
    const prefix = message.guild.commandPrefix;
    const embed = new MessageEmbed()
      .setTitle("Skeppy bot settings")
      .setColor("RANDOM")
      .setDescription(
        `These are my settings. Use \`${prefix}settings <setting>\` to get more info about a setting.`
      );

    for (const setting of settings) {
      embed.addField(
        setting.name,
        `\`${prefix}settings ${setting.key}\``,
        true
      );
    }

    return embed;
  }

  /**
   * Generate an embed with details about a setting
   * @param {CommandoMessage} message
   * @param {Setting} setting
   */
  static async settingDetailsEmbed(message, setting) {
    const prefix = message.guild.commandPrefix;
    const currentVal = await setting.readableVal(message.guild);
    const embed = new MessageEmbed()
      .setTitle(setting.name)
      .setDescription(setting.description)
      .addField("⚙️ Current value:", currentVal)
      .addField(
        "✏️ Edit value:",
        `\`${prefix}settings ${setting.key} ${setting.usage}\``
      );

    return embed;
  }
}

module.exports = SettingsUtils;
