// These utils are used to check if the bot is playing
// and if the user is allowed to add songs to the queue and

const { MessageEmbed } = require("discord.js");
const { CommandoMessage } = require("discord.js-commando");

class MusicPermUtils {
  constructor() {
    this.requirements = {
      MEMBER_VC: {
        description: "Requires a user to be in a voice channel",
        test: (message) => {
          return !!message.member.voice.id;
        },
      },
      PLAYING: {
        description: "Requires there to be a player in the guild",
        test: (message) => {
          return message.client.queue.has(message.guild.id);
        },
      },
      SAME_VC: {
        description:
          "Requires the user to be in the same voice channel as the bot",
        test: (message) => {
          if (!message.member.voice.channel.id) return false;

          const dispatcher = message.client.queue.get(message.guild.id);
          if (dispatcher) {
            if (
              dispatcher.player.voiceConnection.voiceChannelID ==
              message.member.voice.channel.id
            ) {
              return true;
            }
          } else return false;
        },
      },
    };

    this.permissions = {
      ADD_SONGS: {
        description: "Add songs to the queue and start the queue",
        requires: ["MEMBER_VC", "SAME_VC"],
      },
      STOP_QUEUE: {
        description: "Stop the queue from playing",
        requires: ["MEMBER_VC", "PLAYING", "SAME_VC"],
      },
    };
  }

  /**
   * Test for requirements
   * @param {CommandoMessage} message
   * @param {String} permission
   */
  test(message, permission) {
    const perms = this.permissions[permission].requires;
    const permsToCheck = perms.map((a) => this.requirements[a]);

    return !permsToCheck.some((a) => !a.test(message));
  }

  /**
   * Check if a user is allowed to add songs to the queue
   * @param {CommandoMessage} message The message object
   */
  addSongs(message) {
    const client = message.client;

    if (!message.member.voice.channel) {
      message.embed(this.errorEmbed("no_member_vc"));
    }

    const isPlaying = client.queue.get(message.guild.id);

    if (isPlaying) {
      if (
        message.member.voice.channel.id ==
        isPlaying.player.voiceConnection.voiceChannelID
      ) {
        return true;
      } else {
        message.embed(this.errorEmbed("different_vc"));
      }
    } else {
      return true;
    }

    return false;
  }

  /**
   * Generate an embed for an error
   * @param {string} type The error type
   */
  errorEmbed(type) {
    const embed = new MessageEmbed().setColor("RED");

    switch (type) {
      case "no_member_vc":
        embed.setDescription(
          "You need to be in a voice channel for this command!"
        );
        break;

      case "not_playing":
        embed.setDescription("Nothing is playing right now!");
        break;

      case "different_vc":
        embed.setDescription("You're not in the same voice channel as me!");
        break;

      default:
        embed.setDescription(
          "You're not allowed to use this command for some reason..."
        );
        break;
    }

    return embed;
  }
}

module.exports = MusicPermUtils;
