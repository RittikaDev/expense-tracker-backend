import { Router } from "express";
import Transaction from "../models/Transaction";
import { verifyJWT } from "../middleware/authMiddleware";

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

export default router;
