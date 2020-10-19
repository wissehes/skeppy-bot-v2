// These utils are used to check if the bot is playing
// and if the user is allowed to add songs to the queue and

const { MessageEmbed } = require("discord.js");
const { CommandoMessage } = require("discord.js-commando");
const replies = require("../assets/replies.json");

class MusicPermUtils {
  constructor() {
    this.tests = {
      MEMBER_VC: (message) => !!message.member.voice.channel,
      PLAYING: (message) => message.client.queue.has(message.guild.id),
      SAME_VC: (message) => {
        const dispatcher = message.client.queue.get(message.guild.id);

        if (dispatcher) {
          const clientVC = dispatcher.player.voiceConnection.voiceChannelID;
          const memberVC = message.member.voice.channel.id;

          return memberVC == clientVC;
        } else return false;
      },
    };
  }

  /**
   * Check if user can start or add songs to the queue
   * @param {CommandoMessage} message
   */
  canStartOrPlay(message) {
    if (!this.tests.MEMBER_VC(message)) {
      this.errorEmbed(message, "no_member_vc");
      return false;
    }

    if (this.tests.PLAYING(message) && this.tests.SAME_VC(message)) {
      return true;
    } else if (!this.tests.PLAYING(message)) {
      return true;
    }

    if (this.tests.PLAYING(message) && !this.tests.SAME_VC(message)) {
      this.errorEmbed(message, "different_member_vc");
      return false;
    }
  }

  canStop(message) {
    if (!this.tests.MEMBER_VC(message)) {
      this.errorEmbed(message, "no_member_vc");
      return false;
    }

    if (!this.tests.PLAYING(message)) {
      this.errorEmbed("no_player");
      return false;
    }

    if (!this.tests.SAME_VC(message)) {
      this.errorEmbed("different_member_vc");
      return false;
    }

    return true;
  }

  canSkip = this.canStop;

  /**
   * Send an embed for an error
   * @param {CommandoMessage} message the message object
   * @param {string} type The error type
   */
  errorEmbed(message, type) {
    const embed = new MessageEmbed().setColor("RED");

    if (replies[type]) {
      embed.setDescription(replies[type]);
    } else {
      embed.setDescription(
        "You're not allowed to use this command for some reason..."
      );
    }

    message.embed(embed);
  }
}

module.exports = MusicPermUtils;
