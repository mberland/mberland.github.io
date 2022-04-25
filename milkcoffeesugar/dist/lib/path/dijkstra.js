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
import Path from "./path.js";
/**
 * @class Simplified Dijkstra's algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
var Dijkstra = /** @class */ (function (_super) {
    __extends(Dijkstra, _super);
    function Dijkstra(toX, toY, passableCallback, options) {
        var _this = _super.call(this, toX, toY, passableCallback, options) || this;
        _this._computed = {};
        _this._todo = [];
        _this._add(toX, toY, null);
        return _this;
    }
    /**
     * Compute a path from a given point
     * @see ROT.Path#compute
     */
    Dijkstra.prototype.compute = function (fromX, fromY, callback) {
        var key = fromX + "," + fromY;
        if (!(key in this._computed)) {
            this._compute(fromX, fromY);
        }
        if (!(key in this._computed)) {
            return;
        }
        var item = this._computed[key];
        while (item) {
            callback(item.x, item.y);
            item = item.prev;
        }
    };
    /**
     * Compute a non-cached value
     */
    Dijkstra.prototype._compute = function (fromX, fromY) {
        while (this._todo.length) {
            var item = this._todo.shift();
            if (item.x == fromX && item.y == fromY) {
                return;
            }
            var neighbors = this._getNeighbors(item.x, item.y);
            for (var i_1 = 0; i_1 < neighbors.length; i_1++) {
                var neighbor = neighbors[i_1];
                var x = neighbor[0];
                var y = neighbor[1];
                var id = x + "," + y;
                if (id in this._computed) {
                    continue;
                } /* already done */
                this._add(x, y, item);
            }
        }
    };
    Dijkstra.prototype._add = function (x, y, prev) {
        var obj = {
            x: x,
            y: y,
            prev: prev
        };
        this._computed[x + "," + y] = obj;
        this._todo.push(obj);
    };
    return Dijkstra;
}(Path));
export default Dijkstra;
//# sourceMappingURL=dijkstra.js.map