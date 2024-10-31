"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_1 = __importDefault(require("../config/firebase"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firebaseToken = req.body.token;
    try {
        const decodedToken = yield firebase_1.default.auth().verifyIdToken(firebaseToken);
        const uid = decodedToken.uid;
        const jwtSecret = process.env.JWT_TOKEN || "fallback_secret";
        const jwtToken = jsonwebtoken_1.default.sign({ uid: uid }, jwtSecret, {
            expiresIn: "4h",
        });
        res.json({ token: jwtToken });
    }
    catch (error) {
        res.status(401).json({ error: "Invalid Firebase token" });
    }
}));
exports.default = router;
