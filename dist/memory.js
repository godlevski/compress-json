"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addValue = exports.makeInMemoryMemory = exports.makeInMemoryCache = exports.makeInMemoryStore = exports.memToValues = void 0;
const config_1 = require("./config");
const debug_1 = require("./debug");
const encode_1 = require("./encode");
const number_1 = require("./number");
function memToValues(mem) {
    return mem.store.toArray();
}
exports.memToValues = memToValues;
function makeInMemoryStore() {
    const mem = [];
    return {
        forEach(cb) {
            for (let i = 0; i < mem.length; i++) {
                if (cb(mem[i]) === 'break') {
                    return;
                }
            }
        },
        add(value) {
            mem.push(value);
        },
        toArray() {
            return mem;
        },
    };
}
exports.makeInMemoryStore = makeInMemoryStore;
function makeInMemoryCache() {
    const valueMem = Object.create(null);
    const schemaMem = Object.create(null);
    return {
        getValue(key) {
            return valueMem[key];
        },
        getSchema(key) {
            return schemaMem[key];
        },
        forEachValue(cb) {
            for (const [key, value] of Object.entries(valueMem)) {
                if (cb(key, value) === 'break') {
                    return;
                }
            }
        },
        forEachSchema(cb) {
            for (const [key, value] of Object.entries(schemaMem)) {
                if (cb(key, value) === 'break') {
                    return;
                }
            }
        },
        setValue(key, value) {
            valueMem[key] = value;
        },
        setSchema(key, value) {
            schemaMem[key] = value;
        },
        hasValue(key) {
            return key in valueMem;
        },
        hasSchema(key) {
            return key in schemaMem;
        },
    };
}
exports.makeInMemoryCache = makeInMemoryCache;
function makeInMemoryMemory() {
    return {
        store: makeInMemoryStore(),
        cache: makeInMemoryCache(),
        keyCount: 0,
    };
}
exports.makeInMemoryMemory = makeInMemoryMemory;
function getValueKey(mem, value) {
    if (mem.cache.hasValue(value)) {
        return mem.cache.getValue(value);
    }
    const id = mem.keyCount++;
    const key = (0, number_1.num_to_s)(id);
    mem.store.add(value);
    mem.cache.setValue(value, key);
    return key;
}
/** @remark in-place sort the keys */
function getSchema(mem, keys) {
    if (config_1.config.sort_key) {
        keys.sort();
    }
    const schema = keys.join(',');
    if (mem.cache.hasSchema(schema)) {
        return mem.cache.getSchema(schema);
    }
    const key_id = addValue(mem, keys, undefined);
    mem.cache.setSchema(schema, key_id);
    return key_id;
}
function addValue(mem, o, parent) {
    if (o === null) {
        return '';
    }
    // eliminate functions and classes
    if (o !== undefined) {
        const constructorName = (o).constructor?.name;
        switch (constructorName) {
            // pass if one of theses classes
            case 'Number':
            case 'String':
            case 'Object':
            case 'Array':
            case 'Boolean':
                break;
            // stringify or null out otherwise
            default:
                return constructorName ? getValueKey(mem, (0, encode_1.encodeStr)(constructorName)) : addValue(mem, null, parent);
        }
    }
    switch (typeof o) {
        case 'undefined':
            if (Array.isArray(parent)) {
                return addValue(mem, null, parent);
            }
            break;
        case 'object':
            if (o === null) {
                return getValueKey(mem, null);
            }
            if (Array.isArray(o)) {
                let acc = 'a';
                for (let i = 0; i < o.length; i++) {
                    const v = o[i];
                    const key = v === null ? '_' : addValue(mem, v, o);
                    acc += '|' + key;
                }
                if (acc === 'a') {
                    acc = 'a|';
                }
                return getValueKey(mem, acc);
            }
            else {
                const keys = Object.keys(o);
                if (keys.length === 0) {
                    return getValueKey(mem, 'o|');
                }
                let acc = 'o';
                const key_id = getSchema(mem, keys);
                acc += '|' + key_id;
                for (const key of keys) {
                    const value = o[key];
                    const v = addValue(mem, value, o);
                    acc += '|' + v;
                }
                return getValueKey(mem, acc);
            }
        case 'boolean':
            return getValueKey(mem, (0, encode_1.encodeBool)(o));
        case 'number':
            return getValueKey(mem, (0, encode_1.encodeNum)(o));
        case 'string':
            return getValueKey(mem, (0, encode_1.encodeStr)(o));
    }
    return (0, debug_1.throwUnknownDataType)(o);
}
exports.addValue = addValue;
