cc.Class({

    extends: cc.Component,

    properties: {

        colors: {
            default: [],
            type: [cc.Color],
        },

        operateTipNode: {
            default: null,
            type: cc.Node,
        },

        player: {
            default: null,
            type: require('player'),
        },

        obstacleSet: {
            default: null,
            type: require('obstacleSet'),
        },

        giftCollector: {
            default: null,
            type: require('giftCollector'),
        },

    },

    onLoad () {

        // 打开碰撞检测
        cc.director.getCollisionManager().enabled = true;


        this.player.game = this;
        this.player.setJumpTopListener(function(jumpHeight, jumpDuration) {
            this.obstacleSet.moveDown(jumpHeight, jumpDuration);
        }.bind(this));


        this.obstacleSet.setColors(this.colors);


        this.node.once(cc.Node.EventType.TOUCH_START, this.hideOperateTip, this);

        this.node.on(cc.Node.EventType.TOUCH_START, this.player.jump, this.player);


        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.cloud.init();
            this._getUserInfo();
        }

    },

    start () {

    },

    update (dt) {

    },

    _getUserInfo () {

        wx.cloud.callFunction({
            name: 'getUserInfo',
            data: {},
            success: res => {
                window.userInfo = res.result;
                wx.getOpenDataContext().postMessage({ type: 'userInfo', userInfo: window.userInfo });
            },
            fail: error => {
                cc.error(error);
            }
        });

    },

    hideOperateTip () {

        this.operateTipNode.active = false;
        this.operateTipNode.parent.removeChild(this.operateTipNode);
        delete this.operateTipNode;

    },

    gameOver () {

        this.node.off(cc.Node.EventType.TOUCH_START, this.player.jump, this.player);

        this.node.getComponent('gameResult').setNewScore(this.giftCollector.getScore());

        cc.director.loadScene('GameOver');

    },

    captureStar (score) {
        
        this.giftCollector.captureStar(score);

    },

});
