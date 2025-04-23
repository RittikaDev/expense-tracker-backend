"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// dotenv.config();
// export const DEVELOPMENT = process.env.NODE_ENV === "development";
// export const PRODUCTION = process.env.NODE_ENV === "production";
// export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
// export const SERVER_POST = Number(process.env.SERVER_POST) || 5000;
// export const SERVER = {
// 	SERVER_HOSTNAME,
// 	SERVER_POST,
// };
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") }); // ACCESSING ENV FILE
exports.default = {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
};
