import express from "express";
import { loginMiddleware } from "../middlewares/loginMiddleware";
import { ConnectLeetcode, getMe, login, logout, signup } from "../controllers/profile.controller";

const router = express.Router();

router.post("/signup", signup );
router.post("/login", login);
router.post("/logout", logout);
router.post("/connectLeetCode",ConnectLeetcode);
router.get('/me',loginMiddleware,getMe);

export default router;