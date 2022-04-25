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
var Being = /** @class */ (function (_super) {
    __extends(Being, _super);
    function Being(visual) {
        var _this = _super.call(this, visual) || this;
        _this._speed = 100;
        _this._hp = 10;
        return _this;
    }
    /**
     * Called by the Scheduler
     */
    Being.prototype.getSpeed = function () { return this._speed; };
    Being.prototype.damage = function (damage) {
        this._hp -= damage;
        if (this._hp <= 0) {
            this.die();
        }
    };
    Being.prototype.act = function () { };
    Being.prototype.die = function () { Game.scheduler.remove(this); };
    Being.prototype.setPosition = function (xy, level) {
        // came to a currently active level; add self to the scheduler 
        if (level != this._level && level == Game.level) {
            Game.scheduler.add(this, true);
        }
        return _super.prototype.setPosition.call(this, xy, level);
    };
    return Being;
}(Entity));
//# sourceMappingURL=being.js.map