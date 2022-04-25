import { GameManager } from "./gamemanager.js";
// import {logger} from "./utils.js";
var timeDelta = 100;
var g = new GameManager();
document.body.addEventListener("keypress", function (e) {
    g.handleInput(String.fromCharCode(e.charCode));
});
function mainFunc() {
    // alert("mainFunc");
    // docLog.innerHTML = docLog.innerHTML + ". ";
    g.showAllCards();
    // logger.log("mainFunc");
    // setTimeout(mainFunc, timeDelta);
}
setTimeout(mainFunc, timeDelta);
//# sourceMappingURL=milkcoffeesugar.js.map