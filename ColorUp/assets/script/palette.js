cc.Class({

    extends: cc.Component,

    properties: {

    },

    onLoad () {

    },

    start () {

    },

    update (dt) {

    },

    onCollisionEnter (other) {

        this.node.parent.removeChild(this.node);
        this.node.active = false;

    },

    setColors (colors, exceptColor) {
        
        this.colors = colors;
        this.exceptColor = exceptColor;
        
        return this.getPrimaryColor();

    },

    getPrimaryColor () {

        if (!this.primaryColor) {
            do {
                this.primaryColor = this.colors[parseInt(Math.random() * this.colors.length)];
            } while(this.primaryColor == this.exceptColor);
        }
        return this.primaryColor;

    },

});