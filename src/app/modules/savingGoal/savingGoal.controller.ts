import { Request, Response } from "express";
import { SavingGoalService } from "./savingGoal.service";

const getMonthData = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const { startDate, endDate } = req.body;

		const result = await SavingGoalService.checkExistingGoal(
			userId,
			startDate,
			endDate
		);
		if (result.exists)
			res
				.status(200)
				.json({ message: result.message, existingGoal: result.data });
		else res.status(404).json({ message: result.message });
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
};

const getIncomeAndExpense = async (req: any, res: Response) => {
	try {
		const { userId, startYear, startMonth, endYear, endMonth } = req.params;

		if (req.authUser !== userId) {
			res.status(403).json({ error: "Unauthorized" });
			return;
		}

		const { totalIncome, totalExpenses } =
			await SavingGoalService.getIncomeAndExpense(
				userId,
				parseInt(startYear),
				parseInt(startMonth),
				parseInt(endYear),
				parseInt(endMonth)
			);

		res.json({ totalIncome, totalExpenses });
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch income and expenses" });
	}
};

const saveOrUpdateGoal = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const { goalValue, purpose, startDate, endDate } = req.body;

		if (!userId || !goalValue || !purpose || !startDate || !endDate) {
			res.status(400).json({ error: "All fields are required" });
			return;
		}

		const result = await SavingGoalService.saveOrUpdateGoal(
			userId,
			goalValue,
			purpose,
			startDate,
			endDate
		);

		if (result.updated)
			res.status(200).json({ message: result.message, goal: result.data });
		else
			res.status(201).json({ message: result.message, newGoal: result.data });
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
};
export const SavingGoalController = {
	getMonthData,
	getIncomeAndExpense,
	saveOrUpdateGoal,
};
