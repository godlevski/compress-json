"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeStr = exports.encodeStr = exports.decodeBool = exports.encodeBool = exports.decodeKey = exports.decodeNum = exports.encodeNum = void 0;
const number_1 = require("./number");
function encodeNum(num) {
    const a = 'n|' + (0, number_1.num_to_s)(num);
    return a;
    // let b = num.toString()
    // return a.length < b.length ? a : num
}
exports.encodeNum = encodeNum;
function decodeNum(s) {
    s = s.replace('n|', '');
    return (0, number_1.s_to_num)(s);
}
exports.decodeNum = decodeNum;
function decodeKey(key) {
    return typeof key === 'number' ? key : (0, number_1.s_to_int)(key);
}
exports.decodeKey = decodeKey;
function encodeBool(b) {
    // return 'b|' + bool_to_s(b)
    return b ? 'b|T' : 'b|F';
}
exports.encodeBool = encodeBool;
function decodeBool(s) {
    switch (s) {
        case 'b|T':
            return true;
        case 'b|F':
            return false;
    }
    return !!s;
}
exports.decodeBool = decodeBool;
function encodeStr(str) {
    const prefix = str[0] + str[1];
    switch (prefix) {
        case 'b|':
        case 'o|':
        case 'n|':
        case 'a|':
        case 's|':
            str = 's|' + str;
    }
    return str;
}
exports.encodeStr = encodeStr;
function decodeStr(s) {
    const prefix = s[0] + s[1];
    return prefix === 's|' ? s.substr(2) : s;
}
exports.decodeStr = decodeStr;
