import { LogManager } from "./logmanager.js";
export var BAD_NUMBER = -28768;
export var commodities = ["Milk", "Coffee", "Sugar"];
export function commodity_text(inventory) {
    var text = "";
    for (var i_1 = 0; i_1 < commodities.length; i_1++) {
        text += inventory[i_1] + " " + commodities[i_1] + "\n";
    }
    return text;
}
export var Patch;
(function (Patch) {
    Patch[Patch["Empty"] = 0] = "Empty";
    Patch[Patch["Wall"] = 1] = "Wall";
    Patch[Patch["Floor"] = 2] = "Floor";
})(Patch || (Patch = {}));
export var dimensions = { width: 60, height: 40 };
export var info_area_dimensions = { width: dimensions.width, height: 13 };
export var card_area_dimensions = { width: dimensions.width, height: 12 };
export var button_area_dimensions = { width: dimensions.width, height: 10 };
export var help_area_dimensions = { width: dimensions.width, height: 6 };
export var x_buffer = 1;
export var y_buffer = 1;
export var total_cards = 3;
export var max_commodity_count = 3;
export var box_width = Math.floor(info_area_dimensions.width / 2);
export var box_height = info_area_dimensions.height;
export var card_width = Math.floor(card_area_dimensions.width / total_cards);
export var card_height = card_area_dimensions.height;
export var button_y = card_height + box_height - 2 * y_buffer;
export var button_width = Math.floor(card_width * total_cards / 5) - 1;
export var button_height = button_area_dimensions.height;
export var help_width = dimensions.width;
export var help_height = help_area_dimensions.height;
export var help_x = 0;
export var help_y = button_y + button_height;
export var lattes_to_win = 5;
export var alphabet = "abcdefghijklmnopqrstuvqxyz";
export var consonants = "bcdfghjklmnpqrstvwxyz";
export var vowels = "aeiou";
export var card_fg_active = "white";
export var card_fg_inactive = "#555555";
export var logger = new LogManager();
export function random_name() {
    var name = "";
    for (var nw = 0; nw < 2; nw++) {
        if (nw != 0) {
            name += " ";
        }
        name += consonants[Math.floor(Math.random() * consonants.length)].toUpperCase();
        name += vowels[Math.floor(Math.random() * vowels.length)];
        for (var i_2 = 0; i_2 < Math.ceil(Math.random() * 2); i_2++) {
            if (Math.random() < 0.4) {
                name += vowels[Math.floor(Math.random() * vowels.length)];
            }
            else {
                name += consonants[Math.floor(Math.random() * consonants.length)];
            }
        }
    }
    return name;
}
export function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
export function newlineAString(s) {
    return s.replace(/ /g, "\n");
}
//# sourceMappingURL=utils.js.map