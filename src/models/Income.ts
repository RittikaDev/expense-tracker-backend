import { Date, Document, model, Schema } from "mongoose";

interface IIncome extends Document {
	userId: string;
	category: string;
	amount: number;
	date: Date;
}

const IncomeSchema = new Schema<IIncome>({
	userId: { type: String, required: true },
	category: { type: String, required: true },
	amount: { type: Number, required: true },
	date: { type: Date, required: true },
});

export default model<IIncome>("Income", IncomeSchema);
