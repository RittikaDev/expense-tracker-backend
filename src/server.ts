import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import AuthenticateRoute from "./routes/AuthenticateRoute";
import incomeRoutes from "./routes/IncomeRoute";
import budgetRoutes from "./routes/BudgetRoute";
import transactionRoutes from "./routes/TransactionRoute";

require("dotenv").config();

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbClusterUrl = process.env.DB_CLUSTER_URL;
const dbDatabaseName = process.env.DB_DATABASE_NAME;

// CONNECTING TO MongoDB
mongoose
	.connect(
		`mongodb+srv://${dbUsername}:${dbPassword}@${dbClusterUrl}/${dbDatabaseName}?retryWrites=true&w=majority&appName=Cluster0`
	)
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log(err));

// ROUTES
app.use("/api/authenticate", AuthenticateRoute);
app.use("/api/income", incomeRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/transactions", transactionRoutes);
app.get("/", (req, res) => {
	res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
