"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingGoalRoutes = void 0;
const express_1 = __importDefault(require("express"));
const savingGoal_controller_1 = require("./savingGoal.controller");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/getmonthData/:userId", savingGoal_controller_1.SavingGoalController.getMonthData);
router.get("/:userId/:startYear/:startMonth/:endYear/:endMonth", authMiddleware_1.verifyJWT, savingGoal_controller_1.SavingGoalController.getIncomeAndExpense);
router.post("/:userId", savingGoal_controller_1.SavingGoalController.saveOrUpdateGoal);
exports.SavingGoalRoutes = router;
