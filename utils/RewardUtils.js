const { MessageEmbed, Guild, Role } = require("discord.js");

class RewardUtils {
  /**
   *
   * @param {object} options
   * @param {('created'|'removed'|'error')} options.type
   * @param {Role} options.role
   * @param {number} options.level
   */
  static embed(options) {
    const { type, role, level } = options;

    const titles = {
      created: "🎉 New reward created!",
      removed: "🗑️ Reward removed!",
      error: "⚠️ An error occurred!",
    };

    const descriptions = {
      created: "You just created a new reward with these settings:",
      removed: "You just removed the following reward!",
      error:
        "An error occurred while trying to save your new reward. Please try again later!",
    };

    const title = titles[type];
    const description = descriptions[type];
    const color = type == "error" ? "RED" : "GREEN";

    const embed = new MessageEmbed()
      .setTitle(title)
      .setColor(color)
      .setDescription(description);

    if (type != "error") {
      embed.addField("Required level", `Level ${level}`);
      embed.addField("Role reward", role);
    }

    return embed;
  }

  /**
   * Create an embed for all the rewards
   * @param {Guild} guild the guild
   * @param {array} rewards all rewards
   */
  static createOverviewEmbed(guild, rewards) {
    const embed = new MessageEmbed()
      .setTitle(`All rewards for ${guild.name}`)
      .setColor("RANDOM");
    if (rewards.length) {
      const mapped = rewards.map((r, i) => {
        const role = guild.roles.cache.get(r.roleID);
        const mention = role ? role.toString() : "*not found*";

        return `\`#${i + 1}\`: **Level:** ${r.level}, **Role:** ${mention}`;
      });
      embed
        .setDescription(mapped.join("\n"))
        .setFooter(`Create a reward with the createreward command`);
    } else {
      embed.setDescription(
        `\nNo roles yet! Create one with \`${guild.commandPrefix}createreward\``
      );
    }

    return embed;
  }
}

module.exports = RewardUtils;
