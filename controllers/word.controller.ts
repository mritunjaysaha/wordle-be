import { Request, Response } from "express";

import { RequestWithProfile } from "../types/RequestWithProfile";
import { generateRandomWord } from "../utils/generateRandomWord";

import WORDS from "../data/words.json";
import { UserModel } from "../models/user.model";

export const getWord = (req: Request, res: Response) => {
    const word = generateRandomWord();

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

export const getWordSignedInUser = async (
    req: RequestWithProfile,
    res: Response
) => {
    try {
        const { solvedWords } = req.profile;
        const totalWordsLength = WORDS.length;

        while (solvedWords.length < totalWordsLength) {
            const word = generateRandomWord();

            const hintRes = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
            );

            const hintParsedRes = await hintRes.json();

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
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
            word: "",
            hint: "",
        });
    }
};

export const addWordInUser = async (req: RequestWithProfile, res: Response) => {
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
    } catch (err) {
        return res
            .status(500)
            .json({ success: false, message: "Operation failed" });
    }
};
