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
import { DIRS } from "../constants.js";
import RNG from "../rng.js";
;
/**
 * @class Cellular automaton map generator
 * @augments ROT.Map
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 * @param {object} [options] Options
 * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
 * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
 * @param {int} [options.topology] Topology 4 or 6 or 8
 */
var Cellular = /** @class */ (function (_super) {
    __extends(Cellular, _super);
    function Cellular(width, height, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, width, height) || this;
        _this._options = {
            born: [5, 6, 7, 8],
            survive: [4, 5, 6, 7, 8],
            topology: 8
        };
        _this.setOptions(options);
        _this._dirs = DIRS[_this._options.topology];
        _this._map = _this._fillMap(0);
        return _this;
    }
    /**
     * Fill the map with random values
     * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
     */
    Cellular.prototype.randomize = function (probability) {
        for (var i_1 = 0; i_1 < this._width; i_1++) {
            for (var j_1 = 0; j_1 < this._height; j_1++) {
                this._map[i_1][j_1] = (RNG.getUniform() < probability ? 1 : 0);
            }
        }
        return this;
    };
    /**
     * Change options.
     * @see ROT.Map.Cellular
     */
    Cellular.prototype.setOptions = function (options) { Object.assign(this._options, options); };
    Cellular.prototype.set = function (x, y, value) { this._map[x][y] = value; };
    Cellular.prototype.create = function (callback) {
        var newMap = this._fillMap(0);
        var born = this._options.born;
        var survive = this._options.survive;
        for (var j_2 = 0; j_2 < this._height; j_2++) {
            var widthStep = 1;
            var widthStart = 0;
            if (this._options.topology == 6) {
                widthStep = 2;
                widthStart = j_2 % 2;
            }
            for (var i_2 = widthStart; i_2 < this._width; i_2 += widthStep) {
                var cur = this._map[i_2][j_2];
                var ncount = this._getNeighbors(i_2, j_2);
                if (cur && survive.indexOf(ncount) != -1) { /* survive */
                    newMap[i_2][j_2] = 1;
                }
                else if (!cur && born.indexOf(ncount) != -1) { /* born */
                    newMap[i_2][j_2] = 1;
                }
            }
        }
        this._map = newMap;
        callback && this._serviceCallback(callback);
    };
    Cellular.prototype._serviceCallback = function (callback) {
        for (var j_3 = 0; j_3 < this._height; j_3++) {
            var widthStep = 1;
            var widthStart = 0;
            if (this._options.topology == 6) {
                widthStep = 2;
                widthStart = j_3 % 2;
            }
            for (var i_3 = widthStart; i_3 < this._width; i_3 += widthStep) {
                callback(i_3, j_3, this._map[i_3][j_3]);
            }
        }
    };
    /**
     * Get neighbor count at [i,j] in this._map
     */
    Cellular.prototype._getNeighbors = function (cx, cy) {
        var result = 0;
        for (var i_4 = 0; i_4 < this._dirs.length; i_4++) {
            var dir = this._dirs[i_4];
            var x = cx + dir[0];
            var y = cy + dir[1];
            if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
                continue;
            }
            result += (this._map[x][y] == 1 ? 1 : 0);
        }
        return result;
    };
    /**
     * Make sure every non-wall space is accessible.
     * @param {function} callback to call to display map when do
     * @param {int} value to consider empty space - defaults to 0
     * @param {function} callback to call when a new connection is made
     */
    Cellular.prototype.connect = function (callback, value, connectionCallback) {
        if (!value)
            value = 0;
        var allFreeSpace = [];
        var notConnected = {};
        // find all free space
        var widthStep = 1;
        var widthStarts = [0, 0];
        if (this._options.topology == 6) {
            widthStep = 2;
            widthStarts = [0, 1];
        }
        for (var y = 0; y < this._height; y++) {
            for (var x = widthStarts[y % 2]; x < this._width; x += widthStep) {
                if (this._freeSpace(x, y, value)) {
                    var p_1 = [x, y];
                    notConnected[this._pointKey(p_1)] = p_1;
                    allFreeSpace.push([x, y]);
                }
            }
        }
        var start = allFreeSpace[RNG.getUniformInt(0, allFreeSpace.length - 1)];
        var key = this._pointKey(start);
        var connected = {};
        connected[key] = start;
        delete notConnected[key];
        // find what's connected to the starting point
        this._findConnected(connected, notConnected, [start], false, value);
        while (Object.keys(notConnected).length > 0) {
            // find two points from notConnected to connected
            var p_2 = this._getFromTo(connected, notConnected);
            var from = p_2[0]; // notConnected
            var to = p_2[1]; // connected
            // find everything connected to the starting point
            var local = {};
            local[this._pointKey(from)] = from;
            this._findConnected(local, notConnected, [from], true, value);
            // connect to a connected cell
            var tunnelFn = (this._options.topology == 6 ? this._tunnelToConnected6 : this._tunnelToConnected);
            tunnelFn.call(this, to, from, connected, notConnected, value, connectionCallback);
            // now all of local is connected
            for (var k in local) {
                var pp = local[k];
                this._map[pp[0]][pp[1]] = value;
                connected[k] = pp;
                delete notConnected[k];
            }
        }
        callback && this._serviceCallback(callback);
    };
    /**
     * Find random points to connect. Search for the closest point in the larger space.
     * This is to minimize the length of the passage while maintaining good performance.
     */
    Cellular.prototype._getFromTo = function (connected, notConnected) {
        var from = [0, 0], to = [0, 0], d;
        var connectedKeys = Object.keys(connected);
        var notConnectedKeys = Object.keys(notConnected);
        for (var i_5 = 0; i_5 < 5; i_5++) {
            if (connectedKeys.length < notConnectedKeys.length) {
                var keys = connectedKeys;
                to = connected[keys[RNG.getUniformInt(0, keys.length - 1)]];
                from = this._getClosest(to, notConnected);
            }
            else {
                var keys = notConnectedKeys;
                from = notConnected[keys[RNG.getUniformInt(0, keys.length - 1)]];
                to = this._getClosest(from, connected);
            }
            d = (from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]);
            if (d < 64) {
                break;
            }
        }
        // console.log(">>> connected=" + to + " notConnected=" + from + " dist=" + d);
        return [from, to];
    };
    Cellular.prototype._getClosest = function (point, space) {
        var minPoint = null;
        var minDist = null;
        for (var k in space) {
            var p_3 = space[k];
            var d_1 = (p_3[0] - point[0]) * (p_3[0] - point[0]) + (p_3[1] - point[1]) * (p_3[1] - point[1]);
            if (minDist == null || d_1 < minDist) {
                minDist = d_1;
                minPoint = p_3;
            }
        }
        return minPoint;
    };
    Cellular.prototype._findConnected = function (connected, notConnected, stack, keepNotConnected, value) {
        while (stack.length > 0) {
            var p_4 = stack.splice(0, 1)[0];
            var tests = void 0;
            if (this._options.topology == 6) {
                tests = [
                    [p_4[0] + 2, p_4[1]],
                    [p_4[0] + 1, p_4[1] - 1],
                    [p_4[0] - 1, p_4[1] - 1],
                    [p_4[0] - 2, p_4[1]],
                    [p_4[0] - 1, p_4[1] + 1],
                    [p_4[0] + 1, p_4[1] + 1],
                ];
            }
            else {
                tests = [
                    [p_4[0] + 1, p_4[1]],
                    [p_4[0] - 1, p_4[1]],
                    [p_4[0], p_4[1] + 1],
                    [p_4[0], p_4[1] - 1]
                ];
            }
            for (var i_6 = 0; i_6 < tests.length; i_6++) {
                var key = this._pointKey(tests[i_6]);
                if (connected[key] == null && this._freeSpace(tests[i_6][0], tests[i_6][1], value)) {
                    connected[key] = tests[i_6];
                    if (!keepNotConnected) {
                        delete notConnected[key];
                    }
                    stack.push(tests[i_6]);
                }
            }
        }
    };
    Cellular.prototype._tunnelToConnected = function (to, from, connected, notConnected, value, connectionCallback) {
        var a, b;
        if (from[0] < to[0]) {
            a = from;
            b = to;
        }
        else {
            a = to;
            b = from;
        }
        for (var xx = a[0]; xx <= b[0]; xx++) {
            this._map[xx][a[1]] = value;
            var p_5 = [xx, a[1]];
            var pkey = this._pointKey(p_5);
            connected[pkey] = p_5;
            delete notConnected[pkey];
        }
        if (connectionCallback && a[0] < b[0]) {
            connectionCallback(a, [b[0], a[1]]);
        }
        // x is now fixed
        var x = b[0];
        if (from[1] < to[1]) {
            a = from;
            b = to;
        }
        else {
            a = to;
            b = from;
        }
        for (var yy = a[1]; yy < b[1]; yy++) {
            this._map[x][yy] = value;
            var p_6 = [x, yy];
            var pkey = this._pointKey(p_6);
            connected[pkey] = p_6;
            delete notConnected[pkey];
        }
        if (connectionCallback && a[1] < b[1]) {
            connectionCallback([b[0], a[1]], [b[0], b[1]]);
        }
    };
    Cellular.prototype._tunnelToConnected6 = function (to, from, connected, notConnected, value, connectionCallback) {
        var a, b;
        if (from[0] < to[0]) {
            a = from;
            b = to;
        }
        else {
            a = to;
            b = from;
        }
        // tunnel diagonally until horizontally level
        var xx = a[0];
        var yy = a[1];
        while (!(xx == b[0] && yy == b[1])) {
            var stepWidth = 2;
            if (yy < b[1]) {
                yy++;
                stepWidth = 1;
            }
            else if (yy > b[1]) {
                yy--;
                stepWidth = 1;
            }
            if (xx < b[0]) {
                xx += stepWidth;
            }
            else if (xx > b[0]) {
                xx -= stepWidth;
            }
            else if (b[1] % 2) {
                // Won't step outside map if destination on is map's right edge
                xx -= stepWidth;
            }
            else {
                // ditto for left edge
                xx += stepWidth;
            }
            this._map[xx][yy] = value;
            var p_7 = [xx, yy];
            var pkey = this._pointKey(p_7);
            connected[pkey] = p_7;
            delete notConnected[pkey];
        }
        if (connectionCallback) {
            connectionCallback(from, to);
        }
    };
    Cellular.prototype._freeSpace = function (x, y, value) {
        return x >= 0 && x < this._width && y >= 0 && y < this._height && this._map[x][y] == value;
    };
    Cellular.prototype._pointKey = function (p) { return p[0] + "." + p[1]; };
    return Cellular;
}(Map));
export default Cellular;
//# sourceMappingURL=cellular.js.map