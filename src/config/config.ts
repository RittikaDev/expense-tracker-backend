import dotenv from "dotenv";
import path from "path";

// dotenv.config();

// export const DEVELOPMENT = process.env.NODE_ENV === "development";
// export const PRODUCTION = process.env.NODE_ENV === "production";

// export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
// export const SERVER_POST = Number(process.env.SERVER_POST) || 5000;

// export const SERVER = {
// 	SERVER_HOSTNAME,
// 	SERVER_POST,
// };

dotenv.config({ path: path.join(process.cwd(), ".env") }); // ACCESSING ENV FILE

export default {
	NODE_ENV: process.env.NODE_ENV,
	port: process.env.PORT || 5000,
	database_url: process.env.DATABASE_URL,
};
