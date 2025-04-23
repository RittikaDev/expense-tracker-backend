import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { BudgetRoutes } from "../modules/Budget/budget.route";
import { IncomeRoutes } from "../modules/income/income.route";
import { SavingGoalRoutes } from "../modules/savingGoal/savingGoal.route";
import { TransactionRoutes } from "../modules/transaction/transaction.route";

const router = Router();

const moduleRoutes = [
	{
		path: "/authenticate",
		route: AuthRoutes,
	},
	{
		path: "/budgets",
		route: BudgetRoutes,
	},
	{
		path: "/income",
		route: IncomeRoutes,
	},
	{
		path: "/savinggoal",
		route: SavingGoalRoutes,
	},
	{
		path: "/transactions",
		route: TransactionRoutes,
	},
];

moduleRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
