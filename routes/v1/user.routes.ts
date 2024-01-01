import { Router } from "express";
import { isAuthenticated, isSignedIn } from "../../controllers/auth.controller";
import { getUser, getUserById } from "../../controllers/user.controller";
import { UserModel } from "../../models/user.model";

const router = Router();

router.param("userId", getUserById);

router.get("/:userId", isSignedIn, isAuthenticated, getUser);

router.get(
    "/:userId/leaderboard",
    isSignedIn,
    isAuthenticated,
    async (req, res) => {
        const users = await UserModel.find(
            { solvedWordsCount: { $gt: 0 } },
            { _id: 0, solvedWordsCount: 1, email: 1 }
        ).sort({ solvedWordsCount: -1 });
        console.log({ users });

        return res.json({ users });
    }
);

export default router;
