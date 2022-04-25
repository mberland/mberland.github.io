var TextBuffer = /** @class */ (function () {
    function TextBuffer() {
        this._data = [];
        this._options = {
            display: null,
            position: new XY(),
            size: new XY()
        };
    }
    TextBuffer.prototype.configure = function (options) { Object.assign(this._options, options); };
    TextBuffer.prototype.clear = function () { this._data = []; };
    TextBuffer.prototype.write = function (text) { this._data.push(text); };
    TextBuffer.prototype.flush = function () {
        var o = this._options;
        var d = o.display;
        var pos = o.position;
        var size = o.size;
        // clear
        for (var i_1 = 0; i_1 < size.x; i_1++) {
            for (var j_1 = 0; j_1 < size.y; j_1++) {
                d.draw(pos.x + i_1, pos.y + j_1);
            }
        }
        var text = this._data.join(" ");
        d.drawText(pos.x, pos.y, text, size.x);
    };
    return TextBuffer;
}());
//# sourceMappingURL=textbuffer.js.map