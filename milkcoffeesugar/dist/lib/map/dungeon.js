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
 * @class Dungeon map: has rooms and corridors
 * @augments ROT.Map
 */
var Dungeon = /** @class */ (function (_super) {
    __extends(Dungeon, _super);
    function Dungeon(width, height) {
        var _this = _super.call(this, width, height) || this;
        _this._rooms = [];
        _this._corridors = [];
        return _this;
    }
    /**
     * Get all generated rooms
     * @returns {ROT.Map.Feature.Room[]}
     */
    Dungeon.prototype.getRooms = function () { return this._rooms; };
    /**
     * Get all generated corridors
     * @returns {ROT.Map.Feature.Corridor[]}
     */
    Dungeon.prototype.getCorridors = function () { return this._corridors; };
    return Dungeon;
}(Map));
export default Dungeon;
//# sourceMappingURL=dungeon.js.map