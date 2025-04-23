import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import admin from "../../../config/firebase";

dotenv.config();

const verifyFirebaseTokenAndGenerateJWT = async (
	firebaseToken: string
): Promise<string> => {
	const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
	const uid = decodedToken.uid;
	const jwtSecret = process.env.JWT_TOKEN || "fallback_secret";
	const jwtToken = jwt.sign({ uid }, jwtSecret, {
		expiresIn: "4h",
	});
	return jwtToken;
};

export const AuthService = {
	verifyFirebaseTokenAndGenerateJWT,
};
