const SkeppyCommand = require("../../structures/SkeppyCommand");
const { get } = require("axios");
const { MessageEmbed, MessageReaction } = require("discord.js");
const { stripIndents } = require("common-tags");
const { randomNumber, shuffleArray } = require("../../utils/GeneralUtils");

const difficulties = ["easy", "medium", "hard"];

const answerEmoji = [
  ["1", "1️⃣"],
  ["2", "2️⃣"],
  ["3", "3️⃣"],
  ["4", "4️⃣"],
];

module.exports = class TriviaCommand extends SkeppyCommand {
  constructor(client) {
    super(client, {
      name: "trivia",
      memberName: "trivia",
      aliases: ["quiz"],
      group: "games",
      description: "Answer a trivia question and earn braincells!",
      throttling: {
        duration: 10,
        usages: 1,
      },
      args: [
        {
          key: "difficulty",
          prompt: "Which difficulty do you wanna play?",
          type: "string",
          oneOf: difficulties,
        },
      ],
    });
  }

  async run(message, { difficulty }) {
    const { data } = await get("https://opentdb.com/api.php", {
      params: {
        amount: 1,
        difficulty: difficulty.toLowerCase(),
        type: "multiple",
        encode: "url3986",
      },
    });

    const question = decodeURIComponent(data.results[0].question);
    const category = decodeURIComponent(data.results[0].category);

    const wrongAnswers = data.results[0].incorrect_answers.map((a) =>
      decodeURIComponent(a)
    );
    const rightAnswer = decodeURIComponent(data.results[0].correct_answer);

    const answers = shuffleArray([...wrongAnswers, rightAnswer]).map(
      (a, i) => ({
        number: i + 1,
        emoji: answerEmoji[i][1],
        correct: a == rightAnswer,
        answer: a,
      })
    );

    const embed = new MessageEmbed()
      .setTitle(question)
      .setColor("RANDOM")
      .addField("Category", category, true)
      .setDescription(
        stripIndents`*You have 15 seconds to answer*

      ${answers.map((a) => `${a.emoji} **${a.answer}**`).join("\n")}
    `
      )
      .setFooter("Answer using the emoji reactions");

    const msg = await message.embed(embed);

    for (const emoji of answerEmoji) {
      await msg.react(emoji[1]);
    }

    const filter = (reaction, user) =>
      user.id == message.author.id &&
      answerEmoji.map((a) => a[1]).includes(reaction.emoji.name);

    const reactions = await msg.awaitReactions(filter, {
      max: 1,
      time: 15000,
    });

    if (!reactions.size) {
      const timeOutEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription("Question timed out!");

      msg.edit(timeOutEmbed);
      return;
    }

    const answer = this.getAnswerByReaction(reactions.first(), answers);

    if (answer.correct) {
      const { min, max } = this.getMinMaxByDifficulty(difficulty.toLowerCase());

      const amount = randomNumber(min, max);

      this.client.braincells.add(message.author, amount);

      const correctAnswerEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(`You got it right! You earned ${amount} braincells.`);

      msg.edit(correctAnswerEmbed);
    } else {
      const incorrectAnswerEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`I'm sorry, you got it wrong! It was ${rightAnswer}`);

      msg.edit(incorrectAnswerEmbed);
    }
  }

  /**
   * Get answer from a reaction
   * @param {MessageReaction} reaction
   * @param {object} answers
   */
  getAnswerByReaction(reaction, answers) {
    return answers.find((a) => a.emoji == reaction.emoji.name);
  }

  /**
   * Get the min/max amount of braincells it
   * should give based on the difficulty
   * @param {string} difficulty the difficulty of the question
   */
  getMinMaxByDifficulty(difficulty) {
    switch (difficulty) {
      case "easy":
        return {
          min: 3,
          max: 30,
        };
        break;
      case "medium":
        return {
          min: 10,
          max: 50,
        };
        break;
      case "hard":
        return {
          min: 15,
          max: 100,
        };
        break;
    }
  }
};
