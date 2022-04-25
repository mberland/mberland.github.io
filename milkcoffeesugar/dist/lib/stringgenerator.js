import RNG from "./rng.js";
/**
 * @class (Markov process)-based string generator.
 * Copied from a <a href="http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>.
 * Offers configurable order and prior.
 */
var StringGenerator = /** @class */ (function () {
    function StringGenerator(options) {
        this._options = {
            words: false,
            order: 3,
            prior: 0.001
        };
        Object.assign(this._options, options);
        this._boundary = String.fromCharCode(0);
        this._suffix = this._boundary;
        this._prefix = [];
        for (var i_1 = 0; i_1 < this._options.order; i_1++) {
            this._prefix.push(this._boundary);
        }
        this._priorValues = {};
        this._priorValues[this._boundary] = this._options.prior;
        this._data = {};
    }
    /**
     * Remove all learning data
     */
    StringGenerator.prototype.clear = function () {
        this._data = {};
        this._priorValues = {};
    };
    /**
     * @returns {string} Generated string
     */
    StringGenerator.prototype.generate = function () {
        var result = [this._sample(this._prefix)];
        while (result[result.length - 1] != this._boundary) {
            result.push(this._sample(result));
        }
        return this._join(result.slice(0, -1));
    };
    /**
     * Observe (learn) a string from a training set
     */
    StringGenerator.prototype.observe = function (string) {
        var tokens = this._split(string);
        for (var i_2 = 0; i_2 < tokens.length; i_2++) {
            this._priorValues[tokens[i_2]] = this._options.prior;
        }
        tokens = this._prefix.concat(tokens).concat(this._suffix); /* add boundary symbols */
        for (var i_3 = this._options.order; i_3 < tokens.length; i_3++) {
            var context = tokens.slice(i_3 - this._options.order, i_3);
            var event_1 = tokens[i_3];
            for (var j_1 = 0; j_1 < context.length; j_1++) {
                var subcontext = context.slice(j_1);
                this._observeEvent(subcontext, event_1);
            }
        }
    };
    StringGenerator.prototype.getStats = function () {
        var parts = [];
        var priorCount = Object.keys(this._priorValues).length;
        priorCount--; // boundary
        parts.push("distinct samples: " + priorCount);
        var dataCount = Object.keys(this._data).length;
        var eventCount = 0;
        for (var p_1 in this._data) {
            eventCount += Object.keys(this._data[p_1]).length;
        }
        parts.push("dictionary size (contexts): " + dataCount);
        parts.push("dictionary size (events): " + eventCount);
        return parts.join(", ");
    };
    /**
     * @param {string}
     * @returns {string[]}
     */
    StringGenerator.prototype._split = function (str) {
        return str.split(this._options.words ? /\s+/ : "");
    };
    /**
     * @param {string[]}
     * @returns {string}
     */
    StringGenerator.prototype._join = function (arr) {
        return arr.join(this._options.words ? " " : "");
    };
    /**
     * @param {string[]} context
     * @param {string} event
     */
    StringGenerator.prototype._observeEvent = function (context, event) {
        var key = this._join(context);
        if (!(key in this._data)) {
            this._data[key] = {};
        }
        var data = this._data[key];
        if (!(event in data)) {
            data[event] = 0;
        }
        data[event]++;
    };
    /**
     * @param {string[]}
     * @returns {string}
     */
    StringGenerator.prototype._sample = function (context) {
        context = this._backoff(context);
        var key = this._join(context);
        var data = this._data[key];
        var available = {};
        if (this._options.prior) {
            for (var event_2 in this._priorValues) {
                available[event_2] = this._priorValues[event_2];
            }
            for (var event_3 in data) {
                available[event_3] += data[event_3];
            }
        }
        else {
            available = data;
        }
        return RNG.getWeightedValue(available);
    };
    /**
     * @param {string[]}
     * @returns {string[]}
     */
    StringGenerator.prototype._backoff = function (context) {
        if (context.length > this._options.order) {
            context = context.slice(-this._options.order);
        }
        else if (context.length < this._options.order) {
            context = this._prefix.slice(0, this._options.order - context.length).concat(context);
        }
        while (!(this._join(context) in this._data) && context.length > 0) {
            context = context.slice(1);
        }
        return context;
    };
    return StringGenerator;
}());
export default StringGenerator;
//# sourceMappingURL=stringgenerator.js.map