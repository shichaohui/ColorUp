cc.Class({

    extends: cc.Component,

    properties: {

        protectiveDuration: 5,

    },

    onLoad () {

    },

    start () {

    },

    update (dt) {

    },

    getCover () {

        return this.node.getComponent(cc.Sprite).spriteFrame;

    },

    onCollisionEnter (other) {

        this.node.parent.removeChild(this.node);

    },

});
