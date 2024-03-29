import EventQueue from "../eventqueue.js";
var Scheduler = /** @class */ (function () {
    /**
     * @class Abstract scheduler
     */
    function Scheduler() {
        this._queue = new EventQueue();
        this._repeat = [];
        this._current = null;
    }
    /**
     * @see ROT.EventQueue#getTime
     */
    Scheduler.prototype.getTime = function () { return this._queue.getTime(); };
    /**
     * @param {?} item
     * @param {bool} repeat
     */
    Scheduler.prototype.add = function (item, repeat) {
        if (repeat) {
            this._repeat.push(item);
        }
        return this;
    };
    /**
     * Get the time the given item is scheduled for
     * @param {?} item
     * @returns {number} time
     */
    Scheduler.prototype.getTimeOf = function (item) {
        return this._queue.getEventTime(item);
    };
    /**
     * Clear all items
     */
    Scheduler.prototype.clear = function () {
        this._queue.clear();
        this._repeat = [];
        this._current = null;
        return this;
    };
    /**
     * Remove a previously added item
     * @param {?} item
     * @returns {bool} successful?
     */
    Scheduler.prototype.remove = function (item) {
        var result = this._queue.remove(item);
        var index = this._repeat.indexOf(item);
        if (index != -1) {
            this._repeat.splice(index, 1);
        }
        if (this._current == item) {
            this._current = null;
        }
        return result;
    };
    /**
     * Schedule next item
     * @returns {?}
     */
    Scheduler.prototype.next = function () {
        this._current = this._queue.get();
        return this._current;
    };
    return Scheduler;
}());
export default Scheduler;
//# sourceMappingURL=scheduler.js.map