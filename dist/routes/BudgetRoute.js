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
const authMiddleware_1 = require("../app/middleware/authMiddleware");
const Budget_1 = __importDefault(require("../models/Budget"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const router = (0, express_1.Router)();
router.post("/:userId", authMiddleware_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, budget, date } = req.body;
    const { userId } = req.params;
    if (req.user !== userId)
        return res.status(201).json([]);
    try {
        const newBudget = new Budget_1.default({ category, budget, date, userId });
        yield newBudget.save();
        res.status(201).json(newBudget);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to add budget entry" });
    }
}));
router.get("/:userId/:year/:month", authMiddleware_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, year, month } = req.params;
        if (req.user !== userId)
            return res.status(201).json([]);
        const startOfMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
        const startOfNextMonth = new Date(parseInt(year), parseInt(month), 1);
        const budgets = yield Budget_1.default.find({
            userId,
            date: {
                $gte: startOfMonth,
                $lt: startOfNextMonth,
            },
        });
        if (budgets.length === 0)
            return res.status(201).json([]);
        const actualSpendings = yield Transaction_1.default.aggregate([
            {
                $match: {
                    userId,
                    date: {
                        $gte: startOfMonth,
                        $lt: startOfNextMonth,
                    },
                },
            },
            {
                $group: {
                    _id: "$category",
                    totalSpent: { $sum: "$amount" },
                },
            },
        ]);
        const spendingMap = actualSpendings.reduce((acc, item) => {
            acc[item._id] = item.totalSpent;
            return acc;
        }, {});
        const budgetsWithSpending = budgets.map((budget) => ({
            category: budget.category,
            budget: budget.budget,
            date: budget.date,
            actualSpending: spendingMap[budget.category] || 0,
        }));
        res.json(budgetsWithSpending);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch budget entries" });
    }
}));
router.get("/check-budget/:userId/:category/:amount/:year/:month", authMiddleware_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId, category, amount, year, month } = req.params;
    const startOfMonth = new Date(year, month - 1, 1); // START OF THE MONTH
    const startOfNxtMonth = new Date(year, month, 1); // START OF THE NEXT MONTH
    try {
        const budgetEntry = yield Budget_1.default.findOne({
            userId,
            category,
            date: {
                $gte: startOfMonth,
                $lt: startOfNxtMonth,
            },
        });
        if (!budgetEntry)
            return res
                .status(404)
                .json({ error: "Budget not found for this category" });
        // CALCULATING TOTAL SPENT IN THE SAME CATEGORY AND MONTH
        const actualSpendings = yield Transaction_1.default.aggregate([
            {
                $match: {
                    userId,
                    category,
                    date: {
                        $gte: startOfMonth,
                        $lt: startOfNxtMonth,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: "$amount" },
                },
            },
        ]);
        const totalSpent = ((_a = actualSpendings[0]) === null || _a === void 0 ? void 0 : _a.totalSpent) || 0;
        // CALCULATING REMAINING BUDGET
        const remainingBudget = budgetEntry.budget - totalSpent;
        if (remainingBudget < amount)
            return res
                .status(400)
                .json({ error: "Transaction exceeds the budget for this category." });
        res.status(200).json({ message: "Transaction is within the budget." });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to check budget." });
    }
}));
exports.default = router;
