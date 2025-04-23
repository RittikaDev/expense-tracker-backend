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
exports.BudgetService = void 0;
const Budget_1 = __importDefault(require("../../../models/Budget"));
const Transaction_1 = __importDefault(require("../../../models/Transaction"));
const addBudget = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const newBudget = new Budget_1.default(input);
    yield newBudget.save();
    return newBudget;
});
const getBudgets = (userId, year, month) => __awaiter(void 0, void 0, void 0, function* () {
    const startOfMonth = new Date(year, month - 1, 1);
    const startOfNextMonth = new Date(year, month, 1);
    const budgets = yield Budget_1.default.find({
        userId,
        date: { $gte: startOfMonth, $lt: startOfNextMonth },
    });
    if (budgets.length === 0)
        return [];
    const actualSpendings = yield Transaction_1.default.aggregate([
        {
            $match: {
                userId,
                date: { $gte: startOfMonth, $lt: startOfNextMonth },
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
    return budgets.map((budget) => ({
        category: budget.category,
        budget: budget.budget,
        date: budget.date,
        actualSpending: spendingMap[budget.category] || 0,
    }));
});
const checkBudget = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, category, amount, year, month, }) {
    var _b;
    const startOfMonth = new Date(year, month - 1, 1);
    const startOfNextMonth = new Date(year, month, 1);
    const budgetEntry = yield Budget_1.default.findOne({
        userId,
        category,
        date: { $gte: startOfMonth, $lt: startOfNextMonth },
    });
    if (!budgetEntry) {
        return {
            status: 404,
            data: { error: "Budget not found for this category" },
        };
    }
    const actualSpendings = yield Transaction_1.default.aggregate([
        {
            $match: {
                userId,
                category,
                date: { $gte: startOfMonth, $lt: startOfNextMonth },
            },
        },
        {
            $group: {
                _id: null,
                totalSpent: { $sum: "$amount" },
            },
        },
    ]);
    const totalSpent = ((_b = actualSpendings[0]) === null || _b === void 0 ? void 0 : _b.totalSpent) || 0;
    const remainingBudget = budgetEntry.budget - totalSpent;
    if (remainingBudget < amount) {
        return {
            status: 400,
            data: { error: "Transaction exceeds the budget for this category." },
        };
    }
    return {
        status: 200,
        data: { message: "Transaction is within the budget." },
    };
});
exports.BudgetService = {
    addBudget,
    getBudgets,
    checkBudget,
};
