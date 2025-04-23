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
exports.BudgetControllers = void 0;
const budget_service_1 = require("./budget.service");
const addBudget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, budget, date } = req.body;
    const { userId } = req.params;
    if ((req === null || req === void 0 ? void 0 : req.authUser) !== userId) {
        res.status(201).json([]);
        return;
    }
    try {
        const newBudget = yield budget_service_1.BudgetService.addBudget({
            category,
            budget,
            date,
            userId,
        });
        res.status(201).json(newBudget);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to add budget entry" });
    }
});
const getBudgets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, year, month } = req.params;
        if (req.authUser !== userId) {
            res.status(201).json([]);
            return;
        }
        const budgetsWithSpending = yield budget_service_1.BudgetService.getBudgets(userId, +year, +month);
        res.json(budgetsWithSpending);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch budget entries" });
    }
});
const checkBudget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, category, amount, year, month } = req.params;
    try {
        const result = yield budget_service_1.BudgetService.checkBudget({
            userId,
            category,
            amount: +amount,
            year: +year,
            month: +month,
        });
        res.status(result.status).json(result.data);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to check budget." });
    }
});
exports.BudgetControllers = {
    addBudget,
    getBudgets,
    checkBudget,
};
