const { TextChannel } = require("discord.js");
const { CommandoGuild } = require("discord.js-commando");
const { ShoukakuPlayer } = require("shoukaku");
const MusicUtils = require("../utils/MusicUtils");
const SkeppyTrack = require("./SkeppyTrack");

class SkeppyDispatcher {
  /**
   * @constructor
   * @param {object} options
   * @param {SkeppyClient} options.client
   * @param {CommandoGuild} options.guild
   * @param {TextChannel} options.textChannel
   * @param {ShoukakuPlayer} options.player
   */
  constructor(options) {
    this.client = options.client;
    this.guild = options.guild;
    this.textChannel = options.textChannel;
    this.player = options.player;

    this.queue = [];
    this.current = null;

    this.firstTrack = true;
    /**
     * Loop:
     * 0 = off
     * 1 = loop track
     * 2 = loop queue
     */
    this.loop = 0;

    this.utils = new MusicUtils(this.client);

    this.listeners = [];

    for (const playerEvent of ["closed", "error", "nodeDisconnect"]) {
      const listener = this.player.on(playerEvent, () => {
        this.queue.length = 0;
        try {
          this.destroy();
        } catch (e) {
          null;
        }
      });
      this.listeners.push(listener);
    }

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
    });
  }

  async play() {
    if (
      !this.client.queue.has(this.guild.id) ||
      (!this.queue.length && !this.loop)
    ) {
      return this.destroy("emptyQueue");
    }

    // if loop is disabled, shift the queue.
    // else if loop is set to whole queue,
    // push the current song to the queue
    // and shift the queue.

    if (this.loop == 0) {
      this.current = this.queue.shift();
    } else if (this.loop == 2) {
      this.queue.push(this.current);
      this.current = this.queue.shift();
    }

    await this.player.playTrack(this.current.track);
  }

  /**
   * Add a track to the queue
   * @param {SkeppyTrack} track The track to add
   */
  addTrack(track) {
    this.queue.push(track);
  }

  getQueue() {
    // Send it this way so when splicing, it doesnt fuck up this.queue
    return [...this.queue];
  }

  destroy(reason) {
    this.player.disconnect();
    this.queue.length = 0;
    this.client.queue.delete(this.guild.id);
    this.player.removeAllListeners();

    if (reason == "emptyQueue") {
      this.textChannel.send("Done playing!").catch(() => null);
    }
  }
}

module.exports = SkeppyDispatcher;
