import { DEFAULT_WIDTH, DEFAULT_HEIGHT } from "../constants.js";
;
var Map = /** @class */ (function () {
    /**
     * @class Base map generator
     * @param {int} [width=ROT.DEFAULT_WIDTH]
     * @param {int} [height=ROT.DEFAULT_HEIGHT]
     */
    function Map(width, height) {
        if (width === void 0) { width = DEFAULT_WIDTH; }
        if (height === void 0) { height = DEFAULT_HEIGHT; }
        this._width = width;
        this._height = height;
    }
    ;
    Map.prototype._fillMap = function (value) {
        var map = [];
        for (var i_1 = 0; i_1 < this._width; i_1++) {
            map.push([]);
            for (var j_1 = 0; j_1 < this._height; j_1++) {
                map[i_1].push(value);
            }
        }
        return map;
    };
    return Map;
}());
export default Map;
//# sourceMappingURL=map.js.map