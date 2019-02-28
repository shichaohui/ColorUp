cc.Class({

    extends: cc.Component,

    properties: {

    },

    onLoad () {

        let _self = this;

        _self._getUserCloudStorage();

        wx.onMessage(data => {
            if (!data) {
                return;
            }
            switch(data.type) {
                case 'userInfo' :
                    window.userInfo = data.userInfo;
                    break;
                case 'updateScore' :
                    _self._updateScore(data.score);
                    break;
                case 'showFriendTopRanking' :
                    _self._showFriendTopRanking();
                    break;
                case 'showFriendRanking' :
                    _self._showFriendRanking();
                    break;
                default:
                    break;
            }
        });

    },

    start () {

    },

    update (dt) {

    },
    
    _getUserCloudStorage () {

        wx.getUserCloudStorage({
            keyList: ['score'],
            success: res => {
                cc.log(res);
                window.userScore = res.KVDataList[0] ? res.KVDataList[0].value : 0;
            },
            fail: error => {
                cc.error(error);
                window.userScore = 0;
            }
        });

    },

    _updateScore (score) {

        if(score <= window.userScore) {
            return;
        }
        wx.setUserCloudStorage({
            KVDataList: [ { key: 'score', value: score.toString() } ],
            success: res => { cc.log(res); },
            fail: error => { cc.error(error); }
        });

    },

    _showFriendTopRanking () {
        cc.director.loadScene('FriendTopRanking');
    },

    _showFriendRanking () {
        cc.director.loadScene('FriendRanking');
    },

});
