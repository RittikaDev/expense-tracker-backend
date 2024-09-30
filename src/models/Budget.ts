import { Schema, model, Document } from "mongoose";

interface IBudget extends Document {
	category: string;
	budget: number;
	date: Date;
}

const BudgetSchema = new Schema<IBudget>({
	category: {
		type: String,
		required: true,
	},
	budget: {
		type: Number,
		required: true,
	},
	date: { type: Date, required: true },
});

export default model<IBudget>("Budget", BudgetSchema); // MONGOOSE DOES AUTOMATIC PLURALIZATION OF MODEL NAMES, TO AVOID THIS, A THIRD ARGUMENT CAN BE PASSED IN THE MODEL FUNCTION
