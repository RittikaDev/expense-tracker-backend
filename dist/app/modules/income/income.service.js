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
exports.IncomeService = void 0;
const Income_1 = __importDefault(require("../../../models/Income"));
const GetDate_1 = require("../../../reusable/GetDate");
const addIncomeEntry = (_a) => __awaiter(void 0, [_a], void 0, function* ({ category, amount, date, userId, }) {
    const newIncome = new Income_1.default({ category, amount, date, userId });
    console.log(newIncome);
    yield newIncome.save();
    return newIncome;
});
const getAllIncome = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Income_1.default.find({ userId });
});
const getMonthlyIncome = (userId, year, month) => __awaiter(void 0, void 0, void 0, function* () {
    const startOfMonth = new Date(year, month - 1, 1);
    const startOfNextMonth = new Date(year, month, 1);
    const income = yield Income_1.default.find({
        userId,
        date: { $gte: startOfMonth, $lt: startOfNextMonth },
    });
    return income.map((entry) => ({
        category: entry.category,
        amount: entry.amount,
        date: entry.date,
    }));
});
const compareMonthlyIncome = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { startOfMonth, endOfMonth } = (0, GetDate_1.getCurrentMonthRange)();
    const { startOfPreviousMonth, endOfPreviousMonth } = (0, GetDate_1.getPreviousMonthRange)();
    const currentIncome = yield Income_1.default.find({
        userId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const totalCurrentIncome = currentIncome.reduce((acc, inc) => acc + inc.amount, 0);
    const previousIncome = yield Income_1.default.find({
        userId,
        date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
    });
    const totalPreviousIncome = previousIncome.reduce((acc, inc) => acc + inc.amount, 0);
    return {
        totalCurrentIncome,
        totalPreviousIncome,
    };
});
exports.IncomeService = {
    addIncomeEntry,
    getAllIncome,
    getMonthlyIncome,
    compareMonthlyIncome,
};
