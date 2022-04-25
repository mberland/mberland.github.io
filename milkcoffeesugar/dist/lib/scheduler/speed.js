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
import Scheduler from "./scheduler.js";
/**
 * @class Speed-based scheduler
 */
var Speed = /** @class */ (function (_super) {
    __extends(Speed, _super);
    function Speed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {object} item anything with "getSpeed" method
     * @param {bool} repeat
     * @param {number} [time=1/item.getSpeed()]
     * @see ROT.Scheduler#add
     */
    Speed.prototype.add = function (item, repeat, time) {
        this._queue.add(item, time !== undefined ? time : 1 / item.getSpeed());
        return _super.prototype.add.call(this, item, repeat);
    };
    /**
     * @see ROT.Scheduler#next
     */
    Speed.prototype.next = function () {
        if (this._current && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, 1 / this._current.getSpeed());
        }
        return _super.prototype.next.call(this);
    };
    return Speed;
}(Scheduler));
export default Speed;
//# sourceMappingURL=speed.js.map