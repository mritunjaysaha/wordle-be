import { Router } from "express";
import { getWord } from "../../controllers/word.controller";
import { getUserById } from "../../controllers/user.controller";

const router = Router();

router.param("userId", getUserById);

router.get("/", getWord);

router.get("/:userId", getWord);

export default router;
