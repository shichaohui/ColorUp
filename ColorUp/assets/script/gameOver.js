cc.Class({

    extends: cc.Component,

    properties: {

        currentScoreNode: {
            default: null,
            type: cc.Node,
        },

        highestScoreRootNode: {
            default: null,
            type: cc.Node,
        },

        historyNode: {
        	default: null,
        	type: cc.Node,
        },

        firstScoreNode: {
            default: null,
            type: cc.Node,
        },

        secondScoreNode: {
            default: null,
            type: cc.Node,
        },

        thirdScoreNode: {
            default: null,
            type: cc.Node,
        },

        friendTopRankingNode: {
        	default: null,
        	type: cc.Node,
        },

        friendTopRankingWXSubContextView: {
            default: null,
            type: cc.WXSubContextView,
        },

        friendRankingNode: {
            default: null,
            type: cc.Node,
        },

    },

    onLoad () {

        var gameResult = this.node.getComponent('gameResult');
        this.currentScoreNode.getComponent(cc.Label).string = gameResult.getLastScore();

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
        	this.historyNode.active = false;
        	this.friendTopRankingNode.active = true;
            this.highestScoreRootNode.active = true;

            this.highestScoreRootNode.getChildByName('Score').getComponent(cc.Label).string = window.userInfo.highestScore;

            var score = gameResult.getLastScore();

            if (score > window.userInfo.highestScore) {
                window.userInfo.highestScore = score;
                wx.cloud.callFunction({
                    name: 'uploadHighestScore',
                    data: { score: score },
                    success: res => { cc.log(res) },
                    fail: error => { cc.error(error); }
                });
            }

            wx.getOpenDataContext().postMessage({ type: 'updateScore', score:  score});
            wx.getOpenDataContext().postMessage({ type: 'showFriendTopRanking' });
        } else {
            this.highestScoreRootNode.active = false;
        	this.friendTopRankingNode.active = false;
        	this.historyNode.active = true;

        	var historyScores = gameResult.getHistoryScores();

        	this.firstScoreNode.getComponent(cc.Label).string = historyScores[0];
        	this.secondScoreNode.getComponent(cc.Label).string = historyScores[1];
        	this.thirdScoreNode.getComponent(cc.Label).string = historyScores[2];
        }

    },

    start () {

    },

    update (dt) {

    },

    playAgain () {

        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.getOpenDataContext().postMessage({ type: 'close' });
        }

        cc.director.loadScene('Game');

    },

    showFriendRanking () {
        
        this.friendTopRankingWXSubContextView.enabled = false;

        if (!this.isLoadedFriendRanking) {
            wx.getOpenDataContext().postMessage({ type: 'showFriendRanking' });
            this.isLoadedFriendRanking = true;
        }

        this.friendRankingNode.on(cc.Node.EventType.TOUCH_START, () => {});

        // 延时显示，等待子域切换场景
        this.friendRankingNode.active = true;
        this.friendRankingNode.opacity = 0;
        this.scheduleOnce(((dt) => this.friendRankingNode.opacity = 255), 0.1);

    },

    hideFriendRanking () {

        this.friendRankingNode.active = false;
        
    },

});
