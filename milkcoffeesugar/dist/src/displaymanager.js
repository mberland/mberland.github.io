import { dimensions, Patch } from "./utils.js";
import { Display } from "../lib/index.js";
// import {KEYS} from "../lib/constants.js"
var DisplayManager = /** @class */ (function () {
    function DisplayManager() {
        this.PatchChar = [" ", "#", "."];
        this.d = new Display(dimensions);
        this._ctx = this.d.getContainer();
        document.body.appendChild(this.d.getContainer());
    }
    DisplayManager.prototype.draw = function (x, y, c, fg, bg) {
        this.d.draw(x, y, c, fg, bg);
    };
    DisplayManager.prototype.drawBox = function (x, y, width, height, fg) {
        for (var row = 0; row < height; row++) {
            for (var col = 0; col < width; col++) {
                var c = (this.PatchChar)[Patch.Empty];
                if (row == 0 && col == 0) {
                    c = "╔";
                }
                else if (row == 0 && col == width - 1) {
                    c = "╗";
                }
                else if (row == height - 1 && col == 0) {
                    c = "╚";
                }
                else if (row == height - 1 && col == width - 1) {
                    c = "╝";
                }
                else if (row == 0 || row == height - 1) {
                    c = "═";
                }
                else if (col == 0 || col == width - 1) {
                    c = "║";
                }
                this.draw(x + col, y + row, c, fg, "black");
            }
        }
    };
    DisplayManager.prototype.drawTextInBox = function (text, x, y, width, height, fg, vcenter) {
        if (vcenter === void 0) { vcenter = true; }
        var row_window = height - 2;
        var col_window = width - 2;
        var cc = 0;
        var start_row = 0;
        if (vcenter) {
            var total_rows = text.split("\n").length;
            start_row = Math.floor((row_window - total_rows) / 2);
        }
        for (var row = start_row; row < row_window; row++) {
            for (var col = 0; col < col_window; col++) {
                var c = text[cc];
                cc += 1;
                if (c == "\n") {
                    break;
                }
                this.draw(x + col + 1, y + row + 1, c, fg, "black");
            }
        }
    };
    DisplayManager.prototype.eventToPosition = function (e) {
        return this.d.eventToPosition(e);
    };
    return DisplayManager;
}());
export { DisplayManager };
//# sourceMappingURL=displaymanager.js.map