"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER = exports.SERVER_POST = exports.SERVER_HOSTNAME = exports.PRODUCTION = exports.DEVELOPMENT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.DEVELOPMENT = process.env.NODE_ENV === "development";
exports.PRODUCTION = process.env.NODE_ENV === "production";
exports.SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
exports.SERVER_POST = Number(process.env.SERVER_POST) || 5000;
exports.SERVER = {
    SERVER_HOSTNAME: exports.SERVER_HOSTNAME,
    SERVER_POST: exports.SERVER_POST,
};
