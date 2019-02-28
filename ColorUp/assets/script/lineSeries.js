cc.Class({

    extends: cc.Component,

    properties: {

        linePrefab: {
            default: null,
            type: cc.Prefab
        },

        starNode: {
            default: null,
            type: cc.Node,
        },

        lineMargin: 0,

        speed: 0,

    },

    onLoad () {

        this.canvasWidth = cc.find('Canvas').width;
        this.left = -this.canvasWidth / 2;

        this.starNode.zIndex = 9;


        this.lines = [];
        var line = cc.instantiate(this.linePrefab);
        for(var i = 0; i < this.canvasWidth / line.width + 2; i++) {
            var line = cc.instantiate(this.linePrefab);
            this.node.addChild(line);
            line.setPosition(new cc.v2(-this.canvasWidth / 2 + (line.width + this.lineMargin) * i, 0));
            this.lines[i] = line;
        }
        
    },

    start () {

    },

    update (dt) {

        var firstLine = this.lines[0];
        // 第一个出界，移动到最后。
        if (firstLine.x < this.left - firstLine.width) {

            var lastLine = this.lines[this.lines.length - 1];
            firstLine.x = lastLine.x + lastLine.width + this.lineMargin;

            if (this.optionalColors) {
                this.updateLineColor(firstLine);
            }

            this.lines.shift();
            this.lines.push(firstLine);

        }
        // 整体移动。
        for(var line of this.lines) {
            line.x -= this.speed;
        }

    },

    setColors (primaryColor, optionalColors, optionalCount) {

        if (optionalCount > optionalColors.length) {
            optionalCount = optionalColors.length;
        }

        this.optionalColors = [];
        this.optionalColors[0] = primaryColor;
        while(this.optionalColors.length < optionalCount) {
            var color = optionalColors[parseInt(Math.random() * optionalCount)];
            if (!this.optionalColors.includes(color)) {
                this.optionalColors[this.optionalColors.length] = color;
            }
        }

        for(var line of this.lines) {
            this.updateLineColor(line);
        }

    },

    updateLineColor (line) {

        if(!this.usingColorTimes) {
            this.usingColorTimes = 0;
        }

        line.color = this.optionalColors[Math.floor(this.usingColorTimes / 2) % this.optionalColors.length];
        
        this.usingColorTimes++;

    },

});
