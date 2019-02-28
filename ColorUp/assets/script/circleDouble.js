cc.Class({

    extends: cc.Component,

    properties: {

        starNode: {
            default: null,
            type: cc.Node,
        },

    },

    onLoad () {

    },

    start () {

    },

    update (dt) {

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

        for(var child of this.node.children) {
            if (child == this.starNode) {
                continue;
            }
            var child = child.getComponent('circle');
            child.setColors(primaryColor, this.optionalColors, optionalCount);
            child.hideStar();
        }

    },

});
