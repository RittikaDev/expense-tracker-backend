import { Router } from "express";
import Budget from "../models/Budget";
import Transaction from "../models/Transaction";

const router = Router();

router.post("/", async (req, res) => {
	const { category, budget, date } = req.body;
	try {
		const newBudget = new Budget({ category, budget, date });
		await newBudget.save();
		res.status(201).json(newBudget);
	} catch (err) {
		res.status(500).json({ error: "Failed to add budget entry" });
	}
});

router.get("/:year/:month", async (req, res) => {
	try {
		const { year, month } = req.params;

		const queryYear = parseInt(year);
		const queryMonth = parseInt(month);

		const startOfMonth = new Date(queryYear, queryMonth - 1, 1);
		const startOfNextMonth = new Date(queryYear, queryMonth, 1);

		const budgets = await Budget.find({
			date: {
				$gte: startOfMonth,
				$lt: startOfNextMonth,
			},
		});

		const actualSpendings = await Transaction.aggregate([
			{
				$match: {
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
	"/check-budget/:category/:amount/:year/:month",
	async (
		req: {
			params: { category: string; amount: number; year: number; month: number };
		},
		res: any
	) => {
		const { category, amount, year, month } = req.params;
		const transactionAmount = amount;
		const transactionYear = year;
		const transactionMonth = month;

		const transactionDate = new Date(transactionYear, transactionMonth - 1);

		try {
			const budgetEntry = await Budget.findOne({
				category,
				date: {
					$gte: new Date(transactionYear, transactionMonth - 1, 1), // Start of the month
					$lt: new Date(transactionYear, transactionMonth, 1), // Start of the next month
				},
			});

			if (!budgetEntry) {
				return res
					.status(404)
					.json({ error: "Budget not found for this category" });
			}

			// Calculate the total spent in the same category and month
			const actualSpendings = await Transaction.aggregate([
				{
					$match: {
						category,
						date: {
							$gte: new Date(transactionYear, transactionMonth - 1, 1), // Start of the month
							$lt: new Date(transactionYear, transactionMonth, 1), // Start of the next month
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

			// Calculate remaining budget
			const remainingBudget = budgetEntry.budget - totalSpent;

			console.log(remainingBudget, transactionAmount);

			if (remainingBudget < transactionAmount) {
				return res
					.status(400)
					.json({ error: "Transaction exceeds the budget for this category." });
			}

			res.status(200).json({ message: "Transaction is within the budget." });
		} catch (err) {
			res.status(500).json({ error: "Failed to check budget." });
		}
	}
);

export default router;
