const MusicUtils = require("../utils/MusicUtils");

class SkeppyDispatcher {
  constructor(options) {
    this.client = options.client;
    this.guild = options.guild;
    this.textChannel = options.textChannel;
    this.player = options.player;

    this.queue = [];
    this.current = null;

    this.utils = new MusicUtils(this.client);

    this.player.on("start", () => {
      const embed = this.utils.nowPlayingEmbed(
        this.queue,
        this.player,
        this.current
      );

      this.textChannel.send(embed).catch((e) => null);
    });

    this.player.on("end", () => {
      this.play().catch((error) => {
        this.queue.length = 0;
        this.destroy();
      });

      for (const playerEvent of ["closed", "error", "nodeDisconnect"]) {
        this.player.on(playerEvent, () => {
          this.queue.length = 0;
          this.destroy();
        });
      }
    });
  }

  async play() {
    if (!this.client.queue.has(this.guild.id) || !this.queue.length) {
      return this.destroy();
    }
    this.current = this.queue.shift();
    await this.player.playTrack(this.current.track);
  }

  destroy() {
    this.player.disconnect();
    this.queue.length = 0;
    this.client.queue.delete(this.guild.id);
    this.textChannel
      .send("Left the channel due to an empty queue!")
      .catch(() => null);
  }
}

module.exports = SkeppyDispatcher;
