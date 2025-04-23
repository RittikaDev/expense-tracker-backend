"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
// PARSERS
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["https://expense-tracker-29842.web.app", "http://localhost:4202"],
    credentials: true,
}));
// ROUTES
app.use("/api/", routes_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to Expense Tracker api server!");
});
// app.use(globalErrorHandler);
// app.use(notFound);
exports.default = app;
