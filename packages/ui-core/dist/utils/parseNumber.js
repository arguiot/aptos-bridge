"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegExp = exports.parseNumber = exports.tryParseNumber = void 0;
function formatUserInput(value) {
    value = value.replace(/,/g, '.');
    // if (value.startsWith("0") && value[1] !== ".") {
    //   value = value.slice(1);
    // }
    return value;
}
const tryParseNumber = (value) => {
    const nextUserInput = formatUserInput(value);
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        return nextUserInput;
    }
    return undefined;
};
exports.tryParseNumber = tryParseNumber;
const parseNumber = (value) => {
    const number = (0, exports.tryParseNumber)(value);
    if (!number)
        throw new Error(`Value "${value}" is invalid number`);
    return number;
};
exports.parseNumber = parseNumber;
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
