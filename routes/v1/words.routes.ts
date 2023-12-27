import { Router } from "express";
import { getWord } from "../../controllers/word.controller";

const router = Router();

router.get("/", getWord);

export default router;
