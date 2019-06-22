var enter = {

    init () {

        this._getUserCloudStorage();

        wx.onMessage(data => {
            if (!data) {
                return;
            }
            switch(data.type) {
                case 'userInfo' :
                    window.userInfo = data.userInfo;
                    break;
                case 'updateScore' :
                    this._updateScore(data.score);
                    break;
                case 'showFriendTopRanking' :
                    this._showFriendTopRanking();
                    break;
                case 'showFriendRanking' :
                    this._showFriendRanking();
                    break;
                case 'close' :
                    this._close();
                    break;
                default:
                    break;
            }
        });

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

    _close () {

        cc.director.loadScene("Empty");

    },

};

if (cc.sys.platform == cc.sys.WECHAT_GAME) {
    enter.init();
}