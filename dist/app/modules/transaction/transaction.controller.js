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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const transaction_service_1 = require("./transaction.service");
const GetDate_1 = require("../../../reusable/GetDate");
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (req.authUser !== userId) {
        res.status(201).json([]);
        return;
    }
    try {
        const transactions = yield transaction_service_1.TransactionService.getAll(userId);
        res.json(transactions);
    }
    catch (_a) {
        res.status(500).json({ error: "Failed to fetch transaction entries" });
    }
});
const getTransactionsByMonth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, year, month } = req.params;
    if (req.authUser !== userId) {
        res.status(201).json([]);
        return;
    }
    try {
        const transactions = yield transaction_service_1.TransactionService.getByMonth(userId, parseInt(year), parseInt(month));
        res.json(transactions.length ? transactions : []);
    }
    catch (_a) {
        res.status(500).json({ error: "Failed to fetch transaction entries" });
    }
});
const addTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const transactions = req.body;
    if (req.authUser !== userId) {
        res.status(201).json([]);
        return;
    }
    try {
        const saved = yield transaction_service_1.TransactionService.addMany(userId, transactions);
        res.status(201).json(saved);
    }
    catch (_a) {
        res.status(500).json({ error: "Failed to add transaction entries" });
    }
});
const getTotalExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (req.authUser !== userId) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }
    try {
        const { startOfMonth, endOfMonth } = (0, GetDate_1.getCurrentMonthRange)();
        const { startOfPreviousMonth, endOfPreviousMonth } = (0, GetDate_1.getPreviousMonthRange)();
        const totalCurrentExpenses = yield transaction_service_1.TransactionService.getTotalExpenses(userId, startOfMonth, endOfMonth);
        const totalPreviousExpenses = yield transaction_service_1.TransactionService.getTotalExpenses(userId, startOfPreviousMonth, endOfPreviousMonth);
        res.json({
            totalCurrentExpenses,
            totalPreviousExpenses,
        });
    }
    catch (_a) {
        res.status(500).json({ error: "Failed to fetch monthly expenses" });
    }
});
exports.TransactionController = {
    getAllTransactions,
    getTransactionsByMonth,
    addTransactions,
    getTotalExpenses,
};
