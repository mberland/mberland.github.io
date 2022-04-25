var XY = /** @class */ (function () {
    function XY(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    XY.prototype.toString = function () { return this.x + "," + this.y; };
    XY.prototype.is = function (xy) { return (this.x == xy.x && this.y == xy.y); };
    XY.prototype.dist8 = function (xy) {
        var dx = xy.x - this.x;
        var dy = xy.y - this.y;
        return Math.max(Math.abs(dx), Math.abs(dy));
    };
    XY.prototype.dist4 = function (xy) {
        var dx = xy.x - this.x;
        var dy = xy.y - this.y;
        return Math.abs(dx) + Math.abs(dy);
    };
    XY.prototype.dist = function (xy) {
        var dx = xy.x - this.x;
        var dy = xy.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    XY.prototype.plus = function (xy) {
        return new XY(this.x + xy.x, this.y + xy.y);
    };
    XY.prototype.minus = function (xy) {
        return new XY(this.x - xy.x, this.y - xy.y);
    };
    return XY;
}());
//# sourceMappingURL=xy.js.map