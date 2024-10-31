"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreviousMonthRange = exports.getCurrentMonthRange = void 0;
const getCurrentMonthRange = () => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    return { startOfMonth, endOfMonth };
};
exports.getCurrentMonthRange = getCurrentMonthRange;
const getPreviousMonthRange = () => {
    const today = new Date();
    const startOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    return { startOfPreviousMonth, endOfPreviousMonth };
};
exports.getPreviousMonthRange = getPreviousMonthRange;
