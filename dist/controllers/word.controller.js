"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWordInUser = exports.getWordSignedInUser = exports.getWord = void 0;
const generateRandomWord_1 = require("../utils/generateRandomWord");
const words_json_1 = __importDefault(require("../data/words.json"));
const user_model_1 = require("../models/user.model");
const getWord = (req, res) => {
    const word = (0, generateRandomWord_1.generateRandomWord)();
    if (word) {
        return res.json({
            success: true,
            message: "Word generated",
            word,
        });
    }
    return res.status(400).json({
        success: false,
        message: "Failed to generate word",
        word: "",
    });
};
exports.getWord = getWord;
const getWordSignedInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { solvedWords } = req.profile;
        const totalWordsLength = words_json_1.default.length;
        while (solvedWords.length < totalWordsLength) {
            const word = (0, generateRandomWord_1.generateRandomWord)();
            const hintRes = yield fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const hintParsedRes = yield hintRes.json();
            if (!solvedWords.includes(word)) {
                return res.json({
                    success: true,
                    message: "Word generated",
                    word,
                    hint: hintParsedRes[0].meanings[0].definitions[0]
                        .definition,
                });
            }
        }
        return res.status(204).json({
            success: false,
            message: "All words generated. Can not generate new word",
            word: "",
            hint: "",
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
            word: "",
            hint: "",
        });
    }
});
exports.getWordSignedInUser = getWordSignedInUser;
const addWordInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const word = req.body.word;
        const { email } = req.profile;
        const user = yield user_model_1.UserModel.findOneAndUpdate({ email }, {
            $addToSet: { solvedWords: word },
            $inc: { solvedWordsCount: 1 },
        }, { new: true });
        if (user) {
            return res.json({
                success: true,
                message: "User updated successfully",
            });
        }
        else {
            return res
                .status(400)
                .json({ success: false, message: "Failed to updated user" });
        }
    }
    catch (err) {
        return res
            .status(500)
            .json({ success: false, message: "Operation failed" });
    }
});
exports.addWordInUser = addWordInUser;
//# sourceMappingURL=word.controller.js.map