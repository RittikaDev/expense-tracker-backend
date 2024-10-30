"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Transaction_1 = __importDefault(require("../models/Transaction"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const GetDate_1 = require("../reusable/GetDate");
const router = (0, express_1.Router)();
router.get("/:userId", authMiddleware_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (req.user !== userId)
            return res.status(201).json([]);
        const transaction = yield Transaction_1.default.find({ userId });
        res.json(transaction);
    }
    catch (_a) {
        res.status(500).json({ error: "Failed to fetch transaction entries" });
    }
}));
router.get("/:userId/:year/:month", authMiddleware_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, year, month } = req.params;
        if (req.user !== userId)
            return res.status(201).json([]);
        const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
        const startOfNextMonth = new Date(parseInt(year), parseInt(month), 1);
        const transaction = yield Transaction_1.default.find({
            userId,
            date: {
                $gte: startOfMonth,
                $lt: startOfNextMonth,
            },
        });
        if (transaction.length === 0)
            return res.status(201).json([]);
        res.json(transaction);
    }
    catch (_a) {
        res.status(500).json({ error: "Failed to fetch transaction entries" });
    }
}));
router.post("/:userId", authMiddleware_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = req.body;
    const { userId } = req.params;
    if (req.user !== userId)
        return res.status(201).json([]);
    try {
        const transactionsWithUserId = transactions.map((transaction) => (Object.assign(Object.assign({}, transaction), { userId })));
        const savedTransactions = yield Transaction_1.default.insertMany(transactionsWithUserId);
        res.status(201).json(savedTransactions);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to add transaction entries" });
    }
}));
router.get("/totalexpense/:userId", authMiddleware_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (req.user !== userId)
            return res.status(403).json({ error: "Unauthorized" });
        // CURRENT MONTH
        const { startOfMonth, endOfMonth } = (0, GetDate_1.getCurrentMonthRange)();
        // PREVIOUS MONTH
        const { startOfPreviousMonth, endOfPreviousMonth } = (0, GetDate_1.getPreviousMonthRange)();
        // CURRENT MONTH EXPENSE
        const currentExpenses = yield Transaction_1.default.find({
            userId,
            status: "Success",
            date: { $gte: startOfMonth, $lte: endOfMonth },
        });
        const totalCurrentExpenses = currentExpenses.reduce((acc, transaction) => acc + transaction.amount, 0);
        // PREVIOUS MONTH EXPENSE
        const previousExpenses = yield Transaction_1.default.find({
            userId,
            status: "Success",
            date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
        });
        const totalPreviousExpenses = previousExpenses.reduce((acc, transaction) => acc + transaction.amount, 0);
        res.json({
            totalCurrentExpenses,
            totalPreviousExpenses,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch monthly expenses" });
    }
}));
exports.default = router;
