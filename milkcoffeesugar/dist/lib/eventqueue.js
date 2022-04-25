import { MinHeap } from "./MinHeap.js";
var EventQueue = /** @class */ (function () {
    /**
     * @class Generic event queue: stores events and retrieves them based on their time
     */
    function EventQueue() {
        this._time = 0;
        this._events = new MinHeap();
    }
    /**
     * @returns {number} Elapsed time
     */
    EventQueue.prototype.getTime = function () { return this._time; };
    /**
     * Clear all scheduled events
     */
    EventQueue.prototype.clear = function () {
        this._events = new MinHeap();
        return this;
    };
    /**
     * @param {?} event
     * @param {number} time
     */
    EventQueue.prototype.add = function (event, time) {
        this._events.push(event, time);
    };
    /**
     * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
     * @returns {? || null} The event previously added by addEvent, null if no event available
     */
    EventQueue.prototype.get = function () {
        if (!this._events.len()) {
            return null;
        }
        var _a = this._events.pop(), time = _a.key, event = _a.value;
        if (time > 0) { /* advance */
            this._time += time;
            this._events.shift(-time);
        }
        return event;
    };
    /**
     * Get the time associated with the given event
     * @param {?} event
     * @returns {number} time
     */
    EventQueue.prototype.getEventTime = function (event) {
        var r = this._events.find(event);
        if (r) {
            var key = r.key;
            return key;
        }
        return undefined;
    };
    /**
     * Remove an event from the queue
     * @param {?} event
     * @returns {bool} success?
     */
    EventQueue.prototype.remove = function (event) {
        return this._events.remove(event);
    };
    ;
    return EventQueue;
}());
export default EventQueue;
//# sourceMappingURL=eventqueue.js.map