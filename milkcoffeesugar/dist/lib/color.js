import { clamp } from "./util.js";
import RNG from "./rng.js";
export function fromString(str) {
    var cached, r;
    if (str in CACHE) {
        cached = CACHE[str];
    }
    else {
        if (str.charAt(0) == "#") { // hex rgb
            var matched = str.match(/[0-9a-f]/gi) || [];
            var values = matched.map(function (x) { return parseInt(x, 16); });
            if (values.length == 3) {
                cached = values.map(function (x) { return x * 17; });
            }
            else {
                for (var i_1 = 0; i_1 < 3; i_1++) {
                    values[i_1 + 1] += 16 * values[i_1];
                    values.splice(i_1, 1);
                }
                cached = values;
            }
        }
        else if ((r = str.match(/rgb\(([0-9, ]+)\)/i))) { // decimal rgb
            cached = r[1].split(/\s*,\s*/).map(function (x) { return parseInt(x); });
        }
        else { // html name
            cached = [0, 0, 0];
        }
        CACHE[str] = cached;
    }
    return cached.slice();
}
/**
 * Add two or more colors
 */
export function add(color1) {
    var colors = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        colors[_i - 1] = arguments[_i];
    }
    var result = color1.slice();
    for (var i_2 = 0; i_2 < 3; i_2++) {
        for (var j_1 = 0; j_1 < colors.length; j_1++) {
            result[i_2] += colors[j_1][i_2];
        }
    }
    return result;
}
/**
 * Add two or more colors, MODIFIES FIRST ARGUMENT
 */
export function add_(color1) {
    var colors = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        colors[_i - 1] = arguments[_i];
    }
    for (var i_3 = 0; i_3 < 3; i_3++) {
        for (var j_2 = 0; j_2 < colors.length; j_2++) {
            color1[i_3] += colors[j_2][i_3];
        }
    }
    return color1;
}
/**
 * Multiply (mix) two or more colors
 */
export function multiply(color1) {
    var colors = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        colors[_i - 1] = arguments[_i];
    }
    var result = color1.slice();
    for (var i_4 = 0; i_4 < 3; i_4++) {
        for (var j_3 = 0; j_3 < colors.length; j_3++) {
            result[i_4] *= colors[j_3][i_4] / 255;
        }
        result[i_4] = Math.round(result[i_4]);
    }
    return result;
}
/**
 * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
 */
export function multiply_(color1) {
    var colors = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        colors[_i - 1] = arguments[_i];
    }
    for (var i_5 = 0; i_5 < 3; i_5++) {
        for (var j_4 = 0; j_4 < colors.length; j_4++) {
            color1[i_5] *= colors[j_4][i_5] / 255;
        }
        color1[i_5] = Math.round(color1[i_5]);
    }
    return color1;
}
/**
 * Interpolate (blend) two colors with a given factor
 */
export function interpolate(color1, color2, factor) {
    if (factor === void 0) { factor = 0.5; }
    var result = color1.slice();
    for (var i_6 = 0; i_6 < 3; i_6++) {
        result[i_6] = Math.round(result[i_6] + factor * (color2[i_6] - color1[i_6]));
    }
    return result;
}
export var lerp = interpolate;
/**
 * Interpolate (blend) two colors with a given factor in HSL mode
 */
export function interpolateHSL(color1, color2, factor) {
    if (factor === void 0) { factor = 0.5; }
    var hsl1 = rgb2hsl(color1);
    var hsl2 = rgb2hsl(color2);
    for (var i_7 = 0; i_7 < 3; i_7++) {
        hsl1[i_7] += factor * (hsl2[i_7] - hsl1[i_7]);
    }
    return hsl2rgb(hsl1);
}
export var lerpHSL = interpolateHSL;
/**
 * Create a new random color based on this one
 * @param color
 * @param diff Set of standard deviations
 */
export function randomize(color, diff) {
    if (!(diff instanceof Array)) {
        diff = Math.round(RNG.getNormal(0, diff));
    }
    var result = color.slice();
    for (var i_8 = 0; i_8 < 3; i_8++) {
        result[i_8] += (diff instanceof Array ? Math.round(RNG.getNormal(0, diff[i_8])) : diff);
    }
    return result;
}
/**
 * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
 */
