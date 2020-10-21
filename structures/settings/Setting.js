const { TextChannel } = require("discord.js");
const { CommandoGuild, CommandGroup } = require("discord.js-commando");

class Setting {
  /**
   *
   * @param {object} opts Options
   * @param {string} opts.name The readable name
   * @param {string} opts.key Name in database
   * @param {string} opts.description Setting description
   * @param {('boolean'|'group'|'string'|'channel')} opts.type Setting type
   */
  constructor(opts) {
    this.name = opts.name;
    this.key = opts.key;
    this.description = opts.description;
    this.type = opts.type;
  }

  /**
   *
   * @param {CommandoGuild} guild
   * @param {string|TextChannel} value
   */
  async save(guild, value) {
    const parsed = this.parse(value);

    if (this.type == "group") {
      guild.setGroupEnabled(this.key, parsed);
    } else {
      await guild.settings.set(this.key, parsed);
    }

    return await guild.settings.get(this.key);
  }

  get usage() {
    switch (this.type) {
      case "boolean":
      case "group":
        return `<on/off>`;
        break;

      case "string":
        return `<your message>`;
        break;

      case "channel":
        return `<#channel>`;
        break;
    }
  }

  /**
   * Get the readable value of a setting
   * @param {CommandoGuild} guild
   */
  async readableVal(guild) {
    let v;

    if (this.type !== "group") v = await guild.settings.get(this.key);

    switch (this.type) {
      case "boolean":
        return v ? "`Enabled`" : "`Disabled`";
        break;

      case "group":
        return guild.isGroupEnabled(this.key) ? "`Enabled`" : "`Disabled`";
        break;

      case "string":
        return v || "`Not set`";
        break;

      case "channel":
        if (v) {
          const channel = guild.channels.cache.get(v);
          return channel.toString() || "`Channel not found.`";
        } else {
          return "**Not set**";
        }
        break;
    }
  }

  /**
   * Validate the new value
   * @param {CommandoGuild} guild
   * @param {string|TextChannel} value
   */
  validate(guild, value) {
    switch (this.type) {
      case "boolean":
      case "group":
        if (value.toLowerCase() == "on" || value.toLowerCase() == "off") {
          return true;
        } else return false;
        break;

      case "string":
        return true;
        break;

      case "channel":
        return guild.channels.cache.has(value.id || value);
        break;
    }
  }

  /**
   * Parse user data
   * @param {string|TextChannel} value
   */
  parse(value) {
    switch (this.type) {
      case "boolean":
      case "group":
        if (value == "on") {
          return true;
        } else if (value == "off") {
          return false;
        }
        break;

      case "string":
        return value;
        break;

      case "channel":
        return value.id;
        break;
    }
  }
}

module.exports = Setting;
