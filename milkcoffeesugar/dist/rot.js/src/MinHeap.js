var MinHeap = /** @class */ (function () {
    function MinHeap() {
        this.heap = [];
        this.timestamp = 0;
    }
    MinHeap.prototype.lessThan = function (a, b) {
        return a.key == b.key ? a.timestamp < b.timestamp : a.key < b.key;
    };
    MinHeap.prototype.shift = function (v) {
        this.heap = this.heap.map(function (_a) {
            var key = _a.key, value = _a.value, timestamp = _a.timestamp;
            return ({ key: key + v, value: value, timestamp: timestamp });
        });
    };
    MinHeap.prototype.len = function () {
        return this.heap.length;
    };
    MinHeap.prototype.push = function (value, key) {
        this.timestamp += 1;
        var loc = this.len();
        this.heap.push({ value: value, timestamp: this.timestamp, key: key });
        this.updateUp(loc);
    };
    MinHeap.prototype.pop = function () {
        if (this.len() == 0) {
            throw new Error("no element to pop");
        }
        var top = this.heap[0];
        if (this.len() > 1) {
            this.heap[0] = this.heap.pop();
            this.updateDown(0);
        }
        else {
            this.heap.pop();
        }
        return top;
    };
    MinHeap.prototype.find = function (v) {
        for (var i_1 = 0; i_1 < this.len(); i_1++) {
            if (v == this.heap[i_1].value) {
                return this.heap[i_1];
            }
        }
        return null;
    };
    MinHeap.prototype.remove = function (v) {
        var index = null;
        for (var i_2 = 0; i_2 < this.len(); i_2++) {
            if (v == this.heap[i_2].value) {
                index = i_2;
            }
        }
        if (index === null) {
            return false;
        }
        if (this.len() > 1) {
            var last = this.heap.pop();
            if (last.value != v) { // if the last one is being removed, do nothing
                this.heap[index] = last;
                this.updateDown(index);
            }
            return true;
        }
        else {
            this.heap.pop();
        }
        return true;
    };
    MinHeap.prototype.parentNode = function (x) {
        return Math.floor((x - 1) / 2);
    };
    MinHeap.prototype.leftChildNode = function (x) {
        return 2 * x + 1;
    };
    MinHeap.prototype.rightChildNode = function (x) {
        return 2 * x + 2;
    };
    MinHeap.prototype.existNode = function (x) {
        return x >= 0 && x < this.heap.length;
    };
    MinHeap.prototype.swap = function (x, y) {
        var t = this.heap[x];
        this.heap[x] = this.heap[y];
        this.heap[y] = t;
    };
    MinHeap.prototype.minNode = function (numbers) {
        var validnumbers = numbers.filter(this.existNode.bind(this));
        var minimal = validnumbers[0];
        for (var _i = 0, validnumbers_1 = validnumbers; _i < validnumbers_1.length; _i++) {
            var i_3 = validnumbers_1[_i];
            if (this.lessThan(this.heap[i_3], this.heap[minimal])) {
                minimal = i_3;
            }
        }
        return minimal;
    };
    MinHeap.prototype.updateUp = function (x) {
        if (x == 0) {
            return;
        }
        var parent = this.parentNode(x);
        if (this.existNode(parent) && this.lessThan(this.heap[x], this.heap[parent])) {
            this.swap(x, parent);
            this.updateUp(parent);
        }
    };
    MinHeap.prototype.updateDown = function (x) {
        var leftChild = this.leftChildNode(x);
        var rightChild = this.rightChildNode(x);
        if (!this.existNode(leftChild)) {
            return;
        }
        var m = this.minNode([x, leftChild, rightChild]);
        if (m != x) {
            this.swap(x, m);
            this.updateDown(m);
        }
    };
    MinHeap.prototype.debugPrint = function () {
        console.log(this.heap);
    };
    return MinHeap;
}());
export { MinHeap };
//# sourceMappingURL=MinHeap.js.map