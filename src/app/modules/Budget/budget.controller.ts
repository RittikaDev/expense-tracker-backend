import { Request, Response } from "express";
import { BudgetService } from "./budget.service";

declare global {
	namespace Express {
		interface Request {
			authUser?: string;
		}
	}
}

const addBudget = async (req: Request, res: Response) => {
	const { category, budget, date } = req.body;
	const { userId } = req.params;

	if (req?.authUser !== userId) {
		res.status(201).json([]);
		return;
	}

	try {
		const newBudget = await BudgetService.addBudget({
			category,
			budget,
			date,
			userId,
		});
		res.status(201).json(newBudget);
	} catch (err) {
		res.status(500).json({ error: "Failed to add budget entry" });
	}
};

const getBudgets = async (req: Request, res: Response) => {
	try {
		const { userId, year, month } = req.params;

		if (req.authUser !== userId) {
			res.status(201).json([]);
			return;
		}

		const budgetsWithSpending = await BudgetService.getBudgets(
			userId,
			+year,
			+month
		);
		res.json(budgetsWithSpending);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch budget entries" });
	}
};

const checkBudget = async (req: Request, res: Response) => {
	const { userId, category, amount, year, month } = req.params;

	try {
		const result = await BudgetService.checkBudget({
			userId,
			category,
			amount: +amount,
			year: +year,
			month: +month,
		});
		res.status(result.status).json(result.data);
	} catch (err) {
		res.status(500).json({ error: "Failed to check budget." });
	}
};
export const BudgetControllers = {
	addBudget,
	getBudgets,
	checkBudget,
};
