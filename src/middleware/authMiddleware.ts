import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
	user?: JwtPayload | string;
	uid?: string;
}

export const verifyJWT = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): void => {
	const token = req.header("Authorization")?.replace("Bearer ", ""); // STRIPS OUT THE Bearer PREFIX, LEAVING ONLY THE TOKEN ITSELF

	if (!token) {
		res.status(401).json({ error: "Access denied. No token provided." });
		return;
	}

	try {
		const jwtSecret = process.env.JWT_TOKEN || "fallback_secret";
		const decoded: any = jwt.verify(token, jwtSecret) as JwtPayload;

		const currentTime = Math.floor(Date.now() / 1000);

		// Check if the token has expired
		if (decoded.exp < currentTime) {
			res.status(403).json({ error: "Token expired." });
			return;
		}

		req.user = decoded.uid;
		next();
	} catch (err: any) {
		res.status(403).json({ error: "Invalid token." });
	}
};
