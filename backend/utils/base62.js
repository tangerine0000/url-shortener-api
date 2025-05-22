const BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function toBase62(num) {
    if (num === 0) {
        return "0";  
    }
    let remainder;
    let result = "";
    while (num > 0) {
        remainder = num % 62;
        result = BASE62_CHARS[remainder] + result;
        num = Math.floor(num/62);
    }
    return result;
};

function fromBase62(str) {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
        num = num * 62 + BASE62_CHARS.indexOf(str[i]);
    }
    return num;
}

module.exports = { toBase62, fromBase62 };