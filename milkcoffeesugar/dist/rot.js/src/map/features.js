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
import RNG from "../rng.js";
;
/**
 * @class Dungeon feature; has own .create() method
 */
var Feature = /** @class */ (function () {
    function Feature() {
    }
    return Feature;
}());
/**
 * @class Room
 * @augments ROT.Map.Feature
 * @param {int} x1
 * @param {int} y1
 * @param {int} x2
 * @param {int} y2
 * @param {int} [doorX]
 * @param {int} [doorY]
 */
var Room = /** @class */ (function (_super) {
    __extends(Room, _super);
    function Room(x1, y1, x2, y2, doorX, doorY) {
        var _this = _super.call(this) || this;
        _this._x1 = x1;
        _this._y1 = y1;
        _this._x2 = x2;
        _this._y2 = y2;
        _this._doors = {};
        if (doorX !== undefined && doorY !== undefined) {
            _this.addDoor(doorX, doorY);
        }
        return _this;
    }
    ;
    /**
     * Room of random size, with a given doors and direction
     */
    Room.createRandomAt = function (x, y, dx, dy, options) {
        var min = options.roomWidth[0];
        var max = options.roomWidth[1];
        var width = RNG.getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        var height = RNG.getUniformInt(min, max);
        if (dx == 1) { /* to the right */
            var y2 = y - Math.floor(RNG.getUniform() * height);
            return new this(x + 1, y2, x + width, y2 + height - 1, x, y);
        }
        if (dx == -1) { /* to the left */
            var y2 = y - Math.floor(RNG.getUniform() * height);
            return new this(x - width, y2, x - 1, y2 + height - 1, x, y);
        }
        if (dy == 1) { /* to the bottom */
            var x2 = x - Math.floor(RNG.getUniform() * width);
            return new this(x2, y + 1, x2 + width - 1, y + height, x, y);
        }
        if (dy == -1) { /* to the top */
            var x2 = x - Math.floor(RNG.getUniform() * width);
            return new this(x2, y - height, x2 + width - 1, y - 1, x, y);
        }
        throw new Error("dx or dy must be 1 or -1");
    };
    /**
     * Room of random size, positioned around center coords
     */
    Room.createRandomCenter = function (cx, cy, options) {
        var min = options.roomWidth[0];
        var max = options.roomWidth[1];
        var width = RNG.getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        var height = RNG.getUniformInt(min, max);
        var x1 = cx - Math.floor(RNG.getUniform() * width);
        var y1 = cy - Math.floor(RNG.getUniform() * height);
        var x2 = x1 + width - 1;
        var y2 = y1 + height - 1;
        return new this(x1, y1, x2, y2);
    };
    /**
     * Room of random size within a given dimensions
     */
    Room.createRandom = function (availWidth, availHeight, options) {
        var min = options.roomWidth[0];
        var max = options.roomWidth[1];
        var width = RNG.getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        var height = RNG.getUniformInt(min, max);
        var left = availWidth - width - 1;
        var top = availHeight - height - 1;
        var x1 = 1 + Math.floor(RNG.getUniform() * left);
        var y1 = 1 + Math.floor(RNG.getUniform() * top);
        var x2 = x1 + width - 1;
        var y2 = y1 + height - 1;
        return new this(x1, y1, x2, y2);
    };
    Room.prototype.addDoor = function (x, y) {
        this._doors[x + "," + y] = 1;
        return this;
    };
    /**
     * @param {function}
     */
    Room.prototype.getDoors = function (cb) {
        for (var key in this._doors) {
            var parts = key.split(",");
            cb(parseInt(parts[0]), parseInt(parts[1]));
        }
        return this;
    };
    Room.prototype.clearDoors = function () {
        this._doors = {};
        return this;
    };
    Room.prototype.addDoors = function (isWallCallback) {
        var left = this._x1 - 1;
        var right = this._x2 + 1;
        var top = this._y1 - 1;
        var bottom = this._y2 + 1;
        for (var x = left; x <= right; x++) {
            for (var y = top; y <= bottom; y++) {
                if (x != left && x != right && y != top && y != bottom) {
                    continue;
                }
                if (isWallCallback(x, y)) {
                    continue;
                }
                this.addDoor(x, y);
            }
        }
        return this;
    };
    Room.prototype.debug = function () {
        console.log("room", this._x1, this._y1, this._x2, this._y2);
    };
    Room.prototype.isValid = function (isWallCallback, canBeDugCallback) {
        var left = this._x1 - 1;
        var right = this._x2 + 1;
        var top = this._y1 - 1;
        var bottom = this._y2 + 1;
        for (var x = left; x <= right; x++) {
            for (var y = top; y <= bottom; y++) {
                if (x == left || x == right || y == top || y == bottom) {
                    if (!isWallCallback(x, y)) {
                        return false;
                    }
                }
                else {
                    if (!canBeDugCallback(x, y)) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
     */
    Room.prototype.create = function (digCallback) {
        var left = this._x1 - 1;
        var right = this._x2 + 1;
        var top = this._y1 - 1;
        var bottom = this._y2 + 1;
        var value = 0;
        for (var x = left; x <= right; x++) {
            for (var y = top; y <= bottom; y++) {
                if (x + "," + y in this._doors) {
                    value = 2;
                }
                else if (x == left || x == right || y == top || y == bottom) {
                    value = 1;
                }
                else {
                    value = 0;
                }
                digCallback(x, y, value);
            }
        }
    };
    Room.prototype.getCenter = function () {
        return [Math.round((this._x1 + this._x2) / 2), Math.round((this._y1 + this._y2) / 2)];
    };
    Room.prototype.getLeft = function () { return this._x1; };
    Room.prototype.getRight = function () { return this._x2; };
    Room.prototype.getTop = function () { return this._y1; };
    Room.prototype.getBottom = function () { return this._y2; };
    return Room;
}(Feature));
export { Room };
/**
 * @class Corridor
 * @augments ROT.Map.Feature
 * @param {int} startX
 * @param {int} startY
 * @param {int} endX
 * @param {int} endY
 */
var Corridor = /** @class */ (function (_super) {
    __extends(Corridor, _super);
    function Corridor(startX, startY, endX, endY) {
        var _this = _super.call(this) || this;
        _this._startX = startX;
        _this._startY = startY;
        _this._endX = endX;
        _this._endY = endY;
        _this._endsWithAWall = true;
        return _this;
    }
    Corridor.createRandomAt = function (x, y, dx, dy, options) {
        var min = options.corridorLength[0];
        var max = options.corridorLength[1];
        var length = RNG.getUniformInt(min, max);
        return new this(x, y, x + dx * length, y + dy * length);
    };
    Corridor.prototype.debug = function () {
        console.log("corridor", this._startX, this._startY, this._endX, this._endY);
    };
    Corridor.prototype.isValid = function (isWallCallback, canBeDugCallback) {
        var sx = this._startX;
        var sy = this._startY;
        var dx = this._endX - sx;
        var dy = this._endY - sy;
        var length = 1 + Math.max(Math.abs(dx), Math.abs(dy));
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        var nx = dy;
        var ny = -dx;
        var ok = true;
        for (var i_1 = 0; i_1 < length; i_1++) {
            var x = sx + i_1 * dx;
            var y = sy + i_1 * dy;
            if (!canBeDugCallback(x, y)) {
                ok = false;
            }
            if (!isWallCallback(x + nx, y + ny)) {
                ok = false;
            }
            if (!isWallCallback(x - nx, y - ny)) {
                ok = false;
            }
            if (!ok) {
                length = i_1;
                this._endX = x - dx;
                this._endY = y - dy;
                break;
            }
        }
        /**
         * If the length degenerated, this corridor might be invalid
         */
        /* not supported */
        if (length == 0) {
            return false;
        }
        /* length 1 allowed only if the next space is empty */
        if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) {
            return false;
        }
        /**
         * We do not want the corridor to crash into a corner of a room;
         * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
         *
         * Situation:
         * #######1
         * .......?
         * #######2
         *
         * The corridor was dug from left to right.
         * 1, 2 - problematic corners, ? = N+1th cell (not dug)
         */
        var firstCornerBad = !isWallCallback(this._endX + dx + nx, this._endY + dy + ny);
        var secondCornerBad = !isWallCallback(this._endX + dx - nx, this._endY + dy - ny);
        this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);
        if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) {
            return false;
        }
        return true;
    };
    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
     */
    Corridor.prototype.create = function (digCallback) {
        var sx = this._startX;
        var sy = this._startY;
        var dx = this._endX - sx;
        var dy = this._endY - sy;
        var length = 1 + Math.max(Math.abs(dx), Math.abs(dy));
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        for (var i_2 = 0; i_2 < length; i_2++) {
            var x = sx + i_2 * dx;
            var y = sy + i_2 * dy;
            digCallback(x, y, 0);
        }
        return true;
    };
    Corridor.prototype.createPriorityWalls = function (priorityWallCallback) {
        if (!this._endsWithAWall) {
            return;
        }
        var sx = this._startX;
        var sy = this._startY;
        var dx = this._endX - sx;
        var dy = this._endY - sy;
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        var nx = dy;
        var ny = -dx;
        priorityWallCallback(this._endX + dx, this._endY + dy);
        priorityWallCallback(this._endX + nx, this._endY + ny);
        priorityWallCallback(this._endX - nx, this._endY - ny);
    };
    return Corridor;
}(Feature));
export { Corridor };
//# sourceMappingURL=features.js.map