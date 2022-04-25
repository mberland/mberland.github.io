/**
 * Always positive modulus
 * @param x Operand
 * @param n Modulus
 * @returns x modulo n
 */
export function mod(x, n) {
    return (x % n + n) % n;
}
export function clamp(val, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    if (val < min)
        return min;
    if (val > max)
        return max;
    return val;
}
export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
}
/**
 * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
 * @param {string} template
 * @param {any} [argv]
 */
export function format(template) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var map = format.map;
    var replacer = function (match, group1, group2, index) {
        if (template.charAt(index - 1) == "%") {
            return match.substring(1);
        }
        if (!args.length) {
            return match;
        }
        var obj = args[0];
        var group = group1 || group2;
        var parts = group.split(",");
        var name = parts.shift() || "";
        var method = map[name.toLowerCase()];
        if (!method) {
            return match;
        }
        obj = args.shift();
        var replaced = obj[method].apply(obj, parts);
        var first = name.charAt(0);
        if (first != first.toLowerCase()) {
            replaced = capitalize(replaced);
        }
        return replaced;
    };
    return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
}
format.map = {
    "s": "toString"
};
//# sourceMappingURL=util.js.map