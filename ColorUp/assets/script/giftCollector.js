cc.Class({

    extends: cc.Component,

    properties: {

        starScoreNode: {
            default: null,
            type: cc.Node,
        }

    },

    onLoad () {

        this.starCount = 0;
        this.score = 0;

    },

    start () {

    },

    update (dt) {

    },

    captureStar (score) {

        this.starCount += 1;
        this.score += score;
        this.starScoreNode.getComponent(cc.Label).string = this.score.toString();

    },

    getScore () {

        return this.score;

    }

});
