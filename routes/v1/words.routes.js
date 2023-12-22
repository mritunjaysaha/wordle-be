const { Router } = require("express");
const { getWord } = require("../../controllers/word.controller");

const router = Router();

router.get("/", getWord);

module.exports = router;
