const SkeppyCommand = require("../../structures/SkeppyCommand");

module.exports = class GainCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "gain",
      memberName: "gain",
      aliases: [],
      group: "braincells",
      description: "Get more braincells!",
      throttling: {
        duration: 300,
        usages: 1,
      },
    });
  }

  async run(message) {
    const donator = this.getDonator();
    const amount = this.getAmount();
    const action = this.getAction(donator);

    await this.client.braincells.add(message.author, amount);

    message.reply(`You received **${amount}** braincells ${action}`);
  }

  getDonator() {
    const donators = ["Skeppy", "BadBoyHalo", "a6d", "f1nn5ter", "muffin"];

    return donators[Math.floor(Math.random() * donators.length)];
  }

  getAction(donator) {
    const actions = [
      "by watching a video from {d}",
      "by eating a cookie from {d}",
      "from {d}",
      "by subscribing to {d}",
      "by following {d} on twitter",
      "by being a crackhead",
      "by donating to {d}",
    ];
    const action = actions[Math.floor(Math.random() * actions.length)];
    return action.replace("{d}", donator);
  }

  getAmount = () => Math.round(Math.random() * 100);
};
