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
exports.SavingGoalService = void 0;
const Income_1 = __importDefault(require("../../../models/Income"));
const SavingGoal_1 = __importDefault(require("../../../models/SavingGoal"));
const Transaction_1 = __importDefault(require("../../../models/Transaction"));
const getMonthDates = (year, month) => {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
    return { startOfMonth, endOfMonth };
};
const checkExistingGoal = (userId, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const formattedStartDate = new Date(start.getFullYear(), start.getMonth(), 1);
    const formattedEndDate = new Date(end.getFullYear(), end.getMonth(), 1);
    const existingGoal = yield SavingGoal_1.default.findOne({
        userId,
        startDate: { $lte: formattedEndDate },
        endDate: { $gte: formattedStartDate },
    });
    if (existingGoal) {
        return {
            exists: true,
            message: "Savings goal was set before for the given period",
            data: existingGoal,
        };
    }
    return {
        exists: false,
        message: "No savings goal found for the given period",
    };
});
const getIncomeAndExpense = (userId, startYear, startMonth, endYear, endMonth) => __awaiter(void 0, void 0, void 0, function* () {
    const incomes = [];
    for (let year = startYear; year <= endYear; year++) {
        for (let month = year === startYear ? startMonth : 1; month <= (year === endYear ? endMonth : 12); month++) {
            const { startOfMonth, endOfMonth } = getMonthDates(year, month);
            const monthlyIncome = yield Income_1.default.find({
                userId,
                date: { $gte: startOfMonth, $lte: endOfMonth },
            });
            incomes.push(...monthlyIncome);
        }
    }
    const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);
    const expenses = [];
    for (let year = startYear; year <= endYear; year++) {
        for (let month = year === startYear ? startMonth : 1; month <= (year === endYear ? endMonth : 12); month++) {
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
    return { totalIncome, totalExpenses };
});
const saveOrUpdateGoal = (userId, goalValue, purpose, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const formattedStartDate = new Date(start.getFullYear(), start.getMonth(), 1);
    const formattedEndDate = new Date(end.getFullYear(), end.getMonth(), 1);
    let goal = yield SavingGoal_1.default.findOne({
        userId,
        startDate: { $lte: formattedEndDate },
        endDate: { $gte: formattedStartDate },
    });
    if (goal) {
        goal.goalValue = goalValue;
        goal.purpose = purpose;
        goal.startDate = formattedStartDate;
        goal.endDate = formattedEndDate;
        goal.updatedAt = new Date();
        yield goal.save();
        return { updated: true, message: "Savings goal updated", data: goal };
    }
    else {
        const newGoal = new SavingGoal_1.default({
            userId,
            goalValue,
            purpose,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        });
        yield newGoal.save();
        return { updated: false, message: "Savings goal created", data: newGoal };
    }
});
exports.SavingGoalService = {
    checkExistingGoal,
    getIncomeAndExpense,
    saveOrUpdateGoal,
};
