const SkeppyCommand = require("../../structures/SkeppyCommand");
const fs = require("fs");

module.exports = class AddoldsettingsCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "addoldsettings",
      memberName: "addoldsettings",
      aliases: [],
      group: "misc",
      description: "Add my old settings here",
      hidden: true,
      ownerOnly: true,
    });
  }

  async run(message) {
    const msg = await message.say("Adding the old settings...");

    const oldSettings = require("../../db/scripts/oldsettings.json");
    const allOldSettings = oldSettings
      .filter((s) => s.key && s.value)
      .map((s) => {
        s.key = s.key.replace("keyv:", "");
        return s;
      });

    const allGuilds = this.client.guilds.cache.array();

    for (const guild of allGuilds) {
      const oldSetting = allOldSettings.find((s) => s.key == guild.id);

      if (oldSetting) {
        const { value: v } = JSON.parse(oldSetting.value);

        console.log(v);
        const newSettings = {
          levels: v.levels,
          welcome: v.welcome,
          welcomeMessage: v.welcomeMessage,
          welcomeChannel: v.welcomeChannel,
          nowplaying: v.np,
          prefix: v.prefix,
        };

        for (const setting in newSettings) {
          await guild.settings.set(setting, newSettings[setting]);
        }
      }
    }

    msg.edit("Done!");
  }
};
