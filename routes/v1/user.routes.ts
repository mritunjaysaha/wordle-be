import { Router } from "express";
import { isAuthenticated, isSignedIn } from "../../controllers/auth.controller";
import {
    getLeaderBoard,
    getUser,
    getUserById,
} from "../../controllers/user.controller";

const router = Router();

router.param("userId", getUserById);

router.get("/:userId", isSignedIn, isAuthenticated, getUser);

router.get("/:userId/leaderboard", isSignedIn, isAuthenticated, getLeaderBoard);

export default router;
