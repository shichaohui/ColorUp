cc.Class({

    extends: cc.Component,

    properties: {

    	friendRankingItemPrefab: {
    		type: cc.Prefab,
    		default: null,
    	},

    	scrollViewContentNode: {
    		type: cc.Node,
    		default: null,
    	},

    	currentUserInfoNode: {
    		type: cc.Node,
    		default: null,
    	},

    },

    onLoad () {

		wx.getFriendCloudStorage({
            keyList: ['score'],
            success: (res => {
            	cc.log(res);
    			var friendData = res.data;
        		for(var i = 0; i < friendData.length; i++) {
        			var itemNode = cc.instantiate(this.friendRankingItemPrefab);
        			this.scrollViewContentNode.addChild(itemNode);
        			itemNode.getComponent('friendItem').showFriendInfo(i + 1, friendData[i]);

        			if (friendData[i].openid == window.userInfo.openId) {
        				this.currentUserInfoNode.getComponent('friendItem').showFriendInfo(i + 1, friendData[i]);
        			}
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
