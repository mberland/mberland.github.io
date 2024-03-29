var Game = {
    scheduler: null,
    engine: null,
    player: null,
    level: null,
    display: null,
    textBuffer: null,
    init: function () {
        window.addEventListener("load", this);
    },
    handleEvent: function (e) {
        switch (e.type) {
            case "load":
                window.removeEventListener("load", this);
                this.scheduler = new ROT.Scheduler.Speed();
                this.engine = new ROT.Engine(this.scheduler);
                this.display = new ROT.Display({ fontSize: 16 });
                this.textBuffer = new TextBuffer(this.display);
                document.body.appendChild(this.display.getContainer());
                this.player = new Player();
                // FIXME build a level and position a player
                var level = new Level();
                var size = level.getSize();
                this._switchLevel(level);
                this.level.setEntity(this.player, new XY(Math.round(size.x / 2), Math.round(size.y / 2)));
                this.engine.start();
                break;
        }
    },
    draw: function (xy) {
        var entity = this.level.getEntityAt(xy);
        var visual = entity.getVisual();
        this.display.draw(xy.x, xy.y, visual.ch, visual.fg, visual.bg);
    },
    over: function () {
        this.engine.lock();
        // FIXME show something
    },
    _switchLevel: function (level) {
        // remove old beings from the scheduler
        this.scheduler.clear();
        this.level = level;
        var size = this.level.getSize();
        var bufferSize = 3;
        this.display.setOptions({ width: size.x, height: size.y + bufferSize });
        this.textBuffer.configure({
            display: this.display,
            position: new XY(0, size.y),
            size: new XY(size.x, bufferSize)
        });
        this.textBuffer.clear();
        /* FIXME draw a level */
        var xy = new XY();
        for (var i_1 = 0; i_1 < size.x; i_1++) {
            xy.x = i_1;
            for (var j_1 = 0; j_1 < size.y; j_1++) {
                xy.y = j_1;
                this.draw(xy);
            }
        }
        /* add new beings to the scheduler */
        var beings = this.level.getBeings();
        for (var p_1 in beings) {
            this.scheduler.add(beings[p_1], true);
        }
    }
};
Game.init();
//# sourceMappingURL=game.js.map