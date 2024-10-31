"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", ""); // STRIPS OUT THE Bearer PREFIX, LEAVING ONLY THE TOKEN ITSELF
    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return;
    }
    try {
        const jwtSecret = process.env.JWT_TOKEN || "fallback_secret";
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const currentTime = Math.floor(Date.now() / 1000);
        // Check if the token has expired
        if (decoded.exp < currentTime) {
            res.status(403).json({ error: "Token expired." });
            return;
        }
        req.user = decoded.uid;
        next();
    }
    catch (err) {
        res.status(403).json({ error: "Invalid token." });
    }
};
exports.verifyJWT = verifyJWT;
