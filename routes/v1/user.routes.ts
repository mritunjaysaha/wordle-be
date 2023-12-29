import { isAuthenticated } from "../../controllers/auth.controller";
import { isSignedIn } from "../../controllers/auth.controller";
import { getUser, getUserById } from "../../controllers/user.controller";
import { Router } from "express";

const router = Router();

router.param("userId", getUserById);

router.get("/:userId", isSignedIn, isAuthenticated, getUser);

export default router;
