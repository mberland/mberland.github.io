import { DIRS } from "../constants.js";
;
;
var FOV = /** @class */ (function () {
    /**
     * @class Abstract FOV algorithm
     * @param {function} lightPassesCallback Does the light pass through x,y?
     * @param {object} [options]
     * @param {int} [options.topology=8] 4/6/8
     */
    function FOV(lightPassesCallback, options) {
        if (options === void 0) { options = {}; }
        this._lightPasses = lightPassesCallback;
        this._options = Object.assign({ topology: 8 }, options);
    }
    /**
     * Return all neighbors in a concentric ring
     * @param {int} cx center-x
     * @param {int} cy center-y
     * @param {int} r range
     */
    FOV.prototype._getCircle = function (cx, cy, r) {
        var result = [];
        var dirs, countFactor, startOffset;
        switch (this._options.topology) {
            case 4:
                countFactor = 1;
                startOffset = [0, 1];
                dirs = [
                    DIRS[8][7],
                    DIRS[8][1],
                    DIRS[8][3],
                    DIRS[8][5]
                ];
                break;
            case 6:
                dirs = DIRS[6];
                countFactor = 1;
                startOffset = [-1, 1];
                break;
            case 8:
                dirs = DIRS[4];
                countFactor = 2;
                startOffset = [-1, 1];
                break;
            default:
                throw new Error("Incorrect topology for FOV computation");
                break;
        }
        /* starting neighbor */
        var x = cx + startOffset[0] * r;
        var y = cy + startOffset[1] * r;
        /* circle */
        for (var i_1 = 0; i_1 < dirs.length; i_1++) {
            for (var j_1 = 0; j_1 < r * countFactor; j_1++) {
                result.push([x, y]);
                x += dirs[i_1][0];
                y += dirs[i_1][1];
            }
        }
        return result;
    };
    return FOV;
}());
export default FOV;
//# sourceMappingURL=fov.js.map