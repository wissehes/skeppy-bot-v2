const { MessageEmbed, Message } = require("discord.js");

class LyricsUtils {
  /**
   * @constructor Lyrics utilities
   * @param {Object} song Song object reveived from Ksoft.Si
   * @param {Message} message Message object
   */
  constructor(song, message) {
    this.song = song;
    this.requestedBy = message.author.tag;

    this.lyricLengthLimit = 3900;
  }

  /**
   *
   * @param {Object} song The song embed received from Ksoft.Si
   */
  generateEmbeds(song) {
    const returnValue = [];

    if (song.lyrics.length > this.lyricLengthLimit) {
      const lyricsArray = this.splitLyrics();

      for (let i = 0; i < lyricsArray.length; i++) {
        returnValue.push(
          this.createEmbed({
            lyricPart: lyricsArray[i],
            isFirst: i == 0,
            isLast: i == lyricsArray.length - 1,
          })
        );
      }
    } else {
      returnValue.push(
        this.createEmbed({
          lyricPart: song.lyrics,
          isFirst: true,
          isLast: true,
        })
      );
    }

    return returnValue;
  }

  /**
   *
   * @param {String} lyricPart The lyrics to display
   * @param {Boolean} isFirst If this is the first embed in the array
   * @param {Boolean} isLast If this is the last embed in the array
   */
  createEmbed({ lyricPart, isFirst, isLast }) {
    const baseEmbed = new MessageEmbed().setColor("BLUE");

    baseEmbed.setDescription(lyricPart);

    if (isFirst) {
      baseEmbed.setTitle(`${this.song.artist.name} - ${this.song.name}`);

      if (this.song.artwork.length) baseEmbed.setThumbnail(this.song.artwork);
    }

    if (isLast) {
      baseEmbed.setFooter(
        `Requested by ${this.requestedBy} | Lyrics provided by KSoft.Si`
      );
    }

    return baseEmbed;
  }

  splitLyrics() {
    const splittedLyrics = this.song.lyrics.split(" ");

    let result = [];
    let currentString = "";

    for (let i = 0; i < splittedLyrics.length; i++) {
      const currentWord = splittedLyrics[i];

      if (currentString.length + currentString.length < this.lyricLengthLimit) {
        if (i == 0) {
          currentString += currentWord;
        } else {
          currentString += " " + currentWord;
        }
      } else {
        result.push(currentString);

        currentString = currentWord;
      }
    }
    if (currentString.length) {
      result.push(currentString);
    }

    return result;
  }
}

module.exports = LyricsUtils;
