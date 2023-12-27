import { Request, Response } from "express";

import { generateRandomWord } from "../utils/generateRandomWord";

export const getWord = (req: Request, res: Response) => {
    const word = generateRandomWord();

    if (word) {
        return res.json({ success: true, message: "word generated", word });
    }

    return res.status(400).json({
        success: false,
        message: "Failed to generate word",
    });
};
