import { Router } from "express";
import { verifyJWT } from "../app/middleware/authMiddleware";

import Income from "../models/Income";
import {
	getCurrentMonthRange,
	getPreviousMonthRange,
} from "../reusable/GetDate";

const router = Router();

router.post("/:userId", verifyJWT, async (req: any, res: any) => {
	const { category, amount, date } = req.body;
	const { userId } = req.params;

	if (req.user !== userId) return res.status(201).json([]);

	try {
		const newIncome = new Income({ category, amount, date, userId });
		await newIncome.save();
		res.status(201).json(newIncome);
	} catch (err) {
		res.status(500).json({ error: "Failed to add income entry" });
	}
});

router.get("/:userId", verifyJWT, async (req: any, res: any) => {
	try {
		const { userId } = req.params;

		if (req.user !== userId) return res.status(201).json([]);

		const income = await Income.find({ userId });
		res.json(income);
	} catch {
		res.status(500).json({ error: "Failed to fetch income lists" });
	}
});

router.get("/:userId/:year/:month", verifyJWT, async (req: any, res: any) => {
	const { userId, year, month } = req.params;
	console.log(userId, year, month);
	try {
		const { userId, year, month } = req.params;

		if (req.user !== userId) return res.status(201).json([]);

		const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
		const startOfNextMonth = new Date(parseInt(year), parseInt(month), 1);

		const income = await Income.find({
			userId,
			date: {
				$gte: startOfMonth,
				$lt: startOfNextMonth,
			},
		});

		if (income.length === 0) return res.status(201).json([]);

		const totalIncome = income.map((income) => ({
			category: income.category,
			amount: income.amount,
			date: income.date,
		}));
		res.json(totalIncome);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch income entries" });
	}
});

router.get("/totalincome/:userId", verifyJWT, async (req: any, res: any) => {
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
		const currentIncome = await Income.find({
			userId,
			date: { $gte: startOfMonth, $lte: endOfMonth },
		});

		const totalCurrentIncome = currentIncome.reduce(
			(acc, Income) => acc + Income.amount,
			0
		);

		// PREVIOUS MONTH EXPENSE
		const previousIncome = await Income.find({
			userId,
			date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
		});

		const totalPreviousIncome = previousIncome.reduce(
			(acc, Income) => acc + Income.amount,
			0
		);

		res.json({
			totalCurrentIncome,
			totalPreviousIncome,
		});
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch monthly expenses" });
	}
});

export default router;
