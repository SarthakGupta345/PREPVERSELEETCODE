"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loginMiddleware_1 = require("../middlewares/loginMiddleware");
const problem_controller_1 = require("../controllers/problems/problem.controller");
const router = express_1.default.Router();
// Supports:
// ?page=1
// ?limit=50
// ?difficulty=EASY
// ?sortBy=frequency
// ?order=desc
router.get("/", problem_controller_1.getAllProblems);
// Mark solved
router.post("/:id/done", loginMiddleware_1.loginMiddleware, problem_controller_1.markProblemDone);
// Mark unsolved
router.delete("/:id/done", loginMiddleware_1.loginMiddleware, problem_controller_1.markProblemUndone);
/*
|--------------------------------------------------------------------------
| Topics
|--------------------------------------------------------------------------
*/
// Get all topics with problem counts
router.get("/topics", problem_controller_1.fetchAllTopicsAndNumberOfProblemsCount);
// Get problems from a topic
// Example:
// /topics/Array/problems?page=1&limit=50
router.get("/topics/:topic/problems", problem_controller_1.getAllProblemsFromTopic);
exports.default = router;
