class SkeppyDispatcher {
  constructor(options) {
    this.client = options.client;
    this.guild = options.guild;
    this.textChannel = options.textChannel;
    this.player = options.player;

    this.queue = [];
    this.current = null;

    this.player.on("start", () => {
      this.textChannel
        .send(`Now playing **${this.current.info.title}**`)
        .catch((e) => null);
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
