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
import Canvas from "./canvas.js";
/**
 * @class Rectangular backend
 * @private
 */
var Rect = /** @class */ (function () {
    var Rect = /** @class */ (function (_super) {
        __extends(Rect, _super);
        function Rect() {
            var _this = _super.call(this) || this;
            _this._spacingX = 0;
            _this._spacingY = 0;
            _this._canvasCache = {};
            return _this;
        }
        Rect.prototype.setOptions = function (options) {
            _super.prototype.setOptions.call(this, options);
            this._canvasCache = {};
        };
        Rect.prototype.draw = function (data, clearBefore) {
            if (Rect.cache) {
                this._drawWithCache(data);
            }
            else {
                this._drawNoCache(data, clearBefore);
            }
        };
        Rect.prototype._drawWithCache = function (data) {
            var x = data[0], y = data[1], ch = data[2], fg = data[3], bg = data[4];
            var hash = "" + ch + fg + bg;
            var canvas;
            if (hash in this._canvasCache) {
                canvas = this._canvasCache[hash];
            }
            else {
                var b = this._options.border;
                canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = this._spacingX;
                canvas.height = this._spacingY;
                ctx.fillStyle = bg;
                ctx.fillRect(b, b, canvas.width - b, canvas.height - b);
                if (ch) {
                    ctx.fillStyle = fg;
                    ctx.font = this._ctx.font;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    var chars = [].concat(ch);
                    for (var i_1 = 0; i_1 < chars.length; i_1++) {
                        ctx.fillText(chars[i_1], this._spacingX / 2, Math.ceil(this._spacingY / 2));
                    }
                }
                this._canvasCache[hash] = canvas;
            }
            this._ctx.drawImage(canvas, x * this._spacingX, y * this._spacingY);
        };
        Rect.prototype._drawNoCache = function (data, clearBefore) {
            var x = data[0], y = data[1], ch = data[2], fg = data[3], bg = data[4];
            if (clearBefore) {
                var b = this._options.border;
                this._ctx.fillStyle = bg;
                this._ctx.fillRect(x * this._spacingX + b, y * this._spacingY + b, this._spacingX - b, this._spacingY - b);
            }
            if (!ch) {
                return;
            }
            this._ctx.fillStyle = fg;
            var chars = [].concat(ch);
            for (var i_2 = 0; i_2 < chars.length; i_2++) {
                this._ctx.fillText(chars[i_2], (x + 0.5) * this._spacingX, Math.ceil((y + 0.5) * this._spacingY));
            }
        };
        Rect.prototype.computeSize = function (availWidth, availHeight) {
            var width = Math.floor(availWidth / this._spacingX);
            var height = Math.floor(availHeight / this._spacingY);
            return [width, height];
        };
        Rect.prototype.computeFontSize = function (availWidth, availHeight) {
            var boxWidth = Math.floor(availWidth / this._options.width);
            var boxHeight = Math.floor(availHeight / this._options.height);
            /* compute char ratio */
            var oldFont = this._ctx.font;
            this._ctx.font = "100px " + this._options.fontFamily;
            var width = Math.ceil(this._ctx.measureText("W").width);
            this._ctx.font = oldFont;
            var ratio = width / 100;
            var widthFraction = ratio * boxHeight / boxWidth;
            if (widthFraction > 1) { /* too wide with current aspect ratio */
                boxHeight = Math.floor(boxHeight / widthFraction);
            }
            return Math.floor(boxHeight / this._options.spacing);
        };
        Rect.prototype._normalizedEventToPosition = function (x, y) {
            return [Math.floor(x / this._spacingX), Math.floor(y / this._spacingY)];
        };
        Rect.prototype._updateSize = function () {
            var opts = this._options;
            var charWidth = Math.ceil(this._ctx.measureText("W").width);
            this._spacingX = Math.ceil(opts.spacing * charWidth);
            this._spacingY = Math.ceil(opts.spacing * opts.fontSize);
            if (opts.forceSquareRatio) {
                this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
            }
            this._ctx.canvas.width = opts.width * this._spacingX;
            this._ctx.canvas.height = opts.height * this._spacingY;
        };
        return Rect;
    }(Canvas));
    Rect.cache = false;
    return Rect;
})();
export default Rect;
//# sourceMappingURL=rect.js.map