cc.Class({
    
    extends: cc.Component,

    properties: {

        firstFriendItem: {
            type: require('friendItem'),
            default: null,
        },

        secondFriendItem: {
            type: require('friendItem'),
            default: null,
        },

        thirdFriendItem: {
            type: require('friendItem'),
            default: null,
        },

    },

    onLoad () {
        
        wx.getFriendCloudStorage({
            keyList: ['score'],
            success: (res => {
                var friendData = res.data;
                if(friendData.length >= 1) {
                    this.firstFriendItem.node.active = true;
                    this.firstFriendItem.showFriendInfo(1, friendData[0]);
                }
                if(friendData.length >= 2) {
                    this.secondFriendItem.node.active = true;
                    this.secondFriendItem.showFriendInfo(2, friendData[1]);
                }
                if(friendData.length >= 3) {
                    this.thirdFriendItem.node.active = true;
                    this.thirdFriendItem.showFriendInfo(3, friendData[2]);
                }
            }).bind(this),
            fail: res => { cc.error(res); }
        });

    },

    start () {

    },

    update (dt) {

    },

});
