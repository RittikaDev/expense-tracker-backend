"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SavingsGoalSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    goalValue: { type: Number, required: true },
    purpose: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
// Exporting the model, passing "SavingsGoal" as the model name.
// Mongoose will automatically pluralize it unless a third argument is passed.
exports.default = (0, mongoose_1.model)("SavingsGoal", SavingsGoalSchema);
