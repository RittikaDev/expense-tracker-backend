import Transaction from "../../../models/Transaction";

interface ITransaction {
	userId: string;
	category: string;
	amount: number;
	date: Date;
	status: string;
}

const getAll = async (userId: string) => {
	return await Transaction.find({ userId });
};

const getByMonth = async (userId: string, year: number, month: number) => {
	const startOfMonth = new Date(year, month - 1, 1);
	const startOfNextMonth = new Date(year, month, 1);

	return await Transaction.find({
		userId,
		date: { $gte: startOfMonth, $lt: startOfNextMonth },
	});
};

const addMany = async (userId: string, transactions: ITransaction[]) => {
	const transactionsWithUserId = transactions.map((t) => ({
		...t,
		userId,
	}));

	return await Transaction.insertMany(transactionsWithUserId);
};

const getTotalExpenses = async (
	userId: string,
	startDate: Date,
	endDate: Date
) => {
	const transactions = await Transaction.find({
		userId,
		status: "Success",
		date: { $gte: startDate, $lte: endDate },
	});

	return transactions.reduce((acc, t) => acc + t.amount, 0);
};

export const TransactionService = {
	getAll,
	getByMonth,
	addMany,
	getTotalExpenses,
};
