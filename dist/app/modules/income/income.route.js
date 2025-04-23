"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const income_controller_1 = require("./income.controller");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/:userId", authMiddleware_1.verifyJWT, income_controller_1.IncomeController.addIncome);
router.get("/:userId", authMiddleware_1.verifyJWT, income_controller_1.IncomeController.getIncomeList);
router.get("/:userId/:year/:month", authMiddleware_1.verifyJWT, income_controller_1.IncomeController.getMonthlyIncome);
router.get("/totalincome/:userId", authMiddleware_1.verifyJWT, income_controller_1.IncomeController.getTotalIncomeComparison);
exports.IncomeRoutes = router;
