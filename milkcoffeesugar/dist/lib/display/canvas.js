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
var Canvas = /** @class */ (function (_super) {
    __extends(Canvas, _super);
    function Canvas() {
        var _this = _super.call(this) || this;
        _this._ctx = document.createElement("canvas").getContext("2d");
        return _this;
    }
    Canvas.prototype.schedule = function (cb) { requestAnimationFrame(cb); };
    Canvas.prototype.getContainer = function () { return this._ctx.canvas; };
    Canvas.prototype.setOptions = function (opts) {
        _super.prototype.setOptions.call(this, opts);
        var style = (opts.fontStyle ? "".concat(opts.fontStyle, " ") : "");
        var font = "".concat(style, " ").concat(opts.fontSize, "px ").concat(opts.fontFamily);
        this._ctx.font = font;
        this._updateSize();
        this._ctx.font = font;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
    };
    Canvas.prototype.clear = function () {
        this._ctx.fillStyle = this._options.bg;
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    };
    Canvas.prototype.eventToPosition = function (x, y) {
        var canvas = this._ctx.canvas;
        var rect = canvas.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
        x *= canvas.width / rect.width;
        y *= canvas.height / rect.height;
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
            return [-1, -1];
        }
        return this._normalizedEventToPosition(x, y);
    };
    return Canvas;
}(Backend));
export default Canvas;
//# sourceMappingURL=canvas.js.map