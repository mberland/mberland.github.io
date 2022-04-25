/**
 * @class Abstract display backend module
 * @private
 */
var Backend = /** @class */ (function () {
    function Backend() {
    }
    Backend.prototype.getContainer = function () { return null; };
    Backend.prototype.setOptions = function (options) { this._options = options; };
    return Backend;
}());
export default Backend;
//# sourceMappingURL=backend.js.map