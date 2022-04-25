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
 * @class Simple fair scheduler (round-robin style)
 */
var Simple = /** @class */ (function (_super) {
    __extends(Simple, _super);
    function Simple() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Simple.prototype.add = function (item, repeat) {
        this._queue.add(item, 0);
        return _super.prototype.add.call(this, item, repeat);
    };
    Simple.prototype.next = function () {
        if (this._current !== null && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, 0);
        }
        return _super.prototype.next.call(this);
    };
    return Simple;
}(Scheduler));
export default Simple;
//# sourceMappingURL=simple.js.map