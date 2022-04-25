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
/**
 * @class Simple empty rectangular room
 * @augments ROT.Map
 */
var Arena = /** @class */ (function (_super) {
    __extends(Arena, _super);
    function Arena() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Arena.prototype.create = function (callback) {
        var w = this._width - 1;
        var h = this._height - 1;
        for (var i_1 = 0; i_1 <= w; i_1++) {
            for (var j_1 = 0; j_1 <= h; j_1++) {
                var empty = (i_1 && j_1 && i_1 < w && j_1 < h);
                callback(i_1, j_1, empty ? 0 : 1);
            }
        }
        return this;
    };
    return Arena;
}(Map));
export default Arena;
//# sourceMappingURL=arena.js.map