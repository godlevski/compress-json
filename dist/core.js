"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompress = exports.decode = exports.compress = void 0;
const debug_1 = require("./debug");
const encode_1 = require("./encode");
const memory_1 = require("./memory");
function compress(o) {
    const mem = (0, memory_1.makeInMemoryMemory)();
    const root = (0, memory_1.addValue)(mem, o, undefined);
    const values = (0, memory_1.memToValues)(mem);
    return [values, root];
}
exports.compress = compress;
function decodeObject(values, s) {
    if (s === 'o|') {
        return {};
    }
    const o = {};
    const vs = s.split('|');
    const key_id = vs[1];
    let keys = decode(values, key_id);
    const n = vs.length;
    if (n - 2 === 1 && !Array.isArray(keys)) {
        // single-key object using existing value as key
        keys = [keys];
    }
    for (let i = 2; i < n; i++) {
        const k = keys[i - 2];
        let v = vs[i];
        v = decode(values, v);
        o[k] = v;
    }
    return o;
}
function decodeArray(values, s) {
    if (s === 'a|') {
        return [];
    }
    const vs = s.split('|');
    const n = vs.length - 1;
    const xs = new Array(n);
    for (let i = 0; i < n; i++) {
        let v = vs[i + 1];
        v = decode(values, v);
        xs[i] = v;
    }
    return xs;
}
function decode(values, key) {
    if (key === '' || key === '_') {
        return null;
    }
    const id = (0, encode_1.decodeKey)(key);
    const v = values[id];
    if (v === null) {
        return v;
    }
    switch (typeof v) {
        case 'undefined':
            return v;
        case 'number':
            return v;
        case 'string':
            const prefix = v[0] + v[1];
            switch (prefix) {
                case 'b|':
                    return (0, encode_1.decodeBool)(v);
                case 'o|':
                    return decodeObject(values, v);
                case 'n|':
                    return (0, encode_1.decodeNum)(v);
                case 'a|':
                    return decodeArray(values, v);
                default:
                    return (0, encode_1.decodeStr)(v);
            }
    }
    return (0, debug_1.throwUnknownDataType)(v);
}
exports.decode = decode;
function decompress(c) {
    const [values, root] = c;
    return decode(values, root);
}
exports.decompress = decompress;
