import WORDS from "../data/words.json";

export function generateRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}
