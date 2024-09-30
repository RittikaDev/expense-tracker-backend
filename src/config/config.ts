import dotenv from "dotenv";

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === "development";
export const PRODUCTION = process.env.NODE_ENV === "production";

export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
export const SERVER_POST = Number(process.env.SERVER_POST) || 5000;

export const SERVER = {
	SERVER_HOSTNAME,
	SERVER_POST,
};
