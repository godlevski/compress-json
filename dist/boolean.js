"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.bool_to_s = exports.s_to_bool = void 0;
function s_to_bool(s) {
    switch (s) {
        case 'T':
            return true;
        case 'F':
            return false;
    }
    return !!s;
}
exports.s_to_bool = s_to_bool;
function bool_to_s(bool) {
    return bool ? 'T' : 'F';
}
exports.bool_to_s = bool_to_s;
function test() {
    console.log({
        true: bool_to_s(true),
        false: bool_to_s(false),
        T: s_to_bool('T'),
        F: s_to_bool('F'),
    });
}
exports.test = test;
// test()
