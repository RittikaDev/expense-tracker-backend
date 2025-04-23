import express from "express";
import { SavingGoalController } from "./savingGoal.controller";
import { verifyJWT } from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/getmonthData/:userId", SavingGoalController.getMonthData);
router.get(
	"/:userId/:startYear/:startMonth/:endYear/:endMonth",
	verifyJWT,
	SavingGoalController.getIncomeAndExpense
);
router.post("/:userId", SavingGoalController.saveOrUpdateGoal);

export const SavingGoalRoutes = router;
