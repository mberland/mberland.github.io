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
import { PlayerCard } from "./playercard.js";
var RobotCard = /** @class */ (function (_super) {
    __extends(RobotCard, _super);
    function RobotCard(d) {
        var _this = _super.call(this, d) || this;
        _this.is_robot = true;
        return _this;
    }
    RobotCard.prototype.can_sell = function () {
        for (var i_1 = 0; i_1 < this.inventory.length; i_1++) {
            if (this.inventory[i_1] < 1) {
                return false;
            }
        }
        return true;
    };
    RobotCard.prototype.make_move = function (valid_actions, current_available, current_prices) {
        // don't sell when below 2
        // don't bid above $2/item
        if (this.can_sell() && current_prices[0] > 2) {
            return "5";
        }
        return valid_actions[Math.floor(Math.random() * valid_actions.length)].toString();
    };
    return RobotCard;
}(PlayerCard));
export { RobotCard };
//# sourceMappingURL=robotplayer.js.map