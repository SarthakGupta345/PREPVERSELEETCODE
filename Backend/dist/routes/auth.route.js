"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loginMiddleware_1 = require("../middlewares/loginMiddleware");
const profile_controller_1 = require("../controllers/profile.controller");
const router = express_1.default.Router();
router.post("/signup", profile_controller_1.signup);
router.post("/login", profile_controller_1.login);
router.post("/logout", profile_controller_1.logout);
router.post("/connectLeetCode", profile_controller_1.ConnectLeetcode);
router.get('/me', loginMiddleware_1.loginMiddleware, profile_controller_1.getMe);
exports.default = router;
