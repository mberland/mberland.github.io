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
import Map from "./map.js";
import RNG from "../rng.js";
import { DIRS } from "../constants.js";
/**
 * Dungeon generator which uses the "orginal" Rogue dungeon generation algorithm. See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
 * @author hyakugei
 */
var Rogue = /** @class */ (function (_super) {
    __extends(Rogue, _super);
    function Rogue(width, height, options) {
        var _this = _super.call(this, width, height) || this;
        _this.map = [];
        _this.rooms = [];
        _this.connectedCells = [];
        options = Object.assign({
            cellWidth: 3,
            cellHeight: 3 //     ie. as an array with min-max values for each direction....
        }, options);
        /*
        Set the room sizes according to the over-all width of the map,
        and the cell sizes.
        */
        if (!options.hasOwnProperty("roomWidth")) {
            options["roomWidth"] = _this._calculateRoomSize(_this._width, options["cellWidth"]);
        }
        if (!options.hasOwnProperty("roomHeight")) {
            options["roomHeight"] = _this._calculateRoomSize(_this._height, options["cellHeight"]);
        }
        _this._options = options;
        return _this;
    }
    Rogue.prototype.create = function (callback) {
        this.map = this._fillMap(1);
        this.rooms = [];
        this.connectedCells = [];
        this._initRooms();
        this._connectRooms();
        this._connectUnconnectedRooms();
        this._createRandomRoomConnections();
        this._createRooms();
        this._createCorridors();
        if (callback) {
            for (var i_1 = 0; i_1 < this._width; i_1++) {
                for (var j_1 = 0; j_1 < this._height; j_1++) {
                    callback(i_1, j_1, this.map[i_1][j_1]);
                }
            }
        }
        return this;
    };
    Rogue.prototype._calculateRoomSize = function (size, cell) {
        var max = Math.floor((size / cell) * 0.8);
        var min = Math.floor((size / cell) * 0.25);
        if (min < 2) {
            min = 2;
        }
        if (max < 2) {
            max = 2;
        }
        return [min, max];
    };
    Rogue.prototype._initRooms = function () {
        // create rooms array. This is the "grid" list from the algo.
        for (var i_2 = 0; i_2 < this._options.cellWidth; i_2++) {
            this.rooms.push([]);
            for (var j_2 = 0; j_2 < this._options.cellHeight; j_2++) {
                this.rooms[i_2].push({ "x": 0, "y": 0, "width": 0, "height": 0, "connections": [], "cellx": i_2, "celly": j_2 });
            }
        }
    };
    Rogue.prototype._connectRooms = function () {
        //pick random starting grid
        var cgx = RNG.getUniformInt(0, this._options.cellWidth - 1);
        var cgy = RNG.getUniformInt(0, this._options.cellHeight - 1);
        var idx;
        var ncgx;
        var ncgy;
        var found = false;
        var room;
        var otherRoom;
        var dirToCheck;
        // find  unconnected neighbour cells
        do {
            //dirToCheck = [0, 1, 2, 3, 4, 5, 6, 7];
            dirToCheck = [0, 2, 4, 6];
            dirToCheck = RNG.shuffle(dirToCheck);
            do {
                found = false;
                idx = dirToCheck.pop();
                ncgx = cgx + DIRS[8][idx][0];
                ncgy = cgy + DIRS[8][idx][1];
                if (ncgx < 0 || ncgx >= this._options.cellWidth) {
                    continue;
                }
                if (ncgy < 0 || ncgy >= this._options.cellHeight) {
                    continue;
                }
                room = this.rooms[cgx][cgy];
                if (room["connections"].length > 0) {
                    // as long as this room doesn't already coonect to me, we are ok with it.
                    if (room["connections"][0][0] == ncgx && room["connections"][0][1] == ncgy) {
                        break;
                    }
                }
                otherRoom = this.rooms[ncgx][ncgy];
                if (otherRoom["connections"].length == 0) {
                    otherRoom["connections"].push([cgx, cgy]);
                    this.connectedCells.push([ncgx, ncgy]);
                    cgx = ncgx;
                    cgy = ncgy;
                    found = true;
                }
            } while (dirToCheck.length > 0 && found == false);
        } while (dirToCheck.length > 0);
    };
    Rogue.prototype._connectUnconnectedRooms = function () {
        //While there are unconnected rooms, try to connect them to a random connected neighbor
        //(if a room has no connected neighbors yet, just keep cycling, you'll fill out to it eventually).
        var cw = this._options.cellWidth;
        var ch = this._options.cellHeight;
        this.connectedCells = RNG.shuffle(this.connectedCells);
        var room;
        var otherRoom;
        var validRoom;
        for (var i_3 = 0; i_3 < this._options.cellWidth; i_3++) {
            for (var j_3 = 0; j_3 < this._options.cellHeight; j_3++) {
                room = this.rooms[i_3][j_3];
                if (room["connections"].length == 0) {
                    var directions = [0, 2, 4, 6];
                    directions = RNG.shuffle(directions);
                    validRoom = false;
                    do {
                        var dirIdx = directions.pop();
                        var newI = i_3 + DIRS[8][dirIdx][0];
                        var newJ = j_3 + DIRS[8][dirIdx][1];
                        if (newI < 0 || newI >= cw || newJ < 0 || newJ >= ch) {
                            continue;
                        }
                        otherRoom = this.rooms[newI][newJ];
                        validRoom = true;
                        if (otherRoom["connections"].length == 0) {
                            break;
                        }
                        for (var k = 0; k < otherRoom["connections"].length; k++) {
                            if (otherRoom["connections"][k][0] == i_3 && otherRoom["connections"][k][1] == j_3) {
                                validRoom = false;
                                break;
                            }
                        }
                        if (validRoom) {
                            break;
                        }
                    } while (directions.length);
                    if (validRoom) {
                        room["connections"].push([otherRoom["cellx"], otherRoom["celly"]]);
                    }
                    else {
                        console.log("-- Unable to connect room.");
                    }
                }
            }
        }
    };
    Rogue.prototype._createRandomRoomConnections = function () {
        // Empty for now.
    };
    Rogue.prototype._createRooms = function () {
        var w = this._width;
        var h = this._height;
        var cw = this._options.cellWidth;
        var ch = this._options.cellHeight;
        var cwp = Math.floor(this._width / cw);
        var chp = Math.floor(this._height / ch);
        var roomw;
        var roomh;
        var roomWidth = this._options["roomWidth"];
        var roomHeight = this._options["roomHeight"];
        var sx;
        var sy;
        var otherRoom;
        for (var i_4 = 0; i_4 < cw; i_4++) {
            for (var j_4 = 0; j_4 < ch; j_4++) {
                sx = cwp * i_4;
                sy = chp * j_4;
                if (sx == 0) {
                    sx = 1;
                }
                if (sy == 0) {
                    sy = 1;
                }
                roomw = RNG.getUniformInt(roomWidth[0], roomWidth[1]);
                roomh = RNG.getUniformInt(roomHeight[0], roomHeight[1]);
                if (j_4 > 0) {
                    otherRoom = this.rooms[i_4][j_4 - 1];
                    while (sy - (otherRoom["y"] + otherRoom["height"]) < 3) {
                        sy++;
                    }
                }
                if (i_4 > 0) {
                    otherRoom = this.rooms[i_4 - 1][j_4];
                    while (sx - (otherRoom["x"] + otherRoom["width"]) < 3) {
                        sx++;
                    }
                }
                var sxOffset = Math.round(RNG.getUniformInt(0, cwp - roomw) / 2);
                var syOffset = Math.round(RNG.getUniformInt(0, chp - roomh) / 2);
                while (sx + sxOffset + roomw >= w) {
                    if (sxOffset) {
                        sxOffset--;
                    }
                    else {
                        roomw--;
                    }
                }
                while (sy + syOffset + roomh >= h) {
                    if (syOffset) {
                        syOffset--;
                    }
                    else {
                        roomh--;
                    }
                }
                sx = sx + sxOffset;
                sy = sy + syOffset;
                this.rooms[i_4][j_4]["x"] = sx;
                this.rooms[i_4][j_4]["y"] = sy;
                this.rooms[i_4][j_4]["width"] = roomw;
                this.rooms[i_4][j_4]["height"] = roomh;
                for (var ii = sx; ii < sx + roomw; ii++) {
                    for (var jj = sy; jj < sy + roomh; jj++) {
                        this.map[ii][jj] = 0;
                    }
                }
            }
        }
    };
    Rogue.prototype._getWallPosition = function (aRoom, aDirection) {
        var rx;
        var ry;
        var door;
        if (aDirection == 1 || aDirection == 3) {
            rx = RNG.getUniformInt(aRoom["x"] + 1, aRoom["x"] + aRoom["width"] - 2);
            if (aDirection == 1) {
                ry = aRoom["y"] - 2;
                door = ry + 1;
            }
            else {
                ry = aRoom["y"] + aRoom["height"] + 1;
                door = ry - 1;
            }
            this.map[rx][door] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
        }
        else {
            ry = RNG.getUniformInt(aRoom["y"] + 1, aRoom["y"] + aRoom["height"] - 2);
            if (aDirection == 2) {
                rx = aRoom["x"] + aRoom["width"] + 1;
                door = rx - 1;
            }
            else {
                rx = aRoom["x"] - 2;
                door = rx + 1;
            }
            this.map[door][ry] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
        }
        return [rx, ry];
    };
    Rogue.prototype._drawCorridor = function (startPosition, endPosition) {
        var xOffset = endPosition[0] - startPosition[0];
        var yOffset = endPosition[1] - startPosition[1];
        var xpos = startPosition[0];
        var ypos = startPosition[1];
        var tempDist;
        var xDir;
        var yDir;
        var move; // 2 element array, element 0 is the direction, element 1 is the total value to move.
        var moves = []; // a list of 2 element arrays
        var xAbs = Math.abs(xOffset);
        var yAbs = Math.abs(yOffset);
        var percent = RNG.getUniform(); // used to split the move at different places along the long axis
        var firstHalf = percent;
        var secondHalf = 1 - percent;
        xDir = xOffset > 0 ? 2 : 6;
        yDir = yOffset > 0 ? 4 : 0;
        if (xAbs < yAbs) {
            // move firstHalf of the y offset
            tempDist = Math.ceil(yAbs * firstHalf);
            moves.push([yDir, tempDist]);
            // move all the x offset
            moves.push([xDir, xAbs]);
            // move sendHalf of the  y offset
            tempDist = Math.floor(yAbs * secondHalf);
            moves.push([yDir, tempDist]);
        }
        else {
            //  move firstHalf of the x offset
            tempDist = Math.ceil(xAbs * firstHalf);
            moves.push([xDir, tempDist]);
            // move all the y offset
            moves.push([yDir, yAbs]);
            // move secondHalf of the x offset.
            tempDist = Math.floor(xAbs * secondHalf);
            moves.push([xDir, tempDist]);
        }
        this.map[xpos][ypos] = 0;
        while (moves.length > 0) {
            move = moves.pop();
            while (move[1] > 0) {
                xpos += DIRS[8][move[0]][0];
                ypos += DIRS[8][move[0]][1];
                this.map[xpos][ypos] = 0;
                move[1] = move[1] - 1;
            }
        }
    };
    Rogue.prototype._createCorridors = function () {
        // Draw Corridors between connected rooms
        var cw = this._options.cellWidth;
        var ch = this._options.cellHeight;
        var room;
        var connection;
        var otherRoom;
        var wall;
        var otherWall;
        for (var i_5 = 0; i_5 < cw; i_5++) {
            for (var j_5 = 0; j_5 < ch; j_5++) {
                room = this.rooms[i_5][j_5];
                for (var k = 0; k < room["connections"].length; k++) {
                    connection = room["connections"][k];
                    otherRoom = this.rooms[connection[0]][connection[1]];
                    // figure out what wall our corridor will start one.
                    // figure out what wall our corridor will end on.
                    if (otherRoom["cellx"] > room["cellx"]) {
                        wall = 2;
                        otherWall = 4;
                    }
                    else if (otherRoom["cellx"] < room["cellx"]) {
                        wall = 4;
                        otherWall = 2;
                    }
                    else if (otherRoom["celly"] > room["celly"]) {
                        wall = 3;
                        otherWall = 1;
                    }
                    else {
                        wall = 1;
                        otherWall = 3;
                    }
                    this._drawCorridor(this._getWallPosition(room, wall), this._getWallPosition(otherRoom, otherWall));
                }
            }
        }
    };
    return Rogue;
}(Map));
export default Rogue;
//# sourceMappingURL=rogue.js.map