/**
 * @class Asynchronous main loop
 * @param {ROT.Scheduler} scheduler
 */
var Engine = /** @class */ (function () {
    function Engine(scheduler) {
        this._scheduler = scheduler;
        this._lock = 1;
    }
    /**
     * Start the main loop. When this call returns, the loop is locked.
     */
    Engine.prototype.start = function () { return this.unlock(); };
    /**
     * Interrupt the engine by an asynchronous action
     */
    Engine.prototype.lock = function () {
        this._lock++;
        return this;
    };
    /**
     * Resume execution (paused by a previous lock)
     */
    Engine.prototype.unlock = function () {
        if (!this._lock) {
            throw new Error("Cannot unlock unlocked engine");
        }
        this._lock--;
        while (!this._lock) {
            var actor = this._scheduler.next();
            if (!actor) {
                return this.lock();
            } /* no actors */
            var result = actor.act();
            if (result && result.then) { /* actor returned a "thenable", looks like a Promise */
                this.lock();
                result.then(this.unlock.bind(this));
            }
        }
        return this;
    };
    return Engine;
}());
export default Engine;
//# sourceMappingURL=engine.js.map