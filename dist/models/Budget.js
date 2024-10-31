"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BudgetSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    category: { type: String, required: true },
    budget: { type: Number, required: true },
    date: { type: Date, required: true },
});
exports.default = (0, mongoose_1.model)("Budget", BudgetSchema); // MONGOOSE DOES AUTOMATIC PLURALIZATION OF MODEL NAMES, TO AVOID THIS, A THIRD ARGUMENT CAN BE PASSED IN THE MODEL FUNCTION
