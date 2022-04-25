import * as utils from "./utils.js";
import { alphabet, card_fg_active, card_fg_inactive } from "./utils.js";
var ACard = /** @class */ (function () {
    function ACard(display) {
        this.fg_active = card_fg_active;
        this.fg_inactive = card_fg_inactive;
        this.bg = "black";
        this.card_text = alphabet;
        this.cx = utils.BAD_NUMBER;
        this.cy = utils.BAD_NUMBER;
        this.width = utils.BAD_NUMBER;
        this.height = utils.BAD_NUMBER;
        this.is_created = false;
        this.active = true;
        this.d = display;
    }
    ACard.prototype.getFG = function () {
        if (this.active)
            return this.fg_active;
        else
            return this.fg_inactive;
    };
    ACard.prototype.draw = function () {
        if (!this.is_created) {
            return;
        }
        this.d.drawBox(this.cx, this.cy, this.width, this.height, this.bg);
        this.d.drawTextInBox(this.card_text, this.cx, this.cy, this.width, this.height, this.getFG());
    };
    ACard.prototype.setupCard = function (x, y, width, height, fg, bg) {
        this.cx = x;
        this.cy = y;
        this.height = height;
        this.width = width;
        this.fg_active = fg;
        this.bg = bg;
        this.is_created = true;
        // logger.log("card created: ");
    };
    ACard.prototype.setCardText = function (text) {
        this.card_text = text;
    };
    return ACard;
}());
export { ACard };
//# sourceMappingURL=card.js.map