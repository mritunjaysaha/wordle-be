import WORDS from "../data/words.json" assert { type: "json" };

export function generateRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}
