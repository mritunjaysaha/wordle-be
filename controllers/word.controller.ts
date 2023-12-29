import { Request, Response } from "express";

import { generateRandomWord } from "../utils/generateRandomWord";
import { RequestWithProfile } from "../types/RequestWithProfile";

import WORDS from "../data/words.json";

export const getWord = (req: Request, res: Response) => {
    const word = generateRandomWord();

    if (word) {
        return res.json({ word });
    }

    return res.status(400).json({
        success: false,
        message: "Failed to generate word",
    });
};

export const getWordForUser = (req: RequestWithProfile, res: Response) => {
    const { solvedWords } = req.profile;
    const totalWordsLength = WORDS.length;

    while (solvedWords.length < totalWordsLength) {
        const word = generateRandomWord();

        if (!solvedWords.includes(word)) {
            return res.json({ word });
        }
    }

    return res
        .status(204)
        .json({ message: "All words generated. Can not generate new word" });
};
