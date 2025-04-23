import express from "express";
import { TransactionController } from "./transaction.controller";
import { verifyJWT } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/:userId", verifyJWT, TransactionController.getAllTransactions);
router.get(
	"/:userId/:year/:month",
	verifyJWT,
	TransactionController.getTransactionsByMonth
);
router.post("/:userId", verifyJWT, TransactionController.addTransactions);
router.get(
	"/totalexpense/:userId",
	verifyJWT,
	TransactionController.getTotalExpenses
);

export const TransactionRoutes = router;
