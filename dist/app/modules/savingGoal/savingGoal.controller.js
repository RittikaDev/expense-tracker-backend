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
exports.SavingGoalController = void 0;
const savingGoal_service_1 = require("./savingGoal.service");
const getMonthData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.body;
        const result = yield savingGoal_service_1.SavingGoalService.checkExistingGoal(userId, startDate, endDate);
        if (result.exists)
            res
                .status(200)
                .json({ message: result.message, existingGoal: result.data });
        else
            res.status(404).json({ message: result.message });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
const getIncomeAndExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, startYear, startMonth, endYear, endMonth } = req.params;
        if (req.authUser !== userId) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }
        const { totalIncome, totalExpenses } = yield savingGoal_service_1.SavingGoalService.getIncomeAndExpense(userId, parseInt(startYear), parseInt(startMonth), parseInt(endYear), parseInt(endMonth));
        res.json({ totalIncome, totalExpenses });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch income and expenses" });
    }
});
const saveOrUpdateGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { goalValue, purpose, startDate, endDate } = req.body;
        if (!userId || !goalValue || !purpose || !startDate || !endDate) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        const result = yield savingGoal_service_1.SavingGoalService.saveOrUpdateGoal(userId, goalValue, purpose, startDate, endDate);
        if (result.updated)
            res.status(200).json({ message: result.message, goal: result.data });
        else
            res.status(201).json({ message: result.message, newGoal: result.data });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.SavingGoalController = {
    getMonthData,
    getIncomeAndExpense,
    saveOrUpdateGoal,
};
