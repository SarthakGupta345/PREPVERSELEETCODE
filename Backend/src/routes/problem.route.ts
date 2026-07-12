import express from "express";
import { loginMiddleware } from "../middlewares/loginMiddleware";
import { fetchAllTopicsAndNumberOfProblemsCount, getAllProblems, getAllProblemsFromTopic, markProblemDone, markProblemUndone } from "../controllers/problems/problem.controller";


const router = express.Router();



// Supports:
// ?page=1
// ?limit=50
// ?difficulty=EASY
// ?sortBy=frequency
// ?order=desc
router.get(
    "/",
    getAllProblems
);

// Mark solved
router.post(
    "/:id/done",
    loginMiddleware,
    markProblemDone
);

// Mark unsolved
router.delete(
    "/:id/done",
    loginMiddleware,
    markProblemUndone
);

/*
|--------------------------------------------------------------------------
| Topics
|--------------------------------------------------------------------------
*/

// Get all topics with problem counts
router.get(
    "/topics",
    fetchAllTopicsAndNumberOfProblemsCount
);

// Get problems from a topic
// Example:
// /topics/Array/problems?page=1&limit=50
router.get(
    "/topics/:topic/problems",
    getAllProblemsFromTopic
);

export default router;