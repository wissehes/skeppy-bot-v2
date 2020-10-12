const path = require("path");
const SkeppyCommandoClient = require("./structures/SkeppyCommandoClient");

const config = require("./config");

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

client.on("message", (message) => {
  if (message.author.bot || message.channel.type !== "text") return;

  client.points.givePoints(message.guild, message.member, 1);

  const musicCommandsArr = [
    "earrape",
    "lock",
    "loop",
    "move",
    "np",
    "pause",
    "play",
    "queue",
    "resume",
    "seek",
    "shuffle",
    "skip",
    "stop",
    "volume",
  ];

  if (
    musicCommandsArr.some((a) => message.content.includes(a)) &&
    message.content.startsWith(client.commandPrefix)
  ) {
    message.reply(
      "music commands are still a work in progress! (if they're gonna be added)"
    );
  }
});

client.on("error", console.error);

client.login(config.token);
