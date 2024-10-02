import { Date, Document, model, Schema } from "mongoose";

interface ITransaction extends Document {
	userId: string;
	category: string;
	amount: number;
	date: Date;
	status: string;
}

const TransactionSchema = new Schema<ITransaction>({
	userId: { type: String, required: true },
	category: { type: String, required: true },
	amount: { type: Number, required: true },
	date: { type: Date, required: true },
	status: { type: String, required: true },
});

export default model<ITransaction>("Transaction", TransactionSchema);
