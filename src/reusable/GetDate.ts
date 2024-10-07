export const getCurrentMonthRange = () => {
	const startOfMonth = new Date(
		new Date().getFullYear(),
		new Date().getMonth(),
		1
	);
	const endOfMonth = new Date(
		new Date().getFullYear(),
		new Date().getMonth() + 1,
		0
	);
	return { startOfMonth, endOfMonth };
};

export const getPreviousMonthRange = () => {
	const today = new Date();
	const startOfPreviousMonth = new Date(
		today.getFullYear(),
		today.getMonth() - 1,
		1
	);
	const endOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
	return { startOfPreviousMonth, endOfPreviousMonth };
};
