const WORDS = require("../data/words.json");

function generateRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}
module.exports = { generateRandomWord };
