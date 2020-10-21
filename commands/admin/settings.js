const Setting = require("../../structures/settings/Setting");
const SkeppyCommand = require("../../structures/SkeppyCommand");
const SettingsUtils = require("../../utils/SettingsUtils");

const settings = [
  new Setting({
    name: "🏆 Levels",
    key: "levels",
    type: "group",
    description: "Turn levels on or off",
  }),
  new Setting({
    name: "👥 Welcome messages",
    description: "Enable or disable welcome messages",
    key: "welcome",
    type: "boolean",
  }),
  new Setting({
    name: "💬 Welcome message",
    description: "Set the welcome message",
    key: "welcomeMessage",
    type: "string",
  }),
  new Setting({
    name: "📲 Welcome channel",
    description: "Set the welcome channel",
    key: "welcomeChannel",
    type: "channel",
  }),
  new Setting({
    name: "🔊 Now Playing messages",
    description: "Enable or disable now playing messages",
    key: "nowplaying",
    type: "boolean",
  }),
];

module.exports = class SettingsCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "settings",
      memberName: "settings",
      aliases: ["config"],
      group: "admin",
      description: "Change my settings!",
      guildOnly: true,
      userPermissions: ["MANAGE_GUILD"],
      args: [
        {
          key: "setting",
          prompt: "Which setting would you like to view/change?",
          type: "string",
          oneOf: settings.map((a) => a.key.toLowerCase()),
          parse: (v) =>
            settings.find((s) => s.key.toLowerCase() == v.toLowerCase()),
          default: "",
        },
        {
          key: "value",
          prompt: "What do you want to set the value to?",
          type: "string",
          default: "",
        },
      ],
    });
  }

  async run(message, { setting, value }) {
    // If there's not setting provided (and thus no value),
    // generate and send the settings overview embed
    if (!setting) {
      const embed = SettingsUtils.settingsOverviewEmbed(message, settings);
      message.embed(embed);
      return;
    }

    // If there's a setting provided, but not a value,
    // generate and send the details embed
    if (setting && !value) {
      const embed = await SettingsUtils.settingDetailsEmbed(message, setting);
      message.embed(embed);
    }

    // If there's a setting and a value provided, validate the new
    // value andset the setting's value to the new value
    // and send the embed
    if (setting && value) {
      const valueToSend =
        setting.type == "channel" ? message.mentions.channels.first() : value;

      if (setting.validate(message.guild, valueToSend)) {
        await setting.save(message.guild, valueToSend);
      }

      const embed = await SettingsUtils.settingDetailsEmbed(message, setting);
      message.embed(embed);
    }
  }
};
