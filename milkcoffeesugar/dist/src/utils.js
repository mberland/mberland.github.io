// import {Display} from "../lib/index.js";
// export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)
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
export var dimensions = { width: 70, height: 30 };
export var total_cards = 3;
export var max_commodity_count = 3;
export var box_width = Math.floor(dimensions.width / 2);
export var box_height = Math.floor(dimensions.height / 2);
export var card_width = Math.floor(dimensions.width / total_cards);
export var card_height = Math.floor(dimensions.height / 2);
export var x_buffer = 2;
export var y_buffer = 1;
export var alphabet = "abcdefghijklmnopqrstuvqxyz";
export var consonants = "bcdfghjklmnpqrstvwxyz";
export var vowels = "aeiou";
export var card_fg_active = "white";
export var card_fg_inactive = "#555555";
// export const card_bg: string = "goldenrod";
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
// export enum PatchType {Empty, Wall, Floor}
// export class Patch {
//
//     private readonly _p_type: PatchType;
//
//     constructor(p: PatchType) {this._p_type = p;}
//
//     stringify(): string {
//         return this.patchString(this._p_type);
//     }
//
//     patchString(p_type: PatchType): string {
//         switch (p_type) {
//             case PatchType.Empty: return ' ';
//             case PatchType.Wall: return '#';
//             case PatchType.Floor: return '.';
//         }
//     }
// }
//# sourceMappingURL=utils.js.map