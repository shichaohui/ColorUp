var _frameRate = 60;
cc.game.setFrameRate = function (frameRate) {
    _frameRate = frameRate;
    wx.setPreferredFramesPerSecond(frameRate);
};

cc.game.getFrameRate = function () {
    return _frameRate;
};

cc.game._runMainLoop = function () {
    var self = this, callback, config = self.config,
        director = cc.director,
        skip = true, frameRate = config.frameRate;

    cc.debug.setDisplayStats(config.showFPS);

    callback = function () {
        if (!self._paused) {
            self._intervalId = window.requestAnimFrame(callback);
            director.mainLoop();
        }
    };

    self._intervalId = window.requestAnimFrame(callback);
    self._paused = false;
};
// wechat game platform not support this api
cc.game.end = function () {};