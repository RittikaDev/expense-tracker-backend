import { Router } from "express";
import Transaction from "../models/Transaction";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const transaction = await Transaction.find();
		res.json(transaction);
	} catch {
		res.status(500).json({ error: "Failed to fetch transaction entries" });
	}
});

router.post("/", async (req, res) => {
	const transactions = req.body;
	try {
		const savedTransactions = await Transaction.insertMany(transactions);
		res.status(201).json(savedTransactions);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to add transaction entries" });
	}
});

export default router;
