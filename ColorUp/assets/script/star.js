cc.Class({

    extends: cc.Component,

    properties: {

        score: 0,

        capturedEffectPrefab: {
            default: null,
            type: cc.Prefab,
        },

    },

    onLoad () {

    },

    start () {

    },

    update (dt) {

    },

    unuse () {

        this.node.active = false;

    },

    reuse () {

        this.node.active = true;

    },

    onCollisionEnter (other) {

        var capturedNode = cc.instantiate(this.capturedEffectPrefab);
        this.node.parent.addChild(capturedNode);
        capturedNode.setPosition(cc.v2(this.node.x, this.node.y));
        capturedNode.zIndex = this.node.zIndex;

        this.node.parent.removeChild(this.node);
        this.node.active = false;
        
    },

});
