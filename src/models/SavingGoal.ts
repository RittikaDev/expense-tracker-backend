import { Schema, model, Document } from "mongoose";

interface ISavingsGoal extends Document {
	userId: string;
	goalValue: number;
	purpose: string;
	startDate: Date;
	endDate: Date;
	createdAt?: Date;
	updatedAt?: Date;
}

const SavingsGoalSchema = new Schema<ISavingsGoal>({
	userId: { type: String, required: true },
	goalValue: { type: Number, required: true },
	purpose: { type: String, required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

// Exporting the model, passing "SavingsGoal" as the model name.
// Mongoose will automatically pluralize it unless a third argument is passed.
export default model<ISavingsGoal>("SavingsGoal", SavingsGoalSchema);
