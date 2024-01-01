import { Router } from "express";
import { isAuthenticated, isSignedIn } from "../../controllers/auth.controller";
import { getUserById } from "../../controllers/user.controller";
import {
    getWord,
    getWordForUser,
    putWordInUser,
} from "../../controllers/word.controller";

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
router.get("/:userId", isSignedIn, isAuthenticated, getWordForUser);

/**
 * @method GET
 * @route /api/v1/auth/words/:uerId
 * @params userId
 */
router.put("/:userId", isSignedIn, isAuthenticated, putWordInUser);

export default router;
