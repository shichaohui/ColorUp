cc.Class({

    extends: cc.Component,

    properties: {

        rankLabel: {
            type: cc.Label,
            default: null,
        },

        avatarSprite: {
            type: cc.Sprite,
            default: null,
        },

        nicknameLabel: {
            type: cc.Label,
            default: null,
        },

        scoreLabel: {
            type: cc.Label,
            default: null,
        },

    },

    onLoad () {

    },

    start () {

    },

    update (dt) {

    },

    showFriendInfo (rank, friendInfo) {

        this.rankLabel.string = rank.toString();

        cc.loader.load(
            { url: friendInfo.avatarUrl, type: 'png' },
            ((error, texture) => {
                if (error) {
                    cc.error(error);
                } else {
                    this.avatarSprite.spriteFrame = new cc.SpriteFrame(texture);
                }
            }).bind(this)
        );

        this.nicknameLabel.string = friendInfo.nickName ? friendInfo.nickName : friendInfo.nickname;

        this.scoreLabel.string = friendInfo.KVDataList[0].value;

    },

});
