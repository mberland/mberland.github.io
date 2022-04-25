var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Backend from "./backend.js";
import * as Color from "../color.js";
function clearToAnsi(bg) {
    return "\u001B[0;48;5;".concat(termcolor(bg), "m\u001B[2J");
}
function colorToAnsi(fg, bg) {
    return "\u001B[0;38;5;".concat(termcolor(fg), ";48;5;").concat(termcolor(bg), "m");
}
function positionToAnsi(x, y) {
    return "\u001B[".concat(y + 1, ";").concat(x + 1, "H");
}
function termcolor(color) {
    var SRC_COLORS = 256.0;
    var DST_COLORS = 6.0;
    var COLOR_RATIO = DST_COLORS / SRC_COLORS;
    var rgb = Color.fromString(color);
    var r = Math.floor(rgb[0] * COLOR_RATIO);
    var g = Math.floor(rgb[1] * COLOR_RATIO);
    var b = Math.floor(rgb[2] * COLOR_RATIO);
    return r * 36 + g * 6 + b * 1 + 16;
}
var Term = /** @class */ (function (_super) {
    __extends(Term, _super);
    function Term() {
        var _this = _super.call(this) || this;
        _this._offset = [0, 0];
        _this._cursor = [-1, -1];
        _this._lastColor = "";
        return _this;
    }
    Term.prototype.schedule = function (cb) { setTimeout(cb, 1000 / 60); };
    Term.prototype.setOptions = function (options) {
        _super.prototype.setOptions.call(this, options);
        var size = [options.width, options.height];
        var avail = this.computeSize();
        this._offset = avail.map(function (val, index) { return Math.floor((val - size[index]) / 2); });
    };
    Term.prototype.clear = function () {
        process.stdout.write(clearToAnsi(this._options.bg));
    };
    Term.prototype.draw = function (data, clearBefore) {
        // determine where to draw what with what colors
        var x = data[0], y = data[1], ch = data[2], fg = data[3], bg = data[4];
        // determine if we need to move the terminal cursor
        var dx = this._offset[0] + x;
        var dy = this._offset[1] + y;
        var size = this.computeSize();
        if (dx < 0 || dx >= size[0]) {
            return;
        }
        if (dy < 0 || dy >= size[1]) {
            return;
        }
        if (dx !== this._cursor[0] || dy !== this._cursor[1]) {
            process.stdout.write(positionToAnsi(dx, dy));
            this._cursor[0] = dx;
            this._cursor[1] = dy;
        }
        // terminals automatically clear, but if we're clearing when we're
        // not otherwise provided with a character, just use a space instead
        if (clearBefore) {
            if (!ch) {
                ch = " ";
            }
        }
        // if we're not clearing and not provided with a character, do nothing
        if (!ch) {
            return;
        }
        // determine if we need to change colors
        var newColor = colorToAnsi(fg, bg);
        if (newColor !== this._lastColor) {
            process.stdout.write(newColor);
            this._lastColor = newColor;
        }
        if (ch != '\t') {
            // write the provided symbol to the display
            var chars = [].concat(ch);
            process.stdout.write(chars[0]);
        }
        // update our position, given that we wrote a character
        this._cursor[0]++;
        if (this._cursor[0] >= size[0]) {
            this._cursor[0] = 0;
            this._cursor[1]++;
        }
    };
    Term.prototype.computeFontSize = function () { throw new Error("Terminal backend has no notion of font size"); };
    Term.prototype.eventToPosition = function (x, y) { return [x, y]; };
    Term.prototype.computeSize = function () { return [process.stdout.columns, process.stdout.rows]; };
    return Term;
}(Backend));
export default Term;
//# sourceMappingURL=term.js.map