"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s_to_num = exports.int_str_to_s = exports.num_to_s = exports.big_int_to_s = exports.int_to_s = exports.s_to_big_int = exports.s_to_int = void 0;
let i_to_s = '';
for (let i = 0; i < 10; i++) {
    const c = String.fromCharCode(48 + i);
    i_to_s += c;
}
for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(65 + i);
    i_to_s += c;
}
for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(65 + 32 + i);
    i_to_s += c;
}
const N = i_to_s.length;
const s_to_i = {};
for (let i = 0; i < N; i++) {
    const s = i_to_s[i];
    s_to_i[s] = i;
}
function s_to_int(s) {
    let acc = 0;
    let pow = 1;
    for (let i = s.length - 1; i >= 0; i--) {
        const c = s[i];
        let x = s_to_i[c];
        x *= pow;
        acc += x;
        pow *= N;
    }
    return acc;
}
exports.s_to_int = s_to_int;
function s_to_big_int(s) {
    let acc = BigInt(0);
    let pow = BigInt(1);
    const n = BigInt(N);
    for (let i = s.length - 1; i >= 0; i--) {
        const c = s[i];
        let x = BigInt(s_to_i[c]);
        x *= pow;
        acc += x;
        pow *= n;
    }
    return acc;
}
exports.s_to_big_int = s_to_big_int;
function int_to_s(int) {
    if (int === 0) {
        return i_to_s[0];
    }
    const acc = [];
    while (int !== 0) {
        const i = int % N;
        const c = i_to_s[i];
        acc.push(c);
        int -= i;
        int /= N;
    }
    return acc.reverse().join('');
}
exports.int_to_s = int_to_s;
function big_int_to_s(int) {
    const zero = BigInt(0);
    const n = BigInt(N);
    if (int === zero) {
        return i_to_s[0];
    }
    const acc = [];
    while (int !== zero) {
        const i = int % n;
        const c = i_to_s[Number(i)];
        acc.push(c);
        int -= i;
        int /= n;
    }
    return acc.reverse().join('');
}
exports.big_int_to_s = big_int_to_s;
function reverse(s) {
    return s.split('').reverse().join('');
}
function num_to_s(num) {
    if (num < 0) {
        return '-' + num_to_s(-num);
    }
    let [a, b] = num.toString().split('.');
    if (!b) {
        return int_to_s(num);
    }
    let c;
    if (b) {
        [b, c] = b.split('e');
    }
    a = int_str_to_s(a);
    b = reverse(b);
    b = int_str_to_s(b);
    let str = a + '.' + b;
    if (c) {
        str += '.';
        switch (c[0]) {
            case '+':
                c = c.slice(1);
                break;
            case '-':
                str += '-';
                c = c.slice(1);
                break;
        }
        c = reverse(c);
        c = int_str_to_s(c);
        str += c;
    }
    return str;
}
exports.num_to_s = num_to_s;
function int_str_to_s(int_str) {
    const num = +int_str;
    if (num.toString() === int_str) {
        return int_to_s(num);
    }
    return ':' + big_int_to_s(BigInt(int_str));
}
exports.int_str_to_s = int_str_to_s;
function s_to_int_str(s) {
    if (s[0] === ':') {
        return s_to_big_int(s.substring(1)).toString();
    }
    return s_to_int(s).toString();
}
function s_to_num(s) {
    if (s[0] === '-') {
        return -s_to_num(s.substr(1));
    }
    let [a, b, c] = s.split('.');
    if (!b) {
        return s_to_int(a);
    }
    a = s_to_int_str(a);
    b = s_to_int_str(b);
    b = reverse(b);
    let str = a + '.' + b;
    if (c) {
        str += 'e';
        let neg = false;
        if (c[0] === '-') {
            neg = true;
            c = c.slice(1);
        }
        c = s_to_int_str(c);
        c = reverse(c);
        str += neg ? -c : +c;
    }
    return +str;
}
exports.s_to_num = s_to_num;
