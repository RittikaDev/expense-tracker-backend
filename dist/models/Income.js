"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IncomeSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
});
exports.default = (0, mongoose_1.model)("Income", IncomeSchema);
