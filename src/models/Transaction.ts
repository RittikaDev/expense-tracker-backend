import { Date, Document, model, Schema } from "mongoose";

interface ITransaction extends Document {
	category: string;
	amount: number;
	date: Date;
	status: string;
}

const TransactionSchema = new Schema<ITransaction>({
	category: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
});

export default model<ITransaction>("Transaction", TransactionSchema);
