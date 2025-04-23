import Income from "../../../models/Income";
import {
	getCurrentMonthRange,
	getPreviousMonthRange,
} from "../../../reusable/GetDate";

const addIncomeEntry = async ({
	category,
	amount,
	date,
	userId,
}: {
	category: string;
	amount: number;
	date: Date;
	userId: string;
}) => {
	const newIncome = new Income({ category, amount, date, userId });
	console.log(newIncome);
	await newIncome.save();
	return newIncome;
};

const getAllIncome = async (userId: string) => {
	return await Income.find({ userId });
};

const getMonthlyIncome = async (
	userId: string,
	year: number,
	month: number
) => {
	const startOfMonth = new Date(year, month - 1, 1);
	const startOfNextMonth = new Date(year, month, 1);

	const income = await Income.find({
		userId,
		date: { $gte: startOfMonth, $lt: startOfNextMonth },
	});

	return income.map((entry) => ({
		category: entry.category,
		amount: entry.amount,
		date: entry.date,
	}));
};

const compareMonthlyIncome = async (userId: string) => {
	const { startOfMonth, endOfMonth } = getCurrentMonthRange();
	const { startOfPreviousMonth, endOfPreviousMonth } = getPreviousMonthRange();

	const currentIncome = await Income.find({
		userId,
		date: { $gte: startOfMonth, $lte: endOfMonth },
	});
	const totalCurrentIncome = currentIncome.reduce(
		(acc, inc) => acc + inc.amount,
		0
	);

	const previousIncome = await Income.find({
		userId,
		date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
	});
	const totalPreviousIncome = previousIncome.reduce(
		(acc, inc) => acc + inc.amount,
		0
	);

	return {
		totalCurrentIncome,
		totalPreviousIncome,
	};
};

export const IncomeService = {
	addIncomeEntry,
	getAllIncome,
	getMonthlyIncome,
	compareMonthlyIncome,
};
