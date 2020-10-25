const path = require("path");
const SkeppyCommandoClient = require("./structures/SkeppyCommandoClient");
const config = require("./config");
const WelcomeUtils = require("./utils/WelcomeUtils");

const client = new SkeppyCommandoClient({
  commandPrefix: config.prefix,
  owner: "354289971361742848",
  invite: "https://discord.gg/dTJBDRU",
  config,
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["levels", "Levels"],
    ["misc", "Misc"],
    ["fun", "Fun"],
    ["image", "Image"],
    ["admin", "Admin"],
    ["util", "Utility"],
    ["braincells", "Braincells"],
    ["music", "Music"],
    ["games", "Games"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    unknownCommand: false,
  })
  .registerCommandsIn(path.join(__dirname + "/commands"));

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
  client.updatePresence();
  // Update every hour
  setInterval(() => client.updatePresence(), 3600000);
});

client.on("message", async (message) => {
  if (message.author.bot || message.channel.type !== "text") return;

  if (await message.guild.settings.get("levels", false)) {
    const {
      leveledUp,
      points: { level },
    } = await client.points.givePoints(message.guild, message.member, 1);

    if (leveledUp) {
      message.say(
        `Congratulations ${message.author.toString()}, you've leveled up to level ${level}!`
      );
    }

    client.rewards.checkAndReward(message);
  }
});

client.on("guildMemberAdd", async (member) => {
  const isEnabled = await member.guild.settings.get("welcome", false);
  const _channel = await member.guild.settings.get("welcomeChannel", null);
  if (isEnabled && _channel) {
    const channel = member.guild.channels.resolve(_channel);
    if (!channel) return;

    const message = await member.guild.settings.get(
      "welcomeMessage",
      "Welcome {{user}} to {{server}}!"
    );
    const formattedMessage = WelcomeUtils.formatMessage(member, message);

    channel.send(formattedMessage).catch((e) => null);
  }
});

client.on("guildCreate", () => client.updatePresence());
client.on("guildDelete", () => client.updatePresence());

client.on("error", console.error);

client.login(config.token);
