import { Router } from "express";
import { verifyJWT } from "../app/middleware/authMiddleware";

import Budget from "../models/Budget";
import Transaction from "../models/Transaction";

const router = Router();

router.post("/:userId", verifyJWT, async (req: any, res: any) => {
	const { category, budget, date } = req.body;
	const { userId } = req.params;

	if (req.user !== userId) return res.status(201).json([]);

	try {
		const newBudget = new Budget({ category, budget, date, userId });
		await newBudget.save();
		res.status(201).json(newBudget);
	} catch (err) {
		res.status(500).json({ error: "Failed to add budget entry" });
	}
});

router.get("/:userId/:year/:month", verifyJWT, async (req: any, res: any) => {
	try {
		const { userId, year, month } = req.params;

		if (req.user !== userId) return res.status(201).json([]);

		const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
		const startOfNextMonth = new Date(parseInt(year), parseInt(month), 1);

		const budgets = await Budget.find({
			userId,
			date: {
				$gte: startOfMonth,
				$lt: startOfNextMonth,
			},
		});

		if (budgets.length === 0) return res.status(201).json([]);

		const actualSpendings = await Transaction.aggregate([
			{
				$match: {
					userId,
					date: {
						$gte: startOfMonth,
						$lt: startOfNextMonth,
					},
				},
			},
			{
				$group: {
					_id: "$category",
					totalSpent: { $sum: "$amount" },
				},
			},
		]);

		const spendingMap = actualSpendings.reduce((acc, item) => {
			acc[item._id] = item.totalSpent;
			return acc;
		}, {});

		const budgetsWithSpending = budgets.map((budget) => ({
			category: budget.category,
			budget: budget.budget,
			date: budget.date,
			actualSpending: spendingMap[budget.category] || 0,
		}));
		res.json(budgetsWithSpending);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch budget entries" });
	}
});

router.get(
	"/check-budget/:userId/:category/:amount/:year/:month",
	verifyJWT,
	async (
		req: {
			params: {
				userId: string;
				category: string;
				amount: number;
				year: number;
				month: number;
			};
		},
		res: any
	) => {
		const { userId, category, amount, year, month } = req.params;

		const startOfMonth = new Date(year, month - 1, 1); // START OF THE MONTH
		const startOfNxtMonth = new Date(year, month, 1); // START OF THE NEXT MONTH

		try {
			const budgetEntry = await Budget.findOne({
				userId,
				category,
				date: {
					$gte: startOfMonth,
					$lt: startOfNxtMonth,
				},
			});

			if (!budgetEntry)
				return res
					.status(404)
					.json({ error: "Budget not found for this category" });

			// CALCULATING TOTAL SPENT IN THE SAME CATEGORY AND MONTH
			const actualSpendings = await Transaction.aggregate([
				{
					$match: {
						userId,
						category,
						date: {
							$gte: startOfMonth,
							$lt: startOfNxtMonth,
						},
					},
				},
				{
					$group: {
						_id: null,
						totalSpent: { $sum: "$amount" },
					},
				},
			]);

			const totalSpent = actualSpendings[0]?.totalSpent || 0;

			// CALCULATING REMAINING BUDGET
			const remainingBudget = budgetEntry.budget - totalSpent;

			if (remainingBudget < amount)
				return res
					.status(400)
					.json({ error: "Transaction exceeds the budget for this category." });

			res.status(200).json({ message: "Transaction is within the budget." });
		} catch (err) {
			res.status(500).json({ error: "Failed to check budget." });
		}
	}
);

export default router;
