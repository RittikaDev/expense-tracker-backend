"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const budget_route_1 = require("../modules/Budget/budget.route");
const income_route_1 = require("../modules/income/income.route");
const savingGoal_route_1 = require("../modules/savingGoal/savingGoal.route");
const transaction_route_1 = require("../modules/transaction/transaction.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/authenticate",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/budgets",
        route: budget_route_1.BudgetRoutes,
    },
    {
        path: "/income",
        route: income_route_1.IncomeRoutes,
    },
    {
        path: "/savinggoal",
        route: savingGoal_route_1.SavingGoalRoutes,
    },
    {
        path: "/transactions",
        route: transaction_route_1.TransactionRoutes,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
