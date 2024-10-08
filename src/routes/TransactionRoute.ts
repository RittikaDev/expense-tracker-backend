import { Router } from "express";
import Transaction from "../models/Transaction";
import { verifyJWT } from "../middleware/authMiddleware";
import {
	getCurrentMonthRange,
	getPreviousMonthRange,
} from "../reusable/GetDate";

const router = Router();

interface ITransaction extends Document {
	userId: string;
	category: string;
	amount: number;
	date: Date;
	status: string;
}

router.get("/:userId", verifyJWT, async (req: any, res: any) => {
	try {
		const { userId } = req.params;

		if (req.user !== userId) return res.status(201).json([]);

		const transaction = await Transaction.find({ userId });
		res.json(transaction);
	} catch {
		res.status(500).json({ error: "Failed to fetch transaction entries" });
	}
});

router.get("/:userId/:year/:month", verifyJWT, async (req: any, res: any) => {
	try {
		const { userId, year, month } = req.params;

		if (req.user !== userId) return res.status(201).json([]);

		const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
		const startOfNextMonth = new Date(parseInt(year), parseInt(month), 1);

		const transaction = await Transaction.find({
			userId,
			date: {
				$gte: startOfMonth,
				$lt: startOfNextMonth,
			},
		});

		if (transaction.length === 0) return res.status(201).json([]);

		res.json(transaction);
	} catch {
		res.status(500).json({ error: "Failed to fetch transaction entries" });
	}
});

router.post("/:userId", verifyJWT, async (req: any, res: any) => {
	const transactions = req.body;
	const { userId } = req.params;

	if (req.user !== userId) return res.status(201).json([]);

	try {
		const transactionsWithUserId = transactions.map(
			(transaction: ITransaction) => ({
				...transaction,
				userId,
			})
		);
		const savedTransactions = await Transaction.insertMany(
			transactionsWithUserId
		);
		res.status(201).json(savedTransactions);
	} catch (error) {
		res.status(500).json({ error: "Failed to add transaction entries" });
	}
});

router.get("/totalexpense/:userId", verifyJWT, async (req: any, res: any) => {
	try {
		const { userId } = req.params;
		if (req.user !== userId)
			return res.status(403).json({ error: "Unauthorized" });

		// CURRENT MONTH
		const { startOfMonth, endOfMonth } = getCurrentMonthRange();

		// PREVIOUS MONTH
		const { startOfPreviousMonth, endOfPreviousMonth } =
			getPreviousMonthRange();

		// CURRENT MONTH EXPENSE
		const currentExpenses = await Transaction.find({
			userId,
			status: "Success",
			date: { $gte: startOfMonth, $lte: endOfMonth },
		});

		const totalCurrentExpenses = currentExpenses.reduce(
			(acc, transaction) => acc + transaction.amount,
			0
		);

		// PREVIOUS MONTH EXPENSE
		const previousExpenses = await Transaction.find({
			userId,
			status: "Success",
			date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
		});

		const totalPreviousExpenses = previousExpenses.reduce(
			(acc, transaction) => acc + transaction.amount,
			0
		);

		res.json({
			totalCurrentExpenses,
			totalPreviousExpenses,
		});
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch monthly expenses" });
	}
});

export default router;
