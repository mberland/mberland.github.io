/**
 * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
 * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
 */
var FRAC = 2.3283064365386963e-10; /* 2^-32 */
var RNG = /** @class */ (function () {
    function RNG() {
        this._seed = 0;
        this._s0 = 0;
        this._s1 = 0;
        this._s2 = 0;
        this._c = 0;
    }
    RNG.prototype.getSeed = function () { return this._seed; };
    /**
     * Seed the number generator
     */
    RNG.prototype.setSeed = function (seed) {
        seed = (seed < 1 ? 1 / seed : seed);
        this._seed = seed;
        this._s0 = (seed >>> 0) * FRAC;
        seed = (seed * 69069 + 1) >>> 0;
        this._s1 = seed * FRAC;
        seed = (seed * 69069 + 1) >>> 0;
        this._s2 = seed * FRAC;
        this._c = 1;
        return this;
    };
    /**
     * @returns Pseudorandom value [0,1), uniformly distributed
     */
    RNG.prototype.getUniform = function () {
        var t = 2091639 * this._s0 + this._c * FRAC;
        this._s0 = this._s1;
        this._s1 = this._s2;
        this._c = t | 0;
        this._s2 = t - this._c;
        return this._s2;
    };
    /**
     * @param lowerBound The lower end of the range to return a value from, inclusive
     * @param upperBound The upper end of the range to return a value from, inclusive
     * @returns Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
     */
    RNG.prototype.getUniformInt = function (lowerBound, upperBound) {
        var max = Math.max(lowerBound, upperBound);
        var min = Math.min(lowerBound, upperBound);
        return Math.floor(this.getUniform() * (max - min + 1)) + min;
    };
    /**
     * @param mean Mean value
     * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
     * @returns A normally distributed pseudorandom value
     */
    RNG.prototype.getNormal = function (mean, stddev) {
        if (mean === void 0) { mean = 0; }
        if (stddev === void 0) { stddev = 1; }
        var u, v, r;
        do {
            u = 2 * this.getUniform() - 1;
            v = 2 * this.getUniform() - 1;
            r = u * u + v * v;
        } while (r > 1 || r == 0);
        var gauss = u * Math.sqrt(-2 * Math.log(r) / r);
        return mean + gauss * stddev;
    };
    /**
     * @returns Pseudorandom value [1,100] inclusive, uniformly distributed
     */
    RNG.prototype.getPercentage = function () {
        return 1 + Math.floor(this.getUniform() * 100);
    };
    /**
     * @returns Randomly picked item, null when length=0
     */
    RNG.prototype.getItem = function (array) {
        if (!array.length) {
            return null;
        }
        return array[Math.floor(this.getUniform() * array.length)];
    };
    /**
     * @returns New array with randomized items
     */
    RNG.prototype.shuffle = function (array) {
        var result = [];
        var clone = array.slice();
        while (clone.length) {
            var index_1 = clone.indexOf(this.getItem(clone));
            result.push(clone.splice(index_1, 1)[0]);
        }
        return result;
    };
    /**
     * @param data key=whatever, value=weight (relative probability)
     * @returns whatever
     */
    RNG.prototype.getWeightedValue = function (data) {
        var total = 0;
        for (var id_1 in data) {
            total += data[id_1];
        }
        var random = this.getUniform() * total;
        var id, part = 0;
        for (id in data) {
            part += data[id];
            if (random < part) {
                return id;
            }
        }
        // If by some floating-point annoyance we have
        // random >= total, just return the last id.
        return id;
    };
    /**
     * Get RNG state. Useful for storing the state and re-setting it via setState.
     * @returns Internal state
     */
    RNG.prototype.getState = function () { return [this._s0, this._s1, this._s2, this._c]; };
    /**
     * Set a previously retrieved state.
     */
    RNG.prototype.setState = function (state) {
        this._s0 = state[0];
        this._s1 = state[1];
        this._s2 = state[2];
        this._c = state[3];
        return this;
    };
    /**
     * Returns a cloned RNG
     */
    RNG.prototype.clone = function () {
        var clone = new RNG();
        return clone.setState(this.getState());
    };
    return RNG;
}());
export default new RNG().setSeed(Date.now());
//# sourceMappingURL=rng.js.map