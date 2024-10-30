"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const AuthenticateRoute_1 = __importDefault(require("./routes/AuthenticateRoute"));
const IncomeRoute_1 = __importDefault(require("./routes/IncomeRoute"));
const BudgetRoute_1 = __importDefault(require("./routes/BudgetRoute"));
const TransactionRoute_1 = __importDefault(require("./routes/TransactionRoute"));
const SavingGoalRoute_1 = __importDefault(require("./routes/SavingGoalRoute"));
require("dotenv").config();
const app = (0, express_1.default)();
// MIDDLEWARE
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbClusterUrl = process.env.DB_CLUSTER_URL;
const dbDatabaseName = process.env.DB_DATABASE_NAME;
// CONNECTING TO MongoDB
mongoose_1.default
    .connect(`mongodb+srv://${dbUsername}:${dbPassword}@${dbClusterUrl}/${dbDatabaseName}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
// ROUTES
app.use("/api/authenticate", AuthenticateRoute_1.default);
app.use("/api/income", IncomeRoute_1.default);
app.use("/api/budgets", BudgetRoute_1.default);
app.use("/api/transactions", TransactionRoute_1.default);
app.use("/api/savinggoal", SavingGoalRoute_1.default);
app.get("/", (req, res) => {
    res.send("API is running");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
