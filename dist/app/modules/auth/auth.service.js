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
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_1 = __importDefault(require("../../../config/firebase"));
dotenv_1.default.config();
const verifyFirebaseTokenAndGenerateJWT = (firebaseToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = yield firebase_1.default.auth().verifyIdToken(firebaseToken);
    const uid = decodedToken.uid;
    const jwtSecret = process.env.JWT_TOKEN || "fallback_secret";
    const jwtToken = jsonwebtoken_1.default.sign({ uid }, jwtSecret, {
        expiresIn: "4h",
    });
    return jwtToken;
});
exports.AuthService = {
    verifyFirebaseTokenAndGenerateJWT,
};
