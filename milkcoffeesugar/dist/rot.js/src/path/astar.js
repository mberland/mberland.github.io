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
 * @class Simplified A* algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
var AStar = /** @class */ (function (_super) {
    __extends(AStar, _super);
    function AStar(toX, toY, passableCallback, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, toX, toY, passableCallback, options) || this;
        _this._todo = [];
        _this._done = {};
        return _this;
    }
    /**
     * Compute a path from a given point
     * @see ROT.Path#compute
     */
    AStar.prototype.compute = function (fromX, fromY, callback) {
        this._todo = [];
        this._done = {};
        this._fromX = fromX;
        this._fromY = fromY;
        this._add(this._toX, this._toY, null);
        while (this._todo.length) {
            var item_1 = this._todo.shift();
            var id = item_1.x + "," + item_1.y;
            if (id in this._done) {
                continue;
            }
            this._done[id] = item_1;
            if (item_1.x == fromX && item_1.y == fromY) {
                break;
            }
            var neighbors = this._getNeighbors(item_1.x, item_1.y);
            for (var i_1 = 0; i_1 < neighbors.length; i_1++) {
                var neighbor = neighbors[i_1];
                var x = neighbor[0];
                var y = neighbor[1];
                var id_1 = x + "," + y;
                if (id_1 in this._done) {
                    continue;
                }
                this._add(x, y, item_1);
            }
        }
        var item = this._done[fromX + "," + fromY];
        if (!item) {
            return;
        }
        while (item) {
            callback(item.x, item.y);
            item = item.prev;
        }
    };
    AStar.prototype._add = function (x, y, prev) {
        var h = this._distance(x, y);
        var obj = {
            x: x,
            y: y,
            prev: prev,
            g: (prev ? prev.g + 1 : 0),
            h: h
        };
        /* insert into priority queue */
        var f = obj.g + obj.h;
        for (var i_2 = 0; i_2 < this._todo.length; i_2++) {
            var item = this._todo[i_2];
            var itemF = item.g + item.h;
            if (f < itemF || (f == itemF && h < item.h)) {
                this._todo.splice(i_2, 0, obj);
                return;
            }
        }
        this._todo.push(obj);
    };
    AStar.prototype._distance = function (x, y) {
        switch (this._options.topology) {
            case 4:
                return (Math.abs(x - this._fromX) + Math.abs(y - this._fromY));
                break;
            case 6:
                var dx = Math.abs(x - this._fromX);
                var dy = Math.abs(y - this._fromY);
                return dy + Math.max(0, (dx - dy) / 2);
                break;
            case 8:
                return Math.max(Math.abs(x - this._fromX), Math.abs(y - this._fromY));
                break;
        }
    };
    return AStar;
}(Path));
export default AStar;
//# sourceMappingURL=astar.js.map