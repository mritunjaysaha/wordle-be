import { Router } from "express";
import { getWord } from "../../controllers/word.controller";
import { getUserById } from "../../controllers/user.controller";

const router = Router();

router.param("userId", getUserById);

/**
 * @method GET
 * @route /api/v1/auth/words
 */
router.get("/", getWord);

/**
 * @method GET
 * @route /api/v1/auth/words/:uerId
 * @params userId
 */
router.get("/:userId", getWord);

export default router;
