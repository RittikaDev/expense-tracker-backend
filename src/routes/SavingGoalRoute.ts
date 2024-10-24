import { Router } from "express";
import { verifyJWT } from "../middleware/authMiddleware";

import SavingGoal from "../models/SavingGoal";
import Income from "../models/Income";
import Transaction from "../models/Transaction";

const router = Router();

const getMonthDates = (year: number, month: number) => {
	const startOfMonth = new Date(year, month - 1, 1);
	const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
	return { startOfMonth, endOfMonth };
};

router.post("/getmonthData/:userId", async (req: any, res: any) => {
	try {
		const { userId } = req.params;
		const { startDate, endDate } = req.body;

		// FORMAT startDate AND endDate TO BE THE FIRST OF THE RESPECTIVE MONTH
		const start = new Date(startDate);
		const end = new Date(endDate);
		const formattedStartDate = new Date(
			start.getFullYear(),
			start.getMonth(),
			1
		);
		const formattedEndDate = new Date(end.getFullYear(), end.getMonth(), 1);

		// FIND EXISITNG GOAL WITHIN THE DATE RANGE
		const existingGoal = await SavingGoal.findOne({
			userId: userId,
			startDate: { $lte: formattedEndDate },
			endDate: { $gte: formattedStartDate },
		});

		if (existingGoal) {
			return res.status(200).json({
				message: "Savings goal was set before for the given period",
				existingGoal,
			});
		} else {
			return res.status(404).json({
				message: "No savings goal found for the given period",
			});
		}
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

// ROUTE TO GET TOTAL INCOME AND EXPENSE FOR A CERTAIN DATE RANGE
router.get(
	"/:userId/:startYear/:startMonth/:endYear/:endMonth",
	verifyJWT,
	async (req: any, res: any) => {
		try {
			const { userId, startYear, startMonth, endYear, endMonth } = req.params;

			if (req.user !== userId)
				return res.status(403).json({ error: "Unauthorized" });

			const startMonthNum = parseInt(startMonth);
			const endMonthNum = parseInt(endMonth);
			const startYearNum = parseInt(startYear);
			const endYearNum = parseInt(endYear);

			// GET INCOME
			const incomes = [];
			for (let year = startYearNum; year <= endYearNum; year++) {
				for (
					let month = year === startYearNum ? startMonthNum : 1;
					month <= (year === endYearNum ? endMonthNum : 12);
					month++
				) {
					const { startOfMonth, endOfMonth } = getMonthDates(year, month);
					const monthlyIncome = await Income.find({
						userId,
						date: { $gte: startOfMonth, $lte: endOfMonth },
					});
					incomes.push(...monthlyIncome);
				}
			}

			const totalIncome = incomes.reduce(
				(acc, income) => acc + income.amount,
				0
			);

			// GET EXPENSE
			const expenses = [];
			for (let year = startYearNum; year <= endYearNum; year++) {
				for (
					let month = year === startYearNum ? startMonthNum : 1;
					month <= (year === endYearNum ? endMonthNum : 12);
					month++
				) {
					const { startOfMonth, endOfMonth } = getMonthDates(year, month);
					const monthlyExpenses = await Transaction.find({
						userId,
						status: "Success",
						date: { $gte: startOfMonth, $lte: endOfMonth },
					});
					expenses.push(...monthlyExpenses);
				}
			}

			const totalExpenses = expenses.reduce(
				(acc, transaction) => acc + transaction.amount,
				0
			);

			res.json({
				totalIncome,
				totalExpenses,
			});
		} catch (error) {
			res.status(500).json({ error: "Failed to fetch income and expenses" });
		}
	}
);

router.post("/:userId", async (req: any, res: any) => {
	const { goalValue, purpose, startDate, endDate } = req.body;
	const { userId } = req.params;

	if (!userId || !goalValue || !purpose || !startDate || !endDate)
		return res.status(400).json({ error: "All fields are required" });

	try {
		const start = new Date(startDate);
		const end = new Date(endDate);

		const formattedStartDate = new Date(
			start.getFullYear(),
			start.getMonth(),
			1
		);
		const formattedEndDate = new Date(end.getFullYear(), end.getMonth(), 1);

		// CHECK IF THERE IS AN EXISTING GOAL THAT OVERLAPS WITH THE PROVIDED DATE RANGE
		let goal = await SavingGoal.findOne({
			userId: userId,
			startDate: { $lte: formattedEndDate },
			endDate: { $gte: formattedStartDate },
		});

		if (goal) {
			// UPDATE
			goal.goalValue = goalValue;
			goal.purpose = purpose;
			goal.startDate = formattedStartDate;
			goal.endDate = formattedEndDate;
			goal.updatedAt = new Date();

			await goal.save();
			return res.status(200).json({ message: "Savings goal updated", goal });
		} else {
			// INSERT
			const newGoal = new SavingGoal({
				userId,
				goalValue,
				purpose,
				startDate: formattedStartDate,
				endDate: formattedEndDate,
			});

			await newGoal.save();
			return res.status(201).json({ message: "Savings goal created", newGoal });
		}
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
});

export default router;
