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
import { ACard } from "./card.js";
import { commodity_text } from "./utils.js";
// import {logger} from "./utils.js";
var PlayerCard = /** @class */ (function (_super) {
    __extends(PlayerCard, _super);
    function PlayerCard(d) {
        var _this = _super.call(this, d) || this;
        _this.is_robot = false;
        _this.total_lattes_sold = 0;
        _this.inventory = [0, 0, 0];
        _this.money = 10;
        _this.name = "Player";
        _this.passed_turn = false;
        return _this;
    }
    PlayerCard.prototype.updateCardText = function () {
        var cardText = "";
        cardText += "Name: " + this.name + "\n";
        cardText += "Money: $" + this.money + "\n";
        cardText += "Inventory:\n" + commodity_text(this.inventory);
        cardText += "\nLattes sold: " + this.total_lattes_sold + "\n";
        if (this.passed_turn)
            cardText += "Passed turn";
        this.setCardText(cardText);
    };
    PlayerCard.prototype.canSell = function () {
        for (var i_1 = 0; i_1 < this.inventory.length; i_1++) {
            if (this.inventory[i_1] < 1) {
                return false;
            }
        }
        return true;
    };
    PlayerCard.prototype.sellLatte = function (current_price) {
        if (!this.canSell())
            return false;
        this.money += current_price;
        for (var i_2 = 0; i_2 < this.inventory.length; i_2++) {
            this.inventory[i_2] -= 1;
        }
        this.total_lattes_sold += 1;
        return true;
    };
    PlayerCard.prototype.make_move = function (valid_actions, current_available, current_prices) {
        return "UNKNOWN";
    };
    PlayerCard.prototype.updateCard = function () {
        this.updateCardText();
        this.draw();
    };
    return PlayerCard;
}(ACard));
export { PlayerCard };
//# sourceMappingURL=playercard.js.map