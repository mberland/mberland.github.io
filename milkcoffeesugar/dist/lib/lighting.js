import * as Color from "./color.js";
;
;
;
;
/**
 * Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 */
var Lighting = /** @class */ (function () {
    function Lighting(reflectivityCallback, options) {
        if (options === void 0) { options = {}; }
        this._reflectivityCallback = reflectivityCallback;
        this._options = {};
        options = Object.assign({
            passes: 1,
            emissionThreshold: 100,
            range: 10
        }, options);
        this._lights = {};
        this._reflectivityCache = {};
        this._fovCache = {};
        this.setOptions(options);
    }
    /**
     * Adjust options at runtime
     */
    Lighting.prototype.setOptions = function (options) {
        Object.assign(this._options, options);
        if (options && options.range) {
            this.reset();
        }
        return this;
    };
    /**
     * Set the used Field-Of-View algo
     */
    Lighting.prototype.setFOV = function (fov) {
        this._fov = fov;
        this._fovCache = {};
        return this;
    };
    /**
     * Set (or remove) a light source
     */
    Lighting.prototype.setLight = function (x, y, color) {
        var key = x + "," + y;
        if (color) {
            this._lights[key] = (typeof (color) == "string" ? Color.fromString(color) : color);
        }
        else {
            delete this._lights[key];
        }
        return this;
    };
    /**
     * Remove all light sources
     */
    Lighting.prototype.clearLights = function () { this._lights = {}; };
    /**
     * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
     */
    Lighting.prototype.reset = function () {
        this._reflectivityCache = {};
        this._fovCache = {};
        return this;
    };
    /**
     * Compute the lighting
     */
    Lighting.prototype.compute = function (lightingCallback) {
        var doneCells = {};
        var emittingCells = {};
        var litCells = {};
        for (var key in this._lights) { /* prepare emitters for first pass */
            var light = this._lights[key];
            emittingCells[key] = [0, 0, 0];
            Color.add_(emittingCells[key], light);
        }
        for (var i_1 = 0; i_1 < this._options.passes; i_1++) { /* main loop */
            this._emitLight(emittingCells, litCells, doneCells);
            if (i_1 + 1 == this._options.passes) {
                continue;
            } /* not for the last pass */
            emittingCells = this._computeEmitters(litCells, doneCells);
        }
        for (var litKey in litCells) { /* let the user know what and how is lit */
            var parts = litKey.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            lightingCallback(x, y, litCells[litKey]);
        }
        return this;
    };
    /**
     * Compute one iteration from all emitting cells
     * @param emittingCells These emit light
     * @param litCells Add projected light to these
     * @param doneCells These already emitted, forbid them from further calculations
     */
    Lighting.prototype._emitLight = function (emittingCells, litCells, doneCells) {
        for (var key in emittingCells) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this._emitLightFromCell(x, y, emittingCells[key], litCells);
            doneCells[key] = 1;
        }
        return this;
    };
    /**
     * Prepare a list of emitters for next pass
     */
    Lighting.prototype._computeEmitters = function (litCells, doneCells) {
        var result = {};
        for (var key in litCells) {
            if (key in doneCells) {
                continue;
            } /* already emitted */
            var color = litCells[key];
            var reflectivity = void 0;
            if (key in this._reflectivityCache) {
                reflectivity = this._reflectivityCache[key];
            }
            else {
                var parts = key.split(",");
                var x = parseInt(parts[0]);
                var y = parseInt(parts[1]);
                reflectivity = this._reflectivityCallback(x, y);
                this._reflectivityCache[key] = reflectivity;
            }
            if (reflectivity == 0) {
                continue;
            } /* will not reflect at all */
            /* compute emission color */
            var emission = [0, 0, 0];
            var intensity = 0;
            for (var i_2 = 0; i_2 < 3; i_2++) {
                var part = Math.round(color[i_2] * reflectivity);
                emission[i_2] = part;
                intensity += part;
            }
            if (intensity > this._options.emissionThreshold) {
                result[key] = emission;
            }
        }
        return result;
    };
    /**
     * Compute one iteration from one cell
     */
    Lighting.prototype._emitLightFromCell = function (x, y, color, litCells) {
        var key = x + "," + y;
        var fov;
        if (key in this._fovCache) {
            fov = this._fovCache[key];
        }
        else {
            fov = this._updateFOV(x, y);
        }
        for (var fovKey in fov) {
            var formFactor = fov[fovKey];
            var result = void 0;
            if (fovKey in litCells) { /* already lit */
                result = litCells[fovKey];
            }
            else { /* newly lit */
                result = [0, 0, 0];
                litCells[fovKey] = result;
            }
            for (var i_3 = 0; i_3 < 3; i_3++) {
                result[i_3] += Math.round(color[i_3] * formFactor);
            } /* add light color */
        }
        return this;
    };
    /**
     * Compute FOV ("form factor") for a potential light source at [x,y]
     */
    Lighting.prototype._updateFOV = function (x, y) {
        var key1 = x + "," + y;
        var cache = {};
        this._fovCache[key1] = cache;
        var range = this._options.range;
        function cb(x, y, r, vis) {
            var key2 = x + "," + y;
            var formFactor = vis * (1 - r / range);
            if (formFactor == 0) {
                return;
            }
            cache[key2] = formFactor;
        }
        ;
        this._fov.compute(x, y, range, cb.bind(this));
        return cache;
    };
    return Lighting;
}());
export default Lighting;
//# sourceMappingURL=lighting.js.map