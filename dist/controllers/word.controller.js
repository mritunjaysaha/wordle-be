"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWordForUser = exports.getWord = void 0;
const generateRandomWord_1 = require("../utils/generateRandomWord");
const words_json_1 = __importDefault(require("../data/words.json"));
const getWord = (req, res) => {
    const word = (0, generateRandomWord_1.generateRandomWord)();
    if (word) {
        return res.json({ word });
    }
    return res.status(400).json({
        success: false,
        message: "Failed to generate word",
    });
};
exports.getWord = getWord;
const getWordForUser = (req, res) => {
    const { solvedWords } = req.profile;
    const totalWordsLength = words_json_1.default.length;
    while (solvedWords.length < totalWordsLength) {
        const word = (0, generateRandomWord_1.generateRandomWord)();
        if (!solvedWords.includes(word)) {
            return res.json({ word });
        }
    }
    return res
        .status(204)
        .json({ message: "All words generated. Can not generate new word" });
};
exports.getWordForUser = getWordForUser;
//# sourceMappingURL=word.controller.js.map