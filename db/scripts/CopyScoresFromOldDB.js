/**
 * This script copies all of the old scores to the new database
 */

const SQLite = require("better-sqlite3");

const sql = new SQLite(process.argv[2]);

let all;

try {
  all = sql.prepare("SELECT * FROM scores").all();
} catch (e) {
  console.error(e);
  process.exit(1);
}

const connect = require("../connect");

connect(require("../../config").mongoURI);

const Point = require("../models/Point");

const mapped = all.map((s) => ({
  guildID: s.guild,
  userID: s.user,
  points: s.points,
  level: Math.floor(0.1 * Math.sqrt(s.points)),
}));

Point.insertMany(mapped);

console.log(mapped);
