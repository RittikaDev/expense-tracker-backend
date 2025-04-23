import { Request, Response } from "express";
import { IncomeService } from "./income.service";

const addIncome = async (req: any, res: Response) => {
	const { category, amount, date } = req.body;
	const { userId } = req.params;

	console.log(userId, req.authUser, "Inside add income");

	if (req.authUser !== userId) {
		res.status(403).json({ error: "Unauthorized" });
		return;
	}

	try {
		const newIncome = await IncomeService.addIncomeEntry({
			category,
			amount,
			date,
			userId,
		});
		res.status(201).json(newIncome);
	} catch {
		res.status(500).json({ error: "Failed to add income entry" });
	}
};

const getIncomeList = async (req: any, res: Response) => {
	const { userId } = req.params;

	if (req.authUser !== userId) {
		res.status(403).json({ error: "Unauthorized" });
		return;
	}

	try {
		const income = await IncomeService.getAllIncome(userId);
		res.json(income);
	} catch {
		res.status(500).json({ error: "Failed to fetch income lists" });
	}
};

const getMonthlyIncome = async (req: any, res: Response) => {
	const { userId, year, month } = req.params;

	if (req.authUser !== userId) {
		res.status(403).json({ error: "Unauthorized" });
		return;
	}

	try {
		const income = await IncomeService.getMonthlyIncome(userId, +year, +month);
		res.json(income);
	} catch {
		res.status(500).json({ error: "Failed to fetch income entries" });
	}
};

const getTotalIncomeComparison = async (req: any, res: Response) => {
	const { userId } = req.params;

	if (req.authUser !== userId) {
		res.status(403).json({ error: "Unauthorized" });
		return;
	}

	try {
		const data = await IncomeService.compareMonthlyIncome(userId);
		res.json(data);
	} catch {
		res.status(500).json({ error: "Failed to fetch monthly incomes" });
	}
};
export const IncomeController = {
	addIncome,
	getIncomeList,
	getMonthlyIncome,
	getTotalIncomeComparison,
};
