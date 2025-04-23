import Income from "../../../models/Income";
import SavingGoal from "../../../models/SavingGoal";
import Transaction from "../../../models/Transaction";

const getMonthDates = (year: number, month: number) => {
	const startOfMonth = new Date(year, month - 1, 1);
	const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
	return { startOfMonth, endOfMonth };
};

const checkExistingGoal = async (
	userId: string,
	startDate: string,
	endDate: string
) => {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const formattedStartDate = new Date(start.getFullYear(), start.getMonth(), 1);
	const formattedEndDate = new Date(end.getFullYear(), end.getMonth(), 1);

	const existingGoal = await SavingGoal.findOne({
		userId,
		startDate: { $lte: formattedEndDate },
		endDate: { $gte: formattedStartDate },
	});

	if (existingGoal) {
		return {
			exists: true,
			message: "Savings goal was set before for the given period",
			data: existingGoal,
		};
	}
	return {
		exists: false,
		message: "No savings goal found for the given period",
	};
};

const getIncomeAndExpense = async (
	userId: string,
	startYear: number,
	startMonth: number,
	endYear: number,
	endMonth: number
) => {
	const incomes = [];
	for (let year = startYear; year <= endYear; year++) {
		for (
			let month = year === startYear ? startMonth : 1;
			month <= (year === endYear ? endMonth : 12);
			month++
		) {
			const { startOfMonth, endOfMonth } = getMonthDates(year, month);
			const monthlyIncome = await Income.find({
				userId,
				date: { $gte: startOfMonth, $lte: endOfMonth },
			});
			incomes.push(...monthlyIncome);
		}
	}
	const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);

	const expenses = [];
	for (let year = startYear; year <= endYear; year++) {
		for (
			let month = year === startYear ? startMonth : 1;
			month <= (year === endYear ? endMonth : 12);
			month++
		) {
			const { startOfMonth, endOfMonth } = getMonthDates(year, month);
			const monthlyExpenses = await Transaction.find({
				userId,
				status: "Success",
				date: { $gte: startOfMonth, $lte: endOfMonth },
			});
			expenses.push(...monthlyExpenses);
		}
	}
	const totalExpenses = expenses.reduce(
		(acc, transaction) => acc + transaction.amount,
		0
	);
	return { totalIncome, totalExpenses };
};

const saveOrUpdateGoal = async (
	userId: string,
	goalValue: number,
	purpose: string,
	startDate: string,
	endDate: string
) => {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const formattedStartDate = new Date(start.getFullYear(), start.getMonth(), 1);
	const formattedEndDate = new Date(end.getFullYear(), end.getMonth(), 1);

	let goal = await SavingGoal.findOne({
		userId,
		startDate: { $lte: formattedEndDate },
		endDate: { $gte: formattedStartDate },
	});

	if (goal) {
		goal.goalValue = goalValue;
		goal.purpose = purpose;
		goal.startDate = formattedStartDate;
		goal.endDate = formattedEndDate;
		goal.updatedAt = new Date();
		await goal.save();
		return { updated: true, message: "Savings goal updated", data: goal };
	} else {
		const newGoal = new SavingGoal({
			userId,
			goalValue,
			purpose,
			startDate: formattedStartDate,
			endDate: formattedEndDate,
		});
		await newGoal.save();
		return { updated: false, message: "Savings goal created", data: newGoal };
	}
};

export const SavingGoalService = {
	checkExistingGoal,
	getIncomeAndExpense,
	saveOrUpdateGoal,
};
