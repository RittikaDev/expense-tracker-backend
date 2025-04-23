import express from "express";
import { verifyJWT } from "../../middleware/authMiddleware";
import { BudgetControllers } from "./budget.controller";

const router = express.Router();

router.post("/:userId", verifyJWT, BudgetControllers.addBudget);
router.get("/:userId/:year/:month", verifyJWT, BudgetControllers.getBudgets);
router.get(
	"/check-budget/:userId/:category/:amount/:year/:month",
	verifyJWT,
	BudgetControllers.checkBudget
);

export const BudgetRoutes = router;
