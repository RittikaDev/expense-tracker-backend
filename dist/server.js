"use strict";
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import AuthenticateRoute from "./routes/AuthenticateRoute";
// import incomeRoutes from "./routes/IncomeRoute";
// import budgetRoutes from "./routes/BudgetRoute";
// import transactionRoutes from "./routes/TransactionRoute";
// import savingGoalRoutes from "./routes/SavingGoalRoute";
// require("dotenv").config();
// const app = express();
// // MIDDLEWARE
// app.use(express.json());
// app.use(cors());
// const dbUsername = process.env.DB_USERNAME;
// const dbPassword = process.env.DB_PASSWORD;
// const dbClusterUrl = process.env.DB_CLUSTER_URL;
// const dbDatabaseName = process.env.DB_DATABASE_NAME;
// // CONNECTING TO MongoDB
// mongoose
// 	.connect(
// 		`mongodb+srv://${dbUsername}:${dbPassword}@${dbClusterUrl}/${dbDatabaseName}?retryWrites=true&w=majority&appName=Cluster0`
// 	)
// 	.then(() => console.log("MongoDB Connected"))
// 	.catch((err) => console.log(err));
// // ROUTES
// app.use("/api/authenticate", AuthenticateRoute);
// app.use("/api/income", incomeRoutes);
// app.use("/api/budgets", budgetRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/savinggoal", savingGoalRoutes);
// app.get("/", (req, res) => {
// 	res.send("API is running");
// });
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
// 	console.log(`Server running on port ${PORT}`);
// });
/* eslint-disable no-console */
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            app_1.default.listen(config_1.default.port, () => {
                console.log(`Expense Tracker app is listening on port ${config_1.default.port}`);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
main();
