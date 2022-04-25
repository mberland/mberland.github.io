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
;
/**
 * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
 * @augments ROT.Map.Dungeon
 */
var Uniform = /** @class */ (function (_super) {
    __extends(Uniform, _super);
    function Uniform(width, height, options) {
        var _this = _super.call(this, width, height) || this;
        _this._options = {
            roomWidth: [3, 9],
            roomHeight: [3, 5],
            roomDugPercentage: 0.1,
            timeLimit: 1000 /* we stop after this much time has passed (msec) */
        };
        Object.assign(_this._options, options);
        _this._map = [];
        _this._dug = 0;
        _this._roomAttempts = 20; /* new room is created N-times until is considered as impossible to generate */
        _this._corridorAttempts = 20; /* corridors are tried N-times until the level is considered as impossible to connect */
        _this._connected = []; /* list of already connected rooms */
        _this._unconnected = []; /* list of remaining unconnected rooms */
        _this._digCallback = _this._digCallback.bind(_this);
        _this._canBeDugCallback = _this._canBeDugCallback.bind(_this);
        _this._isWallCallback = _this._isWallCallback.bind(_this);
        return _this;
    }
    /**
     * Create a map. If the time limit has been hit, returns null.
     * @see ROT.Map#create
     */
    Uniform.prototype.create = function (callback) {
        var t1 = Date.now();
        while (1) {
            var t2 = Date.now();
            if (t2 - t1 > this._options.timeLimit) {
                return null;
            } /* time limit! */
            this._map = this._fillMap(1);
            this._dug = 0;
            this._rooms = [];
            this._unconnected = [];
            this._generateRooms();
            if (this._rooms.length < 2) {
                continue;
            }
            if (this._generateCorridors()) {
                break;
            }
        }
        if (callback) {
            for (var i_1 = 0; i_1 < this._width; i_1++) {
                for (var j_1 = 0; j_1 < this._height; j_1++) {
                    callback(i_1, j_1, this._map[i_1][j_1]);
                }
            }
        }
        return this;
    };
    /**
     * Generates a suitable amount of rooms
     */
    Uniform.prototype._generateRooms = function () {
        var w = this._width - 2;
        var h = this._height - 2;
        var room;
        do {
            room = this._generateRoom();
            if (this._dug / (w * h) > this._options.roomDugPercentage) {
                break;
            } /* achieved requested amount of free space */
        } while (room);
        /* either enough rooms, or not able to generate more of them :) */
    };
    /**
     * Try to generate one room
     */
    Uniform.prototype._generateRoom = function () {
        var count = 0;
        while (count < this._roomAttempts) {
            count++;
            var room = Room.createRandom(this._width, this._height, this._options);
            if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) {
                continue;
            }
            room.create(this._digCallback);
            this._rooms.push(room);
            return room;
        }
        /* no room was generated in a given number of attempts */
        return null;
    };
    /**
     * Generates connectors beween rooms
     * @returns {bool} success Was this attempt successfull?
     */
    Uniform.prototype._generateCorridors = function () {
        var cnt = 0;
        while (cnt < this._corridorAttempts) {
            cnt++;
            this._corridors = [];
            /* dig rooms into a clear map */
            this._map = this._fillMap(1);
            for (var i_2 = 0; i_2 < this._rooms.length; i_2++) {
                var room = this._rooms[i_2];
                room.clearDoors();
                room.create(this._digCallback);
            }
            this._unconnected = RNG.shuffle(this._rooms.slice());
            this._connected = [];
            if (this._unconnected.length) {
                this._connected.push(this._unconnected.pop());
            } /* first one is always connected */
            while (1) {
                /* 1. pick random connected room */
                var connected = RNG.getItem(this._connected);
                if (!connected) {
                    break;
                }
                /* 2. find closest unconnected */
                var room1 = this._closestRoom(this._unconnected, connected);
                if (!room1) {
                    break;
                }
                /* 3. connect it to closest connected */
                var room2 = this._closestRoom(this._connected, room1);
                if (!room2) {
                    break;
                }
                var ok = this._connectRooms(room1, room2);
                if (!ok) {
                    break;
                } /* stop connecting, re-shuffle */
                if (!this._unconnected.length) {
                    return true;
                } /* done; no rooms remain */
            }
        }
        return false;
    };
    ;
    /**
     * For a given room, find the closest one from the list
     */
    Uniform.prototype._closestRoom = function (rooms, room) {
        var dist = Infinity;
        var center = room.getCenter();
        var result = null;
        for (var i_3 = 0; i_3 < rooms.length; i_3++) {
            var r = rooms[i_3];
            var c = r.getCenter();
            var dx = c[0] - center[0];
            var dy = c[1] - center[1];
            var d_1 = dx * dx + dy * dy;
            if (d_1 < dist) {
                dist = d_1;
                result = r;
            }
        }
        return result;
    };
    Uniform.prototype._connectRooms = function (room1, room2) {
        /*
            room1.debug();
            room2.debug();
        */
        var center1 = room1.getCenter();
        var center2 = room2.getCenter();
        var diffX = center2[0] - center1[0];
        var diffY = center2[1] - center1[1];
        var start;
        var end;
        var dirIndex1, dirIndex2, min, max, index;
        if (Math.abs(diffX) < Math.abs(diffY)) { /* first try connecting north-south walls */
            dirIndex1 = (diffY > 0 ? 2 : 0);
            dirIndex2 = (dirIndex1 + 2) % 4;
            min = room2.getLeft();
            max = room2.getRight();
            index = 0;
        }
        else { /* first try connecting east-west walls */
            dirIndex1 = (diffX > 0 ? 1 : 3);
            dirIndex2 = (dirIndex1 + 2) % 4;
            min = room2.getTop();
            max = room2.getBottom();
            index = 1;
        }
        start = this._placeInWall(room1, dirIndex1); /* corridor will start here */
        if (!start) {
            return false;
        }
        if (start[index] >= min && start[index] <= max) { /* possible to connect with straight line (I-like) */
            end = start.slice();
            var value = 0;
            switch (dirIndex2) {
                case 0:
                    value = room2.getTop() - 1;
                    break;
                case 1:
                    value = room2.getRight() + 1;
                    break;
                case 2:
                    value = room2.getBottom() + 1;
                    break;
                case 3:
                    value = room2.getLeft() - 1;
                    break;
            }
            end[(index + 1) % 2] = value;
            this._digLine([start, end]);
        }
        else if (start[index] < min - 1 || start[index] > max + 1) { /* need to switch target wall (L-like) */
            var diff = start[index] - center2[index];
            var rotation = 0;
            switch (dirIndex2) {
                case 0:
                case 1:
                    rotation = (diff < 0 ? 3 : 1);
                    break;
                case 2:
                case 3:
                    rotation = (diff < 0 ? 1 : 3);
                    break;
            }
            dirIndex2 = (dirIndex2 + rotation) % 4;
            end = this._placeInWall(room2, dirIndex2);
            if (!end) {
                return false;
            }
            var mid = [0, 0];
            mid[index] = start[index];
            var index2 = (index + 1) % 2;
            mid[index2] = end[index2];
            this._digLine([start, mid, end]);
        }
        else { /* use current wall pair, but adjust the line in the middle (S-like) */
            var index2 = (index + 1) % 2;
            end = this._placeInWall(room2, dirIndex2);
            if (!end) {
                return false;
            }
            var mid = Math.round((end[index2] + start[index2]) / 2);
            var mid1 = [0, 0];
            var mid2 = [0, 0];
            mid1[index] = start[index];
            mid1[index2] = mid;
            mid2[index] = end[index];
            mid2[index2] = mid;
            this._digLine([start, mid1, mid2, end]);
        }
        room1.addDoor(start[0], start[1]);
        room2.addDoor(end[0], end[1]);
        index = this._unconnected.indexOf(room1);
        if (index != -1) {
            this._unconnected.splice(index, 1);
            this._connected.push(room1);
        }
        index = this._unconnected.indexOf(room2);
        if (index != -1) {
            this._unconnected.splice(index, 1);
            this._connected.push(room2);
        }
        return true;
    };
    Uniform.prototype._placeInWall = function (room, dirIndex) {
        var start = [0, 0];
        var dir = [0, 0];
        var length = 0;
        switch (dirIndex) {
            case 0:
                dir = [1, 0];
                start = [room.getLeft(), room.getTop() - 1];
                length = room.getRight() - room.getLeft() + 1;
                break;
            case 1:
                dir = [0, 1];
                start = [room.getRight() + 1, room.getTop()];
                length = room.getBottom() - room.getTop() + 1;
                break;
            case 2:
                dir = [1, 0];
                start = [room.getLeft(), room.getBottom() + 1];
                length = room.getRight() - room.getLeft() + 1;
                break;
            case 3:
                dir = [0, 1];
                start = [room.getLeft() - 1, room.getTop()];
                length = room.getBottom() - room.getTop() + 1;
                break;
        }
        var avail = [];
        var lastBadIndex = -2;
        for (var i_4 = 0; i_4 < length; i_4++) {
            var x = start[0] + i_4 * dir[0];
            var y = start[1] + i_4 * dir[1];
            avail.push(null);
            var isWall = (this._map[x][y] == 1);
            if (isWall) {
                if (lastBadIndex != i_4 - 1) {
                    avail[i_4] = [x, y];
                }
            }
            else {
                lastBadIndex = i_4;
                if (i_4) {
                    avail[i_4 - 1] = null;
                }
            }
        }
        for (var i_5 = avail.length - 1; i_5 >= 0; i_5--) {
            if (!avail[i_5]) {
                avail.splice(i_5, 1);
            }
        }
        return (avail.length ? RNG.getItem(avail) : null);
    };
    /**
     * Dig a polyline.
     */
    Uniform.prototype._digLine = function (points) {
        for (var i_6 = 1; i_6 < points.length; i_6++) {
            var start = points[i_6 - 1];
            var end = points[i_6];
            var corridor = new Corridor(start[0], start[1], end[0], end[1]);
            corridor.create(this._digCallback);
            this._corridors.push(corridor);
        }
    };
    Uniform.prototype._digCallback = function (x, y, value) {
        this._map[x][y] = value;
        if (value == 0) {
            this._dug++;
        }
    };
    Uniform.prototype._isWallCallback = function (x, y) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    };
    Uniform.prototype._canBeDugCallback = function (x, y) {
        if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    };
    return Uniform;
}(Dungeon));
export default Uniform;
//# sourceMappingURL=uniform.js.map