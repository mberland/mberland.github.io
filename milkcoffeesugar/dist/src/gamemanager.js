var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { DisplayManager } from "./displaymanager.js";
import { ACard } from "./card.js";
import { PlayerCard } from "./playercard.js";
import { RobotCard } from "./robotplayer.js";
import { card_height, card_width, logger, box_width, total_cards, x_buffer, y_buffer, box_height, commodities, commodity_text, max_commodity_count } from "./utils.js";
var GameManager = /** @class */ (function () {
    function GameManager() {
        this.cards = [];
        this.inventory = [0, 0, 0];
        this.inventory_box_text = "NONE";
        this.gameplay_box_text = "NONE";
        this.current_player = 0;
        this.current_bid = 0;
        this.current_bidder = -1;
        this.current_commodity = -1;
        this.current_latte_price = 3;
        this.d = new DisplayManager();
        this.gameplay_box = new ACard(this.d);
        this.inventory_box = new ACard(this.d);
        this.setup();
    }
    GameManager.prototype.updateInventory = function () {
        this.inventory_box_text = "Available:\n";
        this.inventory_box_text += commodity_text(this.inventory);
        if (this.current_commodity >= 0) {
            this.inventory_box_text += "\nCurrent Commodity: " + commodities[this.current_commodity];
            this.inventory_box_text += "\nCurrent Bid: " + this.current_bid;
        }
        this.inventory_box.setCardText(this.inventory_box_text);
        this.inventory_box.draw();
    };
    GameManager.prototype.updateGame = function () {
        this.gameplay_box_text = "Actions (P" + (1 + this.current_player) + " - " + this.cards[this.current_player].name + "):";
        for (var i_1 = 0; i_1 < commodities.length; i_1++) {
            this.gameplay_box_text += "\n" + (i_1 + 1) + ". ";
            if (this.inventory[i_1] > 0) {
                if (i_1 == this.current_commodity) {
                    this.gameplay_box_text += "Upbid " + commodities[i_1] + " ($" + (this.current_bid + 1) + ")";
                }
                else if (-1 == this.current_commodity) {
                    this.gameplay_box_text += "Bid " + commodities[i_1];
                }
            }
        }
        this.gameplay_box_text += "\n4. Pass (All Pass => Stock+)\n5. Sell Latte (1M 1C 1S)";
        this.gameplay_box_text += "\n\nCurrent Latte Price: $" + this.current_latte_price;
        this.gameplay_box.setCardText(this.gameplay_box_text);
        this.gameplay_box.draw();
    };
    GameManager.prototype.setup = function () {
        this.inventory = [Math.ceil(Math.random() * max_commodity_count), Math.ceil(Math.random() * max_commodity_count), Math.ceil(Math.random() * max_commodity_count)];
        this.gameplay_box.setupCard(0, 0, box_width - x_buffer, box_height - y_buffer, "white", "blue");
        this.inventory_box.setupCard(box_width, 0, box_width - x_buffer, box_height - y_buffer, "white", "red");
        var card_index = 0;
        (this.cards)[card_index] = new PlayerCard(this.d);
        (this.cards)[card_index].setupCard(0, card_height, card_width - x_buffer, card_height - x_buffer, "white", "green");
        card_index++;
        for (var i_2 = 1; i_2 < total_cards; i_2++) {
            (this.cards)[card_index] = new RobotCard(this.d);
            (this.cards)[card_index].setupCard(i_2 * card_width, card_height, card_width - x_buffer, card_height - x_buffer, "white", "green");
            card_index++;
        }
    };
    GameManager.prototype.showAllCards = function () {
        this.updateGame();
        this.updateInventory();
        for (var i_3 = 0; i_3 < this.cards.length; i_3++) {
            if (i_3 == this.current_player)
                this.cards[i_3].active = true;
            else
                this.cards[i_3].active = false;
            (this.cards)[i_3].updateCard();
        }
    };
    GameManager.prototype.nextTurn = function () {
        this.current_player = (this.current_player + 1) % this.cards.length;
    };
    GameManager.prototype.makeBid = function () {
        if (this.current_bidder != this.current_player) {
            if (this.current_bid + 1 <= this.cards[this.current_player].money) {
                this.current_bid += 1;
                this.current_bidder = this.current_player;
                this.nextTurn();
            }
            else {
                logger.message("You don't have enough money to bid that much!");
            }
        }
        else {
            logger.message("Current high bidder cannot bid: " + this.cards[this.current_player].name);
        }
    };
    GameManager.prototype.doBid = function (bidID) {
        var bid = parseInt(bidID) - 1;
        if (this.inventory[bid] < 1)
            return;
        if (this.current_commodity == -1 || this.current_commodity == bid) {
            if (bid >= 0 && bid < commodities.length) {
                this.current_commodity = bid;
                this.makeBid();
            }
        }
    };
    GameManager.prototype.doPass = function () {
        this.cards[this.current_player].passed_turn = true;
        this.nextTurn();
    };
    GameManager.prototype.doSell = function () {
        if (this.cards[this.current_player].sellLatte(this.current_latte_price)) {
            this.current_latte_price = Math.ceil(this.current_latte_price * 0.5);
            this.nextTurn();
        }
    };
    GameManager.prototype.doReplaceCommodity = function () {
        // this.inventory[Math.floor(Math.random() * this.inventory.length)] += 1 + Math.floor(Math.random() * 3);
        for (var i_4 = 0; i_4 < this.inventory.length; i_4++) {
            this.inventory[i_4] += Math.floor(Math.random() * 3);
        }
        this.current_latte_price += 1;
        for (var i_5 = 0; i_5 < this.cards.length; i_5++) {
            this.cards[i_5].money += 1;
        }
    };
    GameManager.prototype.doExecuteSuccessfulBid = function () {
        if (!(this.current_bidder >= 0 && this.current_bid > 0))
            return false;
        if (this.inventory[this.current_commodity] < 1)
            return false;
        if (this.cards[this.current_bidder].money < this.current_bid)
            return false;
        this.cards[this.current_bidder].money -= this.current_bid;
        this.cards[this.current_bidder].inventory[this.current_commodity] += this.inventory[this.current_commodity];
        this.inventory[this.current_commodity] = 0;
        this.current_bid = 1;
        this.current_bidder = -1;
        this.current_commodity = -1;
        return true;
    };
    GameManager.prototype.doRoundCheck = function () {
        var all_passed = true;
        for (var i_6 = 0; i_6 < this.cards.length; i_6++) {
            if (!this.cards[i_6].passed_turn) {
                all_passed = false;
                break;
            }
        }
        if (all_passed) {
            if (this.doExecuteSuccessfulBid()) {
                this.doReplaceCommodity();
                this.doResetRound();
            }
        }
    };
    GameManager.prototype.doResetRound = function () {
        this.current_bid = 0;
        this.current_commodity = -1;
        logger.reset();
        for (var i_7 = 0; i_7 < this.cards.length; i_7++) {
            this.cards[i_7].passed_turn = false;
        }
    };
    GameManager.prototype.validActions = function () {
        var actions = [];
        actions.push(4);
        if (this.current_bidder == -1) {
            for (var i_8 = 0; i_8 < commodities.length; i_8++) {
                if (this.inventory[i_8] > 0) {
                    actions.push(i_8 + 1);
                }
            }
        }
        else if (this.current_bidder != this.current_player) {
            actions.push(this.current_commodity + 1);
        }
        return actions;
    };
    GameManager.prototype.handleInput = function (s) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (s === "1" || s === "2" || s === "3") {
                            this.doBid(s);
                        }
                        else if (s === "4") {
                            this.doPass();
                        }
                        else if (s === "5") {
                            this.doSell();
                        }
                        this.doRoundCheck();
                        this.showAllCards();
                        _a.label = 1;
                    case 1:
                        if (!this.cards[this.current_player].is_robot) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.handleInput(this.cards[this.current_player].make_move(this.validActions(), this.inventory, [this.current_latte_price]))];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return GameManager;
}());
export { GameManager };
//# sourceMappingURL=gamemanager.js.map