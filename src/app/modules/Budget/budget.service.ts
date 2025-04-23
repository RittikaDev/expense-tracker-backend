import Budget from "../../../models/Budget";
import Transaction from "../../../models/Transaction";

type BudgetInput = {
	category: string;
	budget: number;
	date: Date;
	userId: string;
};

const addBudget = async (input: BudgetInput) => {
	const newBudget = new Budget(input);
	await newBudget.save();
	return newBudget;
};

const getBudgets = async (userId: string, year: number, month: number) => {
	const startOfMonth = new Date(year, month - 1, 1);
	const startOfNextMonth = new Date(year, month, 1);

	const budgets = await Budget.find({
		userId,
		date: { $gte: startOfMonth, $lt: startOfNextMonth },
	});

	if (budgets.length === 0) return [];

	const actualSpendings = await Transaction.aggregate([
		{
			$match: {
				userId,
				date: { $gte: startOfMonth, $lt: startOfNextMonth },
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
	}, {} as Record<string, number>);

	return budgets.map((budget) => ({
		category: budget.category,
		budget: budget.budget,
		date: budget.date,
		actualSpending: spendingMap[budget.category] || 0,
	}));
};

type CheckBudgetInput = {
	userId: string;
	category: string;
	amount: number;
	year: number;
	month: number;
};

const checkBudget = async ({
	userId,
	category,
	amount,
	year,
	month,
}: CheckBudgetInput) => {
	const startOfMonth = new Date(year, month - 1, 1);
	const startOfNextMonth = new Date(year, month, 1);

	const budgetEntry = await Budget.findOne({
		userId,
		category,
		date: { $gte: startOfMonth, $lt: startOfNextMonth },
	});

	if (!budgetEntry) {
		return {
			status: 404,
			data: { error: "Budget not found for this category" },
		};
	}

	const actualSpendings = await Transaction.aggregate([
		{
			$match: {
				userId,
				category,
				date: { $gte: startOfMonth, $lt: startOfNextMonth },
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
	const remainingBudget = budgetEntry.budget - totalSpent;

	if (remainingBudget < amount) {
		return {
			status: 400,
			data: { error: "Transaction exceeds the budget for this category." },
		};
	}

	return {
		status: 200,
		data: { message: "Transaction is within the budget." },
	};
};

export const BudgetService = {
	addBudget,
	getBudgets,
	checkBudget,
};
