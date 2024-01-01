import { Request, Response } from "express";

import { RequestWithProfile } from "../types/RequestWithProfile";
import { generateRandomWord } from "../utils/generateRandomWord";

import WORDS from "../data/words.json";
import { UserModel } from "../models/user.model";

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

export const putWordInUser = async (req: RequestWithProfile, res: Response) => {
    try {
        const word = req.body.word;
        const { email } = req.profile;

        const user = await UserModel.findOneAndUpdate(
            { email },
            {
                $addToSet: { solvedWords: word },
                $inc: { solvedWordsCount: 1 },
            },
            { new: true }
        );

        if (user) {
            return res.json({
                success: true,
                message: "User updated successfully",
            });
        } else {
            return res
                .status(400)
                .json({ success: false, message: "Failed to updated user" });
        }
    } catch (err) {}
};
