const { generateRandomWord } = require("../utils/generateRandomWord");

const getWord = (req, res) => {
    const word = generateRandomWord();

    if (word) {
        return res.json({ success: true, message: "word generated", word });
    }

    return res.status(400).json({
        success: false,
        message: "Failed to generate word",
    });
};

module.exports = { getWord };
