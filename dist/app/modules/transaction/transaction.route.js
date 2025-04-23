"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
router.get("/:userId", authMiddleware_1.verifyJWT, transaction_controller_1.TransactionController.getAllTransactions);
router.get("/:userId/:year/:month", authMiddleware_1.verifyJWT, transaction_controller_1.TransactionController.getTransactionsByMonth);
router.post("/:userId", authMiddleware_1.verifyJWT, transaction_controller_1.TransactionController.addTransactions);
router.get("/totalexpense/:userId", authMiddleware_1.verifyJWT, transaction_controller_1.TransactionController.getTotalExpenses);
exports.TransactionRoutes = router;
