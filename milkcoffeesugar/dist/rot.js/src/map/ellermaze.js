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
 * Join lists with "i" and "i+1"
 */
function addToList(i, L, R) {
    R[L[i + 1]] = R[i];
    L[R[i]] = L[i + 1];
    R[i] = i + 1;
    L[i + 1] = i;
}
/**
 * Remove "i" from its list
 */
function removeFromList(i, L, R) {
    R[L[i]] = R[i];
    L[R[i]] = L[i];
    R[i] = i;
    L[i] = i;
}
/**
 * Maze generator - Eller's algorithm
 * See http://homepages.cwi.nl/~tromp/maze.html for explanation
 */
var EllerMaze = /** @class */ (function (_super) {
    __extends(EllerMaze, _super);
    function EllerMaze() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EllerMaze.prototype.create = function (callback) {
        var map = this._fillMap(1);
        var w = Math.ceil((this._width - 2) / 2);
        var rand = 9 / 24;
        var L = [];
        var R = [];
        for (var i_1 = 0; i_1 < w; i_1++) {
            L.push(i_1);
            R.push(i_1);
        }
        L.push(w - 1); /* fake stop-block at the right side */
        var j;
        for (j = 1; j + 3 < this._height; j += 2) {
            /* one row */
            for (var i_2 = 0; i_2 < w; i_2++) {
                /* cell coords (will be always empty) */
                var x = 2 * i_2 + 1;
                var y = j;
                map[x][y] = 0;
                /* right connection */
                if (i_2 != L[i_2 + 1] && RNG.getUniform() > rand) {
                    addToList(i_2, L, R);
                    map[x + 1][y] = 0;
                }
                /* bottom connection */
                if (i_2 != L[i_2] && RNG.getUniform() > rand) {
                    /* remove connection */
                    removeFromList(i_2, L, R);
                }
                else {
                    /* create connection */
                    map[x][y + 1] = 0;
                }
            }
        }
        /* last row */
        for (var i_3 = 0; i_3 < w; i_3++) {
            /* cell coords (will be always empty) */
            var x = 2 * i_3 + 1;
            var y = j;
            map[x][y] = 0;
            /* right connection */
            if (i_3 != L[i_3 + 1] && (i_3 == L[i_3] || RNG.getUniform() > rand)) {
                /* dig right also if the cell is separated, so it gets connected to the rest of maze */
                addToList(i_3, L, R);
                map[x + 1][y] = 0;
            }
            removeFromList(i_3, L, R);
        }
        for (var i_4 = 0; i_4 < this._width; i_4++) {
            for (var j_1 = 0; j_1 < this._height; j_1++) {
                callback(i_4, j_1, map[i_4][j_1]);
            }
        }
        return this;
    };
    return EllerMaze;
}(Map));
export default EllerMaze;
//# sourceMappingURL=ellermaze.js.map