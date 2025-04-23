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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const auth_service_1 = require("./auth.service");
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firebaseToken = req.body.token;
    try {
        const jwtToken = yield auth_service_1.AuthService.verifyFirebaseTokenAndGenerateJWT(firebaseToken);
        res.json({ token: jwtToken });
    }
    catch (error) {
        res.status(401).json({ error: "Invalid Firebase token" });
    }
});
exports.AuthControllers = {
    authenticateUser,
};
