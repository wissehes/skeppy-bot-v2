// These utils are used to check if the bot is playing
// and if the user is allowed to add songs to the queue and

const { MessageEmbed } = require("discord.js");
const { CommandoMessage } = require("discord.js-commando");

class MusicPermUtils {
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
