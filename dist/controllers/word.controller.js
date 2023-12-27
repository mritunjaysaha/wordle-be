"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWord = void 0;
const generateRandomWord_1 = require("../utils/generateRandomWord");
const getWord = (req, res) => {
    const word = (0, generateRandomWord_1.generateRandomWord)();
    if (word) {
        return res.json({ success: true, message: "word generated", word });
    }
    return res.status(400).json({
        success: false,
        message: "Failed to generate word",
    });
};
exports.getWord = getWord;
