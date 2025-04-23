import cors from "cors";
import express, { Application, Request, Response } from "express";

import cookieParser from "cookie-parser";

import router from "./app/routes";

const app: Application = express();

// PARSERS
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: ["https://expense-tracker-29842.web.app", "http://localhost:4202"],
		credentials: true,
	})
);

// ROUTES
app.use("/api/", router);

app.get("/", (req: Request, res: Response) => {
	res.send("Welcome to Expense Tracker api server!");
});

// app.use(globalErrorHandler);
// app.use(notFound);

export default app;
