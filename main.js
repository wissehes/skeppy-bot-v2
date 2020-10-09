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
    ["admin", "Admin"],
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
  client.user.setActivity("with Commando");
});

client.on("error", console.error);

client.login(config.token);
