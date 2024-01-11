import { Router } from "express";
import { isAuthenticated, isSignedIn } from "../../controllers/auth.controller";
import { getUserById } from "../../controllers/user.controller";
import { addWordInUser, getWord } from "../../controllers/word.controller";

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

/**
 * @method POST
 * @route /api/v1/auth/words/:uerId
 * @params userId
 */
router.post("/:userId", isSignedIn, isAuthenticated, addWordInUser);

export default router;
