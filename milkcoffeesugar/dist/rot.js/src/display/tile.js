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
 * @class Tile backend
 * @private
 */
var Tile = /** @class */ (function (_super) {
    __extends(Tile, _super);
    function Tile() {
        var _this = _super.call(this) || this;
        _this._colorCanvas = document.createElement("canvas");
        return _this;
    }
    Tile.prototype.draw = function (data, clearBefore) {
        var x = data[0], y = data[1], ch = data[2], fg = data[3], bg = data[4];
        var tileWidth = this._options.tileWidth;
        var tileHeight = this._options.tileHeight;
        if (clearBefore) {
            if (this._options.tileColorize) {
                this._ctx.clearRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
            else {
                this._ctx.fillStyle = bg;
                this._ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
        }
        if (!ch) {
            return;
        }
        var chars = [].concat(ch);
        var fgs = [].concat(fg);
        var bgs = [].concat(bg);
        for (var i_1 = 0; i_1 < chars.length; i_1++) {
            var tile = this._options.tileMap[chars[i_1]];
            if (!tile) {
                throw new Error("Char \"".concat(chars[i_1], "\" not found in tileMap"));
            }
            if (this._options.tileColorize) { // apply colorization
                var canvas = this._colorCanvas;
                var context = canvas.getContext("2d");
                context.globalCompositeOperation = "source-over";
                context.clearRect(0, 0, tileWidth, tileHeight);
                var fg_1 = fgs[i_1];
                var bg_1 = bgs[i_1];
                context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
                if (fg_1 != "transparent") {
                    context.fillStyle = fg_1;
                    context.globalCompositeOperation = "source-atop";
                    context.fillRect(0, 0, tileWidth, tileHeight);
                }
                if (bg_1 != "transparent") {
                    context.fillStyle = bg_1;
                    context.globalCompositeOperation = "destination-over";
                    context.fillRect(0, 0, tileWidth, tileHeight);
                }
                this._ctx.drawImage(canvas, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
            else { // no colorizing, easy
                this._ctx.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
        }
    };
    Tile.prototype.computeSize = function (availWidth, availHeight) {
        var width = Math.floor(availWidth / this._options.tileWidth);
        var height = Math.floor(availHeight / this._options.tileHeight);
        return [width, height];
    };
    Tile.prototype.computeFontSize = function () {
        throw new Error("Tile backend does not understand font size");
    };
    Tile.prototype._normalizedEventToPosition = function (x, y) {
        return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
    };
    Tile.prototype._updateSize = function () {
        var opts = this._options;
        this._ctx.canvas.width = opts.width * opts.tileWidth;
        this._ctx.canvas.height = opts.height * opts.tileHeight;
        this._colorCanvas.width = opts.tileWidth;
        this._colorCanvas.height = opts.tileHeight;
    };
    return Tile;
}(Canvas));
export default Tile;
//# sourceMappingURL=tile.js.map