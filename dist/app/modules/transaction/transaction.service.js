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
exports.TransactionService = void 0;
const Transaction_1 = __importDefault(require("../../../models/Transaction"));
const getAll = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Transaction_1.default.find({ userId });
});
const getByMonth = (userId, year, month) => __awaiter(void 0, void 0, void 0, function* () {
    const startOfMonth = new Date(year, month - 1, 1);
    const startOfNextMonth = new Date(year, month, 1);
    return yield Transaction_1.default.find({
        userId,
        date: { $gte: startOfMonth, $lt: startOfNextMonth },
    });
});
const addMany = (userId, transactions) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionsWithUserId = transactions.map((t) => (Object.assign(Object.assign({}, t), { userId })));
    return yield Transaction_1.default.insertMany(transactionsWithUserId);
});
const getTotalExpenses = (userId, startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield Transaction_1.default.find({
        userId,
        status: "Success",
        date: { $gte: startDate, $lte: endDate },
    });
    return transactions.reduce((acc, t) => acc + t.amount, 0);
});
exports.TransactionService = {
    getAll,
    getByMonth,
    addMany,
    getTotalExpenses,
};
