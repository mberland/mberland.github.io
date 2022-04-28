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
var ButtonCard = /** @class */ (function (_super) {
    __extends(ButtonCard, _super);
    function ButtonCard(d) {
        var _this = _super.call(this, d) || this;
        _this.name = "BUTTON";
        _this.choiceNumber = -1;
        return _this;
    }
    return ButtonCard;
}(PlayerCard));
export { ButtonCard };
//# sourceMappingURL=buttoncard.js.map