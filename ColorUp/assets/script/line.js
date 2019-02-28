cc.Class({

    extends: cc.Component,

    properties: {
    },

    onLoad () {

        var collider = this.node.getComponent(cc.Collider);
        collider.size.width = this.node.width;
        collider.size.height = this.node.height;

    },

    start () {

    },

    update (dt) {

    },

    onCollisionEnter (other) {

    },

});