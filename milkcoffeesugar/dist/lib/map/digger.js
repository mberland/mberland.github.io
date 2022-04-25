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
import Dungeon from "./dungeon.js";
import { Room, Corridor } from "./features.js";
import RNG from "../rng.js";
import { DIRS } from "../constants.js";
var FEATURES = {
    "room": Room,
    "corridor": Corridor
};
/**
 * Random dungeon generator using human-like digging patterns.
 * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at
 * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
 */
var Digger = /** @class */ (function (_super) {
    __extends(Digger, _super);
    function Digger(width, height, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, width, height) || this;
        _this._options = Object.assign({
            roomWidth: [3, 9],
            roomHeight: [3, 5],
            corridorLength: [3, 10],
            dugPercentage: 0.2,
            timeLimit: 1000 /* we stop after this much time has passed (msec) */
        }, options);
        _this._features = {
            "room": 4,
            "corridor": 4
        };
        _this._map = [];
        _this._featureAttempts = 20; /* how many times do we try to create a feature on a suitable wall */
        _this._walls = {}; /* these are available for digging */
        _this._dug = 0;
        _this._digCallback = _this._digCallback.bind(_this);
        _this._canBeDugCallback = _this._canBeDugCallback.bind(_this);
        _this._isWallCallback = _this._isWallCallback.bind(_this);
        _this._priorityWallCallback = _this._priorityWallCallback.bind(_this);
        return _this;
    }
    Digger.prototype.create = function (callback) {
        this._rooms = [];
        this._corridors = [];
        this._map = this._fillMap(1);
        this._walls = {};
        this._dug = 0;
        var area = (this._width - 2) * (this._height - 2);
        this._firstRoom();
        var t1 = Date.now();
        var priorityWalls;
        do {
            priorityWalls = 0;
            var t2 = Date.now();
            if (t2 - t1 > this._options.timeLimit) {
                break;
            }
            /* find a good wall */
            var wall = this._findWall();
            if (!wall) {
                break;
            } /* no more walls */
            var parts = wall.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            var dir = this._getDiggingDirection(x, y);
            if (!dir) {
                continue;
            } /* this wall is not suitable */
            //		console.log("wall", x, y);
            /* try adding a feature */
            var featureAttempts = 0;
            do {
                featureAttempts++;
                if (this._tryFeature(x, y, dir[0], dir[1])) { /* feature added */
                    //if (this._rooms.length + this._corridors.length == 2) { this._rooms[0].addDoor(x, y); } /* first room oficially has doors */
                    this._removeSurroundingWalls(x, y);
                    this._removeSurroundingWalls(x - dir[0], y - dir[1]);
                    break;
                }
            } while (featureAttempts < this._featureAttempts);
            for (var id in this._walls) {
                if (this._walls[id] > 1) {
                    priorityWalls++;
                }
            }
        } while (this._dug / area < this._options.dugPercentage || priorityWalls); /* fixme number of priority walls */
        this._addDoors();
        if (callback) {
            for (var i_1 = 0; i_1 < this._width; i_1++) {
                for (var j_1 = 0; j_1 < this._height; j_1++) {
                    callback(i_1, j_1, this._map[i_1][j_1]);
                }
            }
        }
        this._walls = {};
        this._map = [];
        return this;
    };
    Digger.prototype._digCallback = function (x, y, value) {
        if (value == 0 || value == 2) { /* empty */
            this._map[x][y] = 0;
            this._dug++;
        }
        else { /* wall */
            this._walls[x + "," + y] = 1;
        }
    };
    Digger.prototype._isWallCallback = function (x, y) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    };
    Digger.prototype._canBeDugCallback = function (x, y) {
        if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    };
    Digger.prototype._priorityWallCallback = function (x, y) { this._walls[x + "," + y] = 2; };
    ;
    Digger.prototype._firstRoom = function () {
        var cx = Math.floor(this._width / 2);
        var cy = Math.floor(this._height / 2);
        var room = Room.createRandomCenter(cx, cy, this._options);
        this._rooms.push(room);
        room.create(this._digCallback);
    };
    /**
     * Get a suitable wall
     */
    Digger.prototype._findWall = function () {
        var prio1 = [];
        var prio2 = [];
        for (var id_1 in this._walls) {
            var prio = this._walls[id_1];
            if (prio == 2) {
                prio2.push(id_1);
            }
            else {
                prio1.push(id_1);
            }
        }
        var arr = (prio2.length ? prio2 : prio1);
        if (!arr.length) {
            return null;
        } /* no walls :/ */
        var id = RNG.getItem(arr.sort()); // sort to make the order deterministic
        delete this._walls[id];
        return id;
    };
    /**
     * Tries adding a feature
     * @returns {bool} was this a successful try?
     */
    Digger.prototype._tryFeature = function (x, y, dx, dy) {
        var featureName = RNG.getWeightedValue(this._features);
        var ctor = FEATURES[featureName];
        var feature = ctor.createRandomAt(x, y, dx, dy, this._options);
        if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
            //		console.log("not valid");
            //		feature.debug();
            return false;
        }
        feature.create(this._digCallback);
        //	feature.debug();
        if (feature instanceof Room) {
            this._rooms.push(feature);
        }
        if (feature instanceof Corridor) {
            feature.createPriorityWalls(this._priorityWallCallback);
            this._corridors.push(feature);
        }
        return true;
    };
    Digger.prototype._removeSurroundingWalls = function (cx, cy) {
        var deltas = DIRS[4];
        for (var i_2 = 0; i_2 < deltas.length; i_2++) {
            var delta = deltas[i_2];
            var x = cx + delta[0];
            var y = cy + delta[1];
            delete this._walls[x + "," + y];
            x = cx + 2 * delta[0];
            y = cy + 2 * delta[1];
            delete this._walls[x + "," + y];
        }
    };
    /**
     * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
     */
    Digger.prototype._getDiggingDirection = function (cx, cy) {
        if (cx <= 0 || cy <= 0 || cx >= this._width - 1 || cy >= this._height - 1) {
            return null;
        }
        var result = null;
        var deltas = DIRS[4];
        for (var i_3 = 0; i_3 < deltas.length; i_3++) {
            var delta = deltas[i_3];
            var x = cx + delta[0];
            var y = cy + delta[1];
            if (!this._map[x][y]) { /* there already is another empty neighbor! */
                if (result) {
                    return null;
                }
                result = delta;
            }
        }
        /* no empty neighbor */
        if (!result) {
            return null;
        }
        return [-result[0], -result[1]];
    };
    /**
     * Find empty spaces surrounding rooms, and apply doors.
     */
    Digger.prototype._addDoors = function () {
        var data = this._map;
        function isWallCallback(x, y) {
            return (data[x][y] == 1);
        }
        ;
        for (var i_4 = 0; i_4 < this._rooms.length; i_4++) {
            var room = this._rooms[i_4];
            room.clearDoors();
            room.addDoors(isWallCallback);
        }
    };
    return Digger;
}(Dungeon));
export default Digger;
//# sourceMappingURL=digger.js.map