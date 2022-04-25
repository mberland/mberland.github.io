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
 * Icey's Maze generator
 * See http://www.roguebasin.roguelikedevelopment.org/index.php?title=Simple_maze for explanation
 */
var IceyMaze = /** @class */ (function (_super) {
    __extends(IceyMaze, _super);
    function IceyMaze(width, height, regularity) {
        if (regularity === void 0) { regularity = 0; }
        var _this = _super.call(this, width, height) || this;
        _this._regularity = regularity;
        _this._map = [];
        return _this;
    }
    IceyMaze.prototype.create = function (callback) {
        var width = this._width;
        var height = this._height;
        var map = this._fillMap(1);
        width -= (width % 2 ? 1 : 2);
        height -= (height % 2 ? 1 : 2);
        var cx = 0;
        var cy = 0;
        var nx = 0;
        var ny = 0;
        var done = 0;
        var blocked = false;
        var dirs = [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
        ];
        do {
            cx = 1 + 2 * Math.floor(RNG.getUniform() * (width - 1) / 2);
            cy = 1 + 2 * Math.floor(RNG.getUniform() * (height - 1) / 2);
            if (!done) {
                map[cx][cy] = 0;
            }
            if (!map[cx][cy]) {
                this._randomize(dirs);
                do {
                    if (Math.floor(RNG.getUniform() * (this._regularity + 1)) == 0) {
                        this._randomize(dirs);
                    }
                    blocked = true;
                    for (var i_1 = 0; i_1 < 4; i_1++) {
                        nx = cx + dirs[i_1][0] * 2;
                        ny = cy + dirs[i_1][1] * 2;
                        if (this._isFree(map, nx, ny, width, height)) {
                            map[nx][ny] = 0;
                            map[cx + dirs[i_1][0]][cy + dirs[i_1][1]] = 0;
                            cx = nx;
                            cy = ny;
                            blocked = false;
                            done++;
                            break;
                        }
                    }
                } while (!blocked);
            }
        } while (done + 1 < width * height / 4);
        for (var i_2 = 0; i_2 < this._width; i_2++) {
            for (var j_1 = 0; j_1 < this._height; j_1++) {
                callback(i_2, j_1, map[i_2][j_1]);
            }
        }
        this._map = [];
        return this;
    };
    IceyMaze.prototype._randomize = function (dirs) {
        for (var i_3 = 0; i_3 < 4; i_3++) {
            dirs[i_3][0] = 0;
            dirs[i_3][1] = 0;
        }
        switch (Math.floor(RNG.getUniform() * 4)) {
            case 0:
                dirs[0][0] = -1;
                dirs[1][0] = 1;
                dirs[2][1] = -1;
                dirs[3][1] = 1;
                break;
            case 1:
                dirs[3][0] = -1;
                dirs[2][0] = 1;
                dirs[1][1] = -1;
                dirs[0][1] = 1;
                break;
            case 2:
                dirs[2][0] = -1;
                dirs[3][0] = 1;
                dirs[0][1] = -1;
                dirs[1][1] = 1;
                break;
            case 3:
                dirs[1][0] = -1;
                dirs[0][0] = 1;
                dirs[3][1] = -1;
                dirs[2][1] = 1;
                break;
        }
    };
    IceyMaze.prototype._isFree = function (map, x, y, width, height) {
        if (x < 1 || y < 1 || x >= width || y >= height) {
            return false;
        }
        return map[x][y];
    };
    return IceyMaze;
}(Map));
export default IceyMaze;
//# sourceMappingURL=iceymaze.js.map