export function rgb2hsl(color) {
    var r = color[0] / 255;
    var g = color[1] / 255;
    var b = color[2] / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h = 0, s, l = (max + min) / 2;
    if (max == min) {
        s = 0; // achromatic
    }
    else {
        var d_1 = max - min;
        s = (l > 0.5 ? d_1 / (2 - max - min) : d_1 / (max + min));
        switch (max) {
            case r:
                h = (g - b) / d_1 + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d_1 + 2;
                break;
            case b:
                h = (r - g) / d_1 + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l];
}
function hue2rgb(p, q, t) {
    if (t < 0)
        t += 1;
    if (t > 1)
        t -= 1;
    if (t < 1 / 6)
        return p + (q - p) * 6 * t;
    if (t < 1 / 2)
        return q;
    if (t < 2 / 3)
        return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
/**
 * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
 */
export function hsl2rgb(color) {
    var l = color[2];
    if (color[1] == 0) {
        l = Math.round(l * 255);
        return [l, l, l];
    }
    else {
        var s = color[1];
        var q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
        var p_1 = 2 * l - q;
        var r = hue2rgb(p_1, q, color[0] + 1 / 3);
        var g = hue2rgb(p_1, q, color[0]);
        var b = hue2rgb(p_1, q, color[0] - 1 / 3);
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
}
export function toRGB(color) {
    var clamped = color.map(function (x) { return clamp(x, 0, 255); });
    return "rgb(".concat(clamped.join(","), ")");
}
export function toHex(color) {
    var clamped = color.map(function (x) { return clamp(x, 0, 255).toString(16).padStart(2, "0"); });
    return "#".concat(clamped.join(""));
}
var CACHE = {
    "black": [0, 0, 0],
    "navy": [0, 0, 128],
    "darkblue": [0, 0, 139],
    "mediumblue": [0, 0, 205],
    "blue": [0, 0, 255],
    "darkgreen": [0, 100, 0],
    "green": [0, 128, 0],
    "teal": [0, 128, 128],
    "darkcyan": [0, 139, 139],
    "deepskyblue": [0, 191, 255],
    "darkturquoise": [0, 206, 209],
    "mediumspringgreen": [0, 250, 154],
    "lime": [0, 255, 0],
    "springgreen": [0, 255, 127],
    "aqua": [0, 255, 255],
    "cyan": [0, 255, 255],
    "midnightblue": [25, 25, 112],
    "dodgerblue": [30, 144, 255],
    "forestgreen": [34, 139, 34],
    "seagreen": [46, 139, 87],
    "darkslategray": [47, 79, 79],
    "darkslategrey": [47, 79, 79],
    "limegreen": [50, 205, 50],
    "mediumseagreen": [60, 179, 113],
    "turquoise": [64, 224, 208],
    "royalblue": [65, 105, 225],
    "steelblue": [70, 130, 180],
    "darkslateblue": [72, 61, 139],
    "mediumturquoise": [72, 209, 204],
    "indigo": [75, 0, 130],
    "darkolivegreen": [85, 107, 47],
    "cadetblue": [95, 158, 160],
    "cornflowerblue": [100, 149, 237],
    "mediumaquamarine": [102, 205, 170],
    "dimgray": [105, 105, 105],
    "dimgrey": [105, 105, 105],
    "slateblue": [106, 90, 205],
    "olivedrab": [107, 142, 35],
    "slategray": [112, 128, 144],
    "slategrey": [112, 128, 144],
    "lightslategray": [119, 136, 153],
    "lightslategrey": [119, 136, 153],
    "mediumslateblue": [123, 104, 238],
    "lawngreen": [124, 252, 0],
    "chartreuse": [127, 255, 0],
    "aquamarine": [127, 255, 212],
    "maroon": [128, 0, 0],
    "purple": [128, 0, 128],
    "olive": [128, 128, 0],
    "gray": [128, 128, 128],
    "grey": [128, 128, 128],
    "skyblue": [135, 206, 235],
    "lightskyblue": [135, 206, 250],
    "blueviolet": [138, 43, 226],
    "darkred": [139, 0, 0],
    "darkmagenta": [139, 0, 139],
    "saddlebrown": [139, 69, 19],
    "darkseagreen": [143, 188, 143],
    "lightgreen": [144, 238, 144],
    "mediumpurple": [147, 112, 216],
    "darkviolet": [148, 0, 211],
    "palegreen": [152, 251, 152],
    "darkorchid": [153, 50, 204],
    "yellowgreen": [154, 205, 50],
    "sienna": [160, 82, 45],
    "brown": [165, 42, 42],
    "darkgray": [169, 169, 169],
    "darkgrey": [169, 169, 169],
    "lightblue": [173, 216, 230],
    "greenyellow": [173, 255, 47],
    "paleturquoise": [175, 238, 238],
    "lightsteelblue": [176, 196, 222],
    "powderblue": [176, 224, 230],
    "firebrick": [178, 34, 34],
    "darkgoldenrod": [184, 134, 11],
    "mediumorchid": [186, 85, 211],
    "rosybrown": [188, 143, 143],
    "darkkhaki": [189, 183, 107],
    "silver": [192, 192, 192],
    "mediumvioletred": [199, 21, 133],
    "indianred": [205, 92, 92],
    "peru": [205, 133, 63],
    "chocolate": [210, 105, 30],
    "tan": [210, 180, 140],
    "lightgray": [211, 211, 211],
    "lightgrey": [211, 211, 211],
    "palevioletred": [216, 112, 147],
    "thistle": [216, 191, 216],
    "orchid": [218, 112, 214],
    "goldenrod": [218, 165, 32],
    "crimson": [220, 20, 60],
    "gainsboro": [220, 220, 220],
    "plum": [221, 160, 221],
    "burlywood": [222, 184, 135],
    "lightcyan": [224, 255, 255],
    "lavender": [230, 230, 250],
    "darksalmon": [233, 150, 122],
    "violet": [238, 130, 238],
    "palegoldenrod": [238, 232, 170],
    "lightcoral": [240, 128, 128],
    "khaki": [240, 230, 140],
    "aliceblue": [240, 248, 255],
    "honeydew": [240, 255, 240],
    "azure": [240, 255, 255],
    "sandybrown": [244, 164, 96],
    "wheat": [245, 222, 179],
    "beige": [245, 245, 220],
    "whitesmoke": [245, 245, 245],
    "mintcream": [245, 255, 250],
    "ghostwhite": [248, 248, 255],
    "salmon": [250, 128, 114],
    "antiquewhite": [250, 235, 215],
    "linen": [250, 240, 230],
    "lightgoldenrodyellow": [250, 250, 210],
    "oldlace": [253, 245, 230],
    "red": [255, 0, 0],
    "fuchsia": [255, 0, 255],
    "magenta": [255, 0, 255],
    "deeppink": [255, 20, 147],
    "orangered": [255, 69, 0],
    "tomato": [255, 99, 71],
    "hotpink": [255, 105, 180],
    "coral": [255, 127, 80],
    "darkorange": [255, 140, 0],
    "lightsalmon": [255, 160, 122],
    "orange": [255, 165, 0],
    "lightpink": [255, 182, 193],
    "pink": [255, 192, 203],
    "gold": [255, 215, 0],
    "peachpuff": [255, 218, 185],
    "navajowhite": [255, 222, 173],
    "moccasin": [255, 228, 181],
    "bisque": [255, 228, 196],
    "mistyrose": [255, 228, 225],
    "blanchedalmond": [255, 235, 205],
    "papayawhip": [255, 239, 213],
    "lavenderblush": [255, 240, 245],
    "seashell": [255, 245, 238],
    "cornsilk": [255, 248, 220],
    "lemonchiffon": [255, 250, 205],
    "floralwhite": [255, 250, 240],
    "snow": [255, 250, 250],
    "yellow": [255, 255, 0],
    "lightyellow": [255, 255, 224],
    "ivory": [255, 255, 240],
    "white": [255, 255, 255]
};
//# sourceMappingURL=color.js.map