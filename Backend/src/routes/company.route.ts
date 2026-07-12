import express from "express";


import { loginMiddleware } from "../middlewares/loginMiddleware";
import { getAllCompanyNameandNumberofproblems, getAllProblemsFromCompany, getAllUnsolvedProblemFromCompany, getSolvedProblemFromCompany } from "../controllers/company/company.controller";

const router = express.Router();

// All company problems
router.get(
    "/:id/problems",
    loginMiddleware,
    getAllProblemsFromCompany
);

// Solved company problems
router.get(
    "/:id/problems/solved",
    loginMiddleware,
    getSolvedProblemFromCompany
);

// Unsolved company problems
router.get(
    "/:id/problems/unsolved",
    loginMiddleware,
    getAllUnsolvedProblemFromCompany
);

router.get(
    "/",
    getAllCompanyNameandNumberofproblems
);

export default router;