import { Router } from "express";
import { isAuthenticated, isSignedIn } from "../../controllers/auth.controller";
import { getUserById } from "../../controllers/user.controller";
import {
    addWordInUser,
    getWord,
    getWordSignedInUser,
} from "../../controllers/word.controller";

const router = Router();

router.param("userId", getUserById);

/**
 * @method GET
 * @route /api/v1/words
 * @params userId
 */
router.get("/", getWord);

/**
 * @method GET
 * @route /api/v1/words/:uerId
 * @params userId
 */
router.get("/:userId", isSignedIn, isAuthenticated, getWordSignedInUser);

/**
 * @method POST
 * @route /api/v1/words/:uerId
 * @params userId
 */
router.post("/:userId", isSignedIn, isAuthenticated, addWordInUser);

export default router;
