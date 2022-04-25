var LogManager = /** @class */ (function () {
    function LogManager() {
        this.docLog = document.createElement("div");
        this.created = false;
        this.docLog.id = "docLog";
    }
    LogManager.prototype.log = function (message) {
        if (!this.created) {
            document.body.appendChild(this.docLog);
            this.created = true;
        }
        this.docLog.innerHTML += message + "<br>";
    };
    LogManager.prototype.reset = function () {
        this.docLog.innerHTML = "";
    };
    LogManager.prototype.message = function (message) {
        this.reset();
        this.log(message);
    };
    return LogManager;
}());
export { LogManager };
//# sourceMappingURL=logmanager.js.map