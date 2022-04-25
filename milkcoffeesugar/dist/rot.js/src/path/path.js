import { DIRS } from "../constants.js";
/**
 * @class Abstract pathfinder
 * @param {int} toX Target X coord
 * @param {int} toY Target Y coord
 * @param {function} passableCallback Callback to determine map passability
 * @param {object} [options]
 * @param {int} [options.topology=8]
 */
var Path = /** @class */ (function () {
    function Path(toX, toY, passableCallback, options) {
        if (options === void 0) { options = {}; }
        this._toX = toX;
        this._toY = toY;
        this._passableCallback = passableCallback;
        this._options = Object.assign({
            topology: 8
        }, options);
        this._dirs = DIRS[this._options.topology];
        if (this._options.topology == 8) { /* reorder dirs for more aesthetic result (vertical/horizontal first) */
            this._dirs = [
                this._dirs[0],
                this._dirs[2],
                this._dirs[4],
                this._dirs[6],
                this._dirs[1],
                this._dirs[3],
                this._dirs[5],
                this._dirs[7]
            ];
        }
    }
    Path.prototype._getNeighbors = function (cx, cy) {
        var result = [];
        for (var i_1 = 0; i_1 < this._dirs.length; i_1++) {
            var dir = this._dirs[i_1];
            var x = cx + dir[0];
            var y = cy + dir[1];
            if (!this._passableCallback(x, y)) {
                continue;
            }
            result.push([x, y]);
        }
        return result;
    };
    return Path;
}());
export default Path;
//# sourceMappingURL=path.js.map