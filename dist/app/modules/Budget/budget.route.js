"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const budget_controller_1 = require("./budget.controller");
const router = express_1.default.Router();
router.post("/:userId", authMiddleware_1.verifyJWT, budget_controller_1.BudgetControllers.addBudget);
router.get("/:userId/:year/:month", authMiddleware_1.verifyJWT, budget_controller_1.BudgetControllers.getBudgets);
router.get("/check-budget/:userId/:category/:amount/:year/:month", authMiddleware_1.verifyJWT, budget_controller_1.BudgetControllers.checkBudget);
exports.BudgetRoutes = router;
