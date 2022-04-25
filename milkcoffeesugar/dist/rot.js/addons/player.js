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
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, { ch: "@", fg: "#fff" }) || this;
        _this._keys = {};
        _this._keys[ROT.KEYS.VK_K] = 0;
        _this._keys[ROT.KEYS.VK_UP] = 0;
        _this._keys[ROT.KEYS.VK_NUMPAD8] = 0;
        _this._keys[ROT.KEYS.VK_U] = 1;
        _this._keys[ROT.KEYS.VK_NUMPAD9] = 1;
        _this._keys[ROT.KEYS.VK_L] = 2;
        _this._keys[ROT.KEYS.VK_RIGHT] = 2;
        _this._keys[ROT.KEYS.VK_NUMPAD6] = 2;
        _this._keys[ROT.KEYS.VK_N] = 3;
        _this._keys[ROT.KEYS.VK_NUMPAD3] = 3;
        _this._keys[ROT.KEYS.VK_J] = 4;
        _this._keys[ROT.KEYS.VK_DOWN] = 4;
        _this._keys[ROT.KEYS.VK_NUMPAD2] = 4;
        _this._keys[ROT.KEYS.VK_B] = 5;
        _this._keys[ROT.KEYS.VK_NUMPAD1] = 5;
        _this._keys[ROT.KEYS.VK_H] = 6;
        _this._keys[ROT.KEYS.VK_LEFT] = 6;
        _this._keys[ROT.KEYS.VK_NUMPAD4] = 6;
        _this._keys[ROT.KEYS.VK_Y] = 7;
        _this._keys[ROT.KEYS.VK_NUMPAD7] = 7;
        _this._keys[ROT.KEYS.VK_PERIOD] = -1;
        _this._keys[ROT.KEYS.VK_CLEAR] = -1;
        _this._keys[ROT.KEYS.VK_NUMPAD5] = -1;
        return _this;
    }
    Player.prototype.act = function () {
        Game.textBuffer.write("It is your turn, press any relevant key.");
        Game.textBuffer.flush();
        Game.engine.lock();
        window.addEventListener("keydown", this);
    };
    Player.prototype.die = function () {
        Being.prototype.die.call(this);
        Game.over();
    };
    Player.prototype.handleEvent = function (e) {
        var code = e.keyCode;
        var keyHandled = this._handleKey(e.keyCode);
        if (keyHandled) {
            window.removeEventListener("keydown", this);
            Game.engine.unlock();
        }
    };
    Player.prototype._handleKey = function (code) {
        if (code in this._keys) {
            Game.textBuffer.clear();
            var direction = this._keys[code];
            if (direction == -1) { /* noop */
                /* FIXME show something? */
                return true;
            }
            var dir = ROT.DIRS[8][direction];
            var xy = this._xy.plus(new XY(dir[0], dir[1]));
            this._level.setEntity(this, xy); /* FIXME collision detection */
            return true;
        }
        return false; /* unknown key */
    };
    return Player;
}(Being));
//# sourceMappingURL=player.js.map