import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import {
	getCurrentMonthRange,
	getPreviousMonthRange,
} from "../../../reusable/GetDate";

const getAllTransactions = async (req: any, res: Response) => {
	const { userId } = req.params;

	if (req.authUser !== userId) {
		res.status(201).json([]);
		return;
	}

	try {
		const transactions = await TransactionService.getAll(userId);
		res.json(transactions);
	} catch {
		res.status(500).json({ error: "Failed to fetch transaction entries" });
	}
};

const getTransactionsByMonth = async (req: any, res: Response) => {
	const { userId, year, month } = req.params;

	if (req.authUser !== userId) {
		res.status(201).json([]);
		return;
	}

	try {
		const transactions = await TransactionService.getByMonth(
			userId,
			parseInt(year),
			parseInt(month)
		);
		res.json(transactions.length ? transactions : []);
	} catch {
		res.status(500).json({ error: "Failed to fetch transaction entries" });
	}
};

const addTransactions = async (req: any, res: Response) => {
	const { userId } = req.params;
	const transactions = req.body;

	if (req.authUser !== userId) {
		res.status(201).json([]);
		return;
	}

	try {
		const saved = await TransactionService.addMany(userId, transactions);
		res.status(201).json(saved);
	} catch {
		res.status(500).json({ error: "Failed to add transaction entries" });
	}
};

const getTotalExpenses = async (req: any, res: Response) => {
	const { userId } = req.params;

	if (req.authUser !== userId) {
		res.status(403).json({ error: "Unauthorized" });
		return;
	}

	try {
		const { startOfMonth, endOfMonth } = getCurrentMonthRange();
		const { startOfPreviousMonth, endOfPreviousMonth } =
			getPreviousMonthRange();

		const totalCurrentExpenses = await TransactionService.getTotalExpenses(
			userId,
			startOfMonth,
			endOfMonth
		);

		const totalPreviousExpenses = await TransactionService.getTotalExpenses(
			userId,
			startOfPreviousMonth,
			endOfPreviousMonth
		);

		res.json({
			totalCurrentExpenses,
			totalPreviousExpenses,
		});
	} catch {
		res.status(500).json({ error: "Failed to fetch monthly expenses" });
	}
};

export const TransactionController = {
	getAllTransactions,
	getTransactionsByMonth,
	addTransactions,
	getTotalExpenses,
};
