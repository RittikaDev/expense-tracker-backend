import express, { Request, Response, Router } from "express";
import admin from "../config/firebase";
import jwt from "jsonwebtoken";

require("dotenv").config();

const router: Router = express.Router();

interface AuthRequest extends Request {
	body: {
		token: string;
	};
}

router.post("/", async (req: AuthRequest, res: Response) => {
	const firebaseToken = req.body.token;

	try {
		const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
		const uid = decodedToken.uid;

		const jwtSecret = process.env.JWT_TOKEN || "fallback_secret";
		const jwtToken = jwt.sign({ uid: uid }, jwtSecret, {
			expiresIn: "1h",
		});
		res.json({ token: jwtToken });
	} catch (error) {
		res.status(401).json({ error: "Invalid Firebase token" });
	}
});

export default router;
