cc.Class({
   
    extends: cc.Component,

    properties: {

        duration: 0,

        crossNode:{
            default: null,
            type:cc.Node,
        },

    },

    onLoad () {

        this.crossNode.runAction(cc.repeatForever(cc.rotateBy(this.duration, 360)));

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

        for(var i in this.crossNode.children) {
            this.crossNode.children[i].color = this.optionalColors[i % this.optionalColors.length];
        }

    },

});
