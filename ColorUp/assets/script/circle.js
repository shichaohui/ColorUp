cc.Class({

    extends: cc.Component,

    properties: {

        starNode: {
            default: null,
            type: cc.Node,
        },

        duration: 0,

        reverse: false,

    },

    onLoad () {

        var angle = this.reverse ? -360 : 360;
        this.node.runAction(cc.repeatForever(cc.rotateBy(this.duration, angle)));
        this.starNode.runAction(cc.repeatForever(cc.rotateBy(this.duration, -angle)));

    },

    start () {

    },

    update (dt) {

    },

    setColors (primaryColor, optionalColors, optionalCount) {

        if (optionalCount > optionalColors.length) {
            optionalCount = optionalColors.length;
        }

        if (optionalColors.length == optionalCount && optionalColors.includes(primaryColor)) {
            this.optionalColors = optionalColors;
        } else {
            this.optionalColors = [];
            this.optionalColors[0] = primaryColor;
            while(this.optionalColors.length < optionalCount) {
                var color = optionalColors[parseInt(Math.random() * optionalCount)];
                if (!this.optionalColors.includes(color)) {
                    this.optionalColors[this.optionalColors.length] = color;
                }
            }
        }

        for(var i in this.node.children) {
            if (this.node.children[i] == this.starNode) {
                continue;
            }
            this.node.children[i].color = this.optionalColors[i % this.optionalColors.length];
        }

    },

    hideStar () {

        this.starNode.active = false;

    },

});
