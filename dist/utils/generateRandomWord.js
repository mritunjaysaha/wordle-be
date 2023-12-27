"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomWord = void 0;
const words_json_1 = __importDefault(require("../data/words.json"));
function generateRandomWord() {
    return words_json_1.default[Math.floor(Math.random() * words_json_1.default.length)];
}
exports.generateRandomWord = generateRandomWord;
