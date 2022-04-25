import { Display } from "../../lib/index.js";
var o = {
    width: 11,
    height: 5
};
var d = new Display(o);
document.body.appendChild(d.getContainer());
for (var i_1 = 0; i_1 < o.width; i_1++) {
    for (var j_1 = 0; j_1 < o.height; j_1++) {
        if (!i_1 || !j_1 || i_1 + 1 == o.width || j_1 + 1 == o.height) {
            d.draw(i_1, j_1, "#", "gray");
        }
        else {
            d.draw(i_1, j_1, ".", "#666");
        }
    }
}
d.draw(o.width >> 1, o.height >> 1, "@", "goldenrod");
//# sourceMappingURL=example.source.js.map