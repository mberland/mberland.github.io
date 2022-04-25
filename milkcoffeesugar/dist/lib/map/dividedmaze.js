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
import Map from "./map.js";
import RNG from "../rng.js";
/**
 * @class Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
 * @augments ROT.Map
 */
var DividedMaze = /** @class */ (function (_super) {
    __extends(DividedMaze, _super);
    function DividedMaze() {
        var _this = _super.apply(this, arguments) || this;
        _this._stack = [];
        _this._map = [];
        return _this;
    }
    DividedMaze.prototype.create = function (callback) {
        var w = this._width;
        var h = this._height;
        this._map = [];
        for (var i_1 = 0; i_1 < w; i_1++) {
            this._map.push([]);
            for (var j_1 = 0; j_1 < h; j_1++) {
                var border = (i_1 == 0 || j_1 == 0 || i_1 + 1 == w || j_1 + 1 == h);
                this._map[i_1].push(border ? 1 : 0);
            }
        }
        this._stack = [
            [1, 1, w - 2, h - 2]
        ];
        this._process();
        for (var i_2 = 0; i_2 < w; i_2++) {
            for (var j_2 = 0; j_2 < h; j_2++) {
                callback(i_2, j_2, this._map[i_2][j_2]);
            }
        }
        this._map = [];
        return this;
    };
    DividedMaze.prototype._process = function () {
        while (this._stack.length) {
            var room = this._stack.shift(); /* [left, top, right, bottom] */
            this._partitionRoom(room);
        }
    };
    DividedMaze.prototype._partitionRoom = function (room) {
        var availX = [];
        var availY = [];
        for (var i_3 = room[0] + 1; i_3 < room[2]; i_3++) {
            var top_1 = this._map[i_3][room[1] - 1];
            var bottom = this._map[i_3][room[3] + 1];
            if (top_1 && bottom && !(i_3 % 2)) {
                availX.push(i_3);
            }
        }
        for (var j_3 = room[1] + 1; j_3 < room[3]; j_3++) {
            var left = this._map[room[0] - 1][j_3];
            var right = this._map[room[2] + 1][j_3];
            if (left && right && !(j_3 % 2)) {
                availY.push(j_3);
            }
        }
        if (!availX.length || !availY.length) {
            return;
        }
        var x = RNG.getItem(availX);
        var y = RNG.getItem(availY);
        this._map[x][y] = 1;
        var walls = [];
        var w = [];
        walls.push(w); /* left part */
        for (var i_4 = room[0]; i_4 < x; i_4++) {
            this._map[i_4][y] = 1;
            if (i_4 % 2)
                w.push([i_4, y]);
        }
        w = [];
        walls.push(w); /* right part */
        for (var i_5 = x + 1; i_5 <= room[2]; i_5++) {
            this._map[i_5][y] = 1;
            if (i_5 % 2)
                w.push([i_5, y]);
        }
        w = [];
        walls.push(w); /* top part */
        for (var j_4 = room[1]; j_4 < y; j_4++) {
            this._map[x][j_4] = 1;
            if (j_4 % 2)
                w.push([x, j_4]);
        }
        w = [];
        walls.push(w); /* bottom part */
        for (var j_5 = y + 1; j_5 <= room[3]; j_5++) {
            this._map[x][j_5] = 1;
            if (j_5 % 2)
                w.push([x, j_5]);
        }
        var solid = RNG.getItem(walls);
        for (var i_6 = 0; i_6 < walls.length; i_6++) {
            var w_1 = walls[i_6];
            if (w_1 == solid) {
                continue;
            }
            var hole = RNG.getItem(w_1);
            this._map[hole[0]][hole[1]] = 0;
        }
        this._stack.push([room[0], room[1], x - 1, y - 1]); /* left top */
        this._stack.push([x + 1, room[1], room[2], y - 1]); /* right top */
        this._stack.push([room[0], y + 1, x - 1, room[3]]); /* left bottom */
        this._stack.push([x + 1, y + 1, room[2], room[3]]); /* right bottom */
    };
    return DividedMaze;
}(Map));
export default DividedMaze;
//# sourceMappingURL=dividedmaze.js.map