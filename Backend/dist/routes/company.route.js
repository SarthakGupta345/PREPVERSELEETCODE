"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loginMiddleware_1 = require("../middlewares/loginMiddleware");
const company_controller_1 = require("../controllers/company/company.controller");
const router = express_1.default.Router();
// Company details
router.get("/:id", company_controller_1.getCompanyDetails);
// All company problems
router.get("/:id/problems", loginMiddleware_1.optionalLoginMiddleware, company_controller_1.getAllProblemsFromCompany);
// Solved company problems
router.get("/:id/problems/solved", loginMiddleware_1.loginMiddleware, company_controller_1.getSolvedProblemFromCompany);
// Unsolved company problems
router.get("/:id/problems/unsolved", loginMiddleware_1.loginMiddleware, company_controller_1.getAllUnsolvedProblemFromCompany);
router.get("/", company_controller_1.getAllCompanyNameandNumberofproblems);
exports.default = router;
