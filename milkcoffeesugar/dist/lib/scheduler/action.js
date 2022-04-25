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
 * @class Action-based scheduler
 * @augments ROT.Scheduler
 */
var Action = /** @class */ (function (_super) {
    __extends(Action, _super);
    function Action() {
        var _this = _super.call(this) || this;
        _this._defaultDuration = 1; /* for newly added */
        _this._duration = _this._defaultDuration; /* for this._current */
        return _this;
    }
    /**
     * @param {object} item
     * @param {bool} repeat
     * @param {number} [time=1]
     * @see ROT.Scheduler#add
     */
    Action.prototype.add = function (item, repeat, time) {
        this._queue.add(item, time || this._defaultDuration);
        return _super.prototype.add.call(this, item, repeat);
    };
    Action.prototype.clear = function () {
        this._duration = this._defaultDuration;
        return _super.prototype.clear.call(this);
    };
    Action.prototype.remove = function (item) {
        if (item == this._current) {
            this._duration = this._defaultDuration;
        }
        return _super.prototype.remove.call(this, item);
    };
    /**
     * @see ROT.Scheduler#next
     */
    Action.prototype.next = function () {
        if (this._current !== null && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, this._duration || this._defaultDuration);
            this._duration = this._defaultDuration;
        }
        return _super.prototype.next.call(this);
    };
    /**
     * Set duration for the active item
     */
    Action.prototype.setDuration = function (time) {
        if (this._current) {
            this._duration = time;
        }
        return this;
    };
    return Action;
}(Scheduler));
export default Action;
//# sourceMappingURL=action.js.map