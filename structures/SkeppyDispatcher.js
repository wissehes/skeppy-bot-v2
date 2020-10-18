const MusicUtils = require("../utils/MusicUtils");
const SkeppyTrack = require("./SkeppyTrack");

class SkeppyDispatcher {
  constructor(options) {
    this.client = options.client;
    this.guild = options.guild;
    this.textChannel = options.textChannel;
    this.player = options.player;

    this.queue = [];
    this.current = null;

    this.firstTrack = true;

    this.utils = new MusicUtils(this.client);

    this.player.on("start", () => {
      if (!this.firstTrack) {
        const embed = this.utils.nowPlayingEmbed(
          this.queue,
          this.player,
          this.current
        );

        this.textChannel.send(embed).catch((e) => null);
      } else this.firstTrack = false;
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
      return this.destroy("emptyQueue");
    }
    this.current = this.queue.shift();
    await this.player.playTrack(this.current.track);
  }

  /**
   * Add a track to the queue
   * @param {SkeppyTrack} track The track to add
   */
  addTrack(track) {
    this.queue.push(track);

    const embed = this.utils.addedToQueueEmbed(track);

    track.requestChannel.send(embed).catch((e) => null);
  }

  getQueue() {
    // Send it this way so when splicing, it doesnt fuck up this.queue
    return [...this.queue];
  }

  destroy(reason) {
    this.player.disconnect();
    this.queue.length = 0;
    this.client.queue.delete(this.guild.id);

    let toSend;
    switch (reason) {
      case "emptyQueue":
        toSend = "Done playing!";
        break;

      case "stop":
        toSend = "Stopped playing and left the channel!";
        break;

      default:
        toSend = "Left the channel.";
        break;
    }

    this.textChannel.send(toSend).catch(() => null);
  }
}

module.exports = SkeppyDispatcher;
