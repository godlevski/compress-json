"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimUndefinedRecursively = exports.trimUndefined = void 0;
function trimUndefined(object) {
    for (const key in object) {
        if (object[key] === undefined) {
            delete object[key];
        }
    }
}
exports.trimUndefined = trimUndefined;
function trimUndefinedRecursively(object) {
    trimUndefinedRecursivelyLoop(object, new Set());
}
exports.trimUndefinedRecursively = trimUndefinedRecursively;
function trimUndefinedRecursivelyLoop(object, tracks) {
    tracks.add(object);
    for (const key in object) {
        if (object[key] === undefined) {
            delete object[key];
        }
        else {
            const value = object[key];
            if (value && typeof value === 'object' && !tracks.has(value)) {
                trimUndefinedRecursivelyLoop(value, tracks);
            }
        }
    }
}
