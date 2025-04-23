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
exports.IncomeController = void 0;
const income_service_1 = require("./income.service");
const addIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, amount, date } = req.body;
    const { userId } = req.params;
    console.log(userId, req.authUser, "Inside add income");
    if (req.authUser !== userId) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }
    try {
        const newIncome = yield income_service_1.IncomeService.addIncomeEntry({
            category,
            amount,
            date,
            userId,
        });
        res.status(201).json(newIncome);
    }
    catch (_a) {
        res.status(500).json({ error: "Failed to add income entry" });
    }
});
const getIncomeList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (req.authUser !== userId) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }
    try {
        const income = yield income_service_1.IncomeService.getAllIncome(userId);
        res.json(income);
    }
    catch (_a) {
        res.status(500).json({ error: "Failed to fetch income lists" });
    }
});
const getMonthlyIncome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, year, month } = req.params;
    if (req.authUser !== userId) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }
    try {
        const income = yield income_service_1.IncomeService.getMonthlyIncome(userId, +year, +month);
        res.json(income);
    }
    catch (_a) {
        res.status(500).json({ error: "Failed to fetch income entries" });
    }
});
const getTotalIncomeComparison = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (req.authUser !== userId) {
        res.status(403).json({ error: "Unauthorized" });
        return;
    }
    try {
        const data = yield income_service_1.IncomeService.compareMonthlyIncome(userId);
        res.json(data);
    }
    catch (_a) {
        res.status(500).json({ error: "Failed to fetch monthly incomes" });
    }
});
exports.IncomeController = {
    addIncome,
    getIncomeList,
    getMonthlyIncome,
    getTotalIncomeComparison,
};
