import jwt from "jsonwebtoken";

const JWT_SECRET = "##*secret*##";

export const generateJWT = (userId: any) => {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};
