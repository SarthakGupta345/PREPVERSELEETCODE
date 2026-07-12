import express from "express";


import { loginMiddleware, optionalLoginMiddleware } from "../middlewares/loginMiddleware";
import { getAllCompanyNameandNumberofproblems, getAllProblemsFromCompany, getAllUnsolvedProblemFromCompany, getSolvedProblemFromCompany, getCompanyDetails } from "../controllers/company/company.controller";

const router = express.Router();

// Company details
router.get(
    "/:id",
    getCompanyDetails
);

// All company problems
router.get(
    "/:id/problems",
    optionalLoginMiddleware,
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