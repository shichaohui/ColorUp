cc.Class({

    extends: cc.Component,

    properties: {

        jumpHeight: 0,

        jumpDuration: 0,

        sinkDuration: 0,

        deadEffectPrefab: {
            default: null,
            type: cc.Prefab,
        },

        deadAudioClip: {
            default: null,
            type: cc.AudioClip,
        },

        capturedGiftAudioClip: {
            default: null,
            type: cc.AudioClip,
        },

        protectivePBNode: {
            default: null,
            type: cc.Node,
        },

    },

    onLoad () {

        this.updateStyle(this.node.color);

    },

    start () {

    },

    update (dt) {

    },

    setJumpTopListener(jumpTopListener) {

        this.jumpTopListener = jumpTopListener;

    },

    jump () {

    	this.node.stopAllActions();
        var jumpOffsetY = this.jumpHeight;
        if (this.node.y + this.jumpHeight > 0) {
            jumpOffsetY = -this.node.y;
            this.jumpTopListener(this.jumpHeight, this.jumpDuration);
        }
    	var jump = cc.moveBy(this.jumpDuration, cc.v2(0, jumpOffsetY)).easing(cc.easeCubicActionOut());
        var sinkOffsetY = -this.node.parent.height / 2;
    	var sink = cc.moveBy(this.sinkDuration, cc.v2(0, sinkOffsetY)).easing(cc.easeCubicActionIn());
    	this.node.runAction(cc.sequence(jump, sink));

    },

    updateStyle (color) {

        this.node.color = color;

        var partical = this.node.getComponent(cc.ParticleSystem);
        partical.startColor = color;
        partical.endColor = color;

    },

    protective (duration) {

        if (this.isProtectived) {
            this.unschedule(this.updateProtective);
        }

        this.isProtectived =  true;

        var partical = this.node.getComponent(cc.ParticleSystem);

        if (!partical.startColorVarCache) {
            partical.startColorVarCache = new cc.Color();
            partical.startColorVarCache.set(partical.startColorVar);
        }
        partical.startColorVar = cc.Color.WHITE;

        this.protectivePBNode.active = true;
        var progressBar = this.protectivePBNode.getComponent(cc.ProgressBar);
        progressBar.progress = 1;
        var interval = 16 / 1000;
        progressBar.step = progressBar.totalLength / (duration / interval);
        this.schedule(this.updateProtective, interval);

    },

    updateProtective () {

        var progressBar = this.protectivePBNode.getComponent(cc.ProgressBar);

        progressBar.progress -= progressBar.step;
        if (progressBar.progress > 0) {
            return;
        }
        this.isProtectived =  false;

        var partical = this.node.getComponent(cc.ParticleSystem);

        partical.startColorVar = partical.startColorVarCache;

        this.protectivePBNode.active = false;

        this.unschedule(this.updateProtective);

    },

    gameOver () {

        if(!this.node.active) {
            return;
        }
        
        var deadNode = cc.instantiate(this.deadEffectPrefab);
        this.node.parent.addChild(deadNode);
        deadNode.setPosition(cc.v2(this.node.x, this.node.y));

        this.node.active = false;

        cc.audioEngine.play(this.deadAudioClip, false, 0.3);

        this.scheduleOnce(this.game.gameOver.bind(this.game), 1);

    },

    onCollisionEnter (other) {

        switch(other.node.group) {
            case 'obstacle' :
                if (!this.isProtectived && !other.node.color.equals(this.node.color)) {
                    this.gameOver();
                }
                break;
            case 'gift':
                this.game.captureStar(other.node.getComponent('star').score);
                cc.audioEngine.play(this.capturedGiftAudioClip, false, 0.3);
                break;
            case 'palette':
                this.updateStyle(other.node.getComponent('palette').getPrimaryColor());
                break;
            case 'protective':
                this.protective(other.node.getComponent('protectiveCover').protectiveDuration);
                break;
        }

    },

});
