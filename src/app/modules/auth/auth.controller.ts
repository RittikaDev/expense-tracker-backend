import { Request, Response } from "express";
import { AuthService } from "./auth.service";

interface AuthRequest extends Request {
	body: {
		token: string;
	};
}

const authenticateUser = async (req: AuthRequest, res: Response) => {
	const firebaseToken = req.body.token;

	try {
		const jwtToken = await AuthService.verifyFirebaseTokenAndGenerateJWT(
			firebaseToken
		);
		res.json({ token: jwtToken });
	} catch (error) {
		res.status(401).json({ error: "Invalid Firebase token" });
	}
};

export const AuthControllers = {
	authenticateUser,
};
