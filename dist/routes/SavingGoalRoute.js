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
const SavingGoal_1 = __importDefault(require("../models/SavingGoal"));
const Income_1 = __importDefault(require("../models/Income"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const router = (0, express_1.Router)();
const getMonthDates = (year, month) => {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    return { startOfMonth, endOfMonth };
};
router.post("/getmonthData/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.body;
        // FORMAT startDate AND endDate TO BE THE FIRST OF THE RESPECTIVE MONTH
        const start = new Date(startDate);
        const end = new Date(endDate);
        const formattedStartDate = new Date(start.getFullYear(), start.getMonth(), 1);
        const formattedEndDate = new Date(end.getFullYear(), end.getMonth(), 1);
        // FIND EXISITNG GOAL WITHIN THE DATE RANGE
        const existingGoal = yield SavingGoal_1.default.findOne({
            userId: userId,
            startDate: { $lte: formattedEndDate },
            endDate: { $gte: formattedStartDate },
        });
        if (existingGoal) {
            return res.status(200).json({
                message: "Savings goal was set before for the given period",
                existingGoal,
            });
        }
        else {
            return res.status(404).json({
                message: "No savings goal found for the given period",
            });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}));
// ROUTE TO GET TOTAL INCOME AND EXPENSE FOR A CERTAIN DATE RANGE
router.get("/:userId/:startYear/:startMonth/:endYear/:endMonth", authMiddleware_1.verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, startYear, startMonth, endYear, endMonth } = req.params;
        if (req.user !== userId)
            return res.status(403).json({ error: "Unauthorized" });
        const startMonthNum = parseInt(startMonth);
        const endMonthNum = parseInt(endMonth);
        const startYearNum = parseInt(startYear);
        const endYearNum = parseInt(endYear);
        // GET INCOME
        const incomes = [];
        for (let year = startYearNum; year <= endYearNum; year++) {
            for (let month = year === startYearNum ? startMonthNum : 1; month <= (year === endYearNum ? endMonthNum : 12); month++) {
                const { startOfMonth, endOfMonth } = getMonthDates(year, month);
                const monthlyIncome = yield Income_1.default.find({
                    userId,
                    date: { $gte: startOfMonth, $lte: endOfMonth },
                });
                incomes.push(...monthlyIncome);
            }
        }
        const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);
        // GET EXPENSE
        const expenses = [];
        for (let year = startYearNum; year <= endYearNum; year++) {
            for (let month = year === startYearNum ? startMonthNum : 1; month <= (year === endYearNum ? endMonthNum : 12); month++) {
                const { startOfMonth, endOfMonth } = getMonthDates(year, month);
                const monthlyExpenses = yield Transaction_1.default.find({
                    userId,
                    status: "Success",
                    date: { $gte: startOfMonth, $lte: endOfMonth },
                });
                expenses.push(...monthlyExpenses);
            }
        }
        const totalExpenses = expenses.reduce((acc, transaction) => acc + transaction.amount, 0);
        res.json({
            totalIncome,
            totalExpenses,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch income and expenses" });
    }
}));
router.post("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { goalValue, purpose, startDate, endDate } = req.body;
    const { userId } = req.params;
    if (!userId || !goalValue || !purpose || !startDate || !endDate)
        return res.status(400).json({ error: "All fields are required" });
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const formattedStartDate = new Date(start.getFullYear(), start.getMonth(), 1);
        const formattedEndDate = new Date(end.getFullYear(), end.getMonth(), 1);
        // CHECK IF THERE IS AN EXISTING GOAL THAT OVERLAPS WITH THE PROVIDED DATE RANGE
        let goal = yield SavingGoal_1.default.findOne({
            userId: userId,
            startDate: { $lte: formattedEndDate },
            endDate: { $gte: formattedStartDate },
        });
        if (goal) {
            // UPDATE
            goal.goalValue = goalValue;
            goal.purpose = purpose;
            goal.startDate = formattedStartDate;
            goal.endDate = formattedEndDate;
            goal.updatedAt = new Date();
            yield goal.save();
            return res.status(200).json({ message: "Savings goal updated", goal });
        }
        else {
            // INSERT
            const newGoal = new SavingGoal_1.default({
                userId,
                goalValue,
                purpose,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            });
            yield newGoal.save();
            return res.status(201).json({ message: "Savings goal created", newGoal });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}));
exports.default = router;
