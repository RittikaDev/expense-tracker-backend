"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const et_firebase_service_account_json_1 = __importDefault(require("../../firebase-config/et-firebase-service-account.json"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(et_firebase_service_account_json_1.default),
    databaseURL: "https://expense-tracker-29842-default-rtdb.firebaseio.com/",
});
exports.default = firebase_admin_1.default;
