import { dimensions, Patch, x_buffer } from "./utils.js";
import { Display } from "../lib/index.js";
// import {KEYS} from "../lib/constants.js"
var DisplayManager = /** @class */ (function () {
    function DisplayManager() {
        this.PatchChar = [" ", "#", "."];
        this.d = new Display(dimensions);
        var div = document.createElement("div");
        div.id = "rot";
        // document.body.addEventListener("keydown", function (e) {
        //     let code = e.keyCode;
        //
        //     let vk = "?"; /* find the corresponding constant */
        //     for (let name in KEYS) {
        //         if (KEYS[name] == code && name.indexOf("VK_") == 0) {
        //             vk = name;
        //         }
        //     }
        //
        //     logger.log("Keydown: code is " + code + " (" + vk + ")");
        // });
        document.body.appendChild(div);
        div.appendChild(this.d.getContainer());
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
    DisplayManager.prototype.drawTextInBox = function (text, x, y, width, height, fg) {
        var row_window = height - 2 * x_buffer;
        var col_window = width - 2 * x_buffer;
        var cc = 0;
        for (var row = 0; row < row_window; row++) {
            for (var col = 0; col < col_window; col++) {
                var c = text[cc];
                cc += 1;
                if (c == "\n") {
                    break;
                }
                this.draw(x + x_buffer + col, y + x_buffer + row, c, fg, "black");
            }
        }
        // for (let i = 0; i < text.length; i++) {
        //     if (i > col_window * row_window) {
        //         return;
        //     }
        //     let tx = (i % col_window) + x_buffer;
        //     let ty = Math.floor(i / col_window) + x_buffer;
        //     this.d.draw(x + tx, y + ty, text[i], fg, "black");
        // }
    };
    return DisplayManager;
}());
export { DisplayManager };
//# sourceMappingURL=DisplayManager.js.map