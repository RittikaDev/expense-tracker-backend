import express from "express";
import { IncomeController } from "./income.controller";
import { verifyJWT } from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/:userId", verifyJWT, IncomeController.addIncome);
router.get("/:userId", verifyJWT, IncomeController.getIncomeList);
router.get(
	"/:userId/:year/:month",
	verifyJWT,
	IncomeController.getMonthlyIncome
);
router.get(
	"/totalincome/:userId",
	verifyJWT,
	IncomeController.getTotalIncomeComparison
);

export const IncomeRoutes = router;
