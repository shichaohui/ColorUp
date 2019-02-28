var settings = window._CCSettings;

cc.director.once(cc.Director.EVENT_BEFORE_SCENE_LOADING, function () {
    cc.Pipeline.Downloader.PackDownloader._doPreload("WECHAT_SUBDOMAIN", settings.WECHAT_SUBDOMAIN_DATA);
});

var viewportInMain = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

// Touch conversion
cc.view.convertToLocationInView = function (tx, ty, relatedPos, out) {
    var result = out || cc.v2();
    var x = this._devicePixelRatio * (tx - relatedPos.left);
    var y = this._devicePixelRatio * (relatedPos.top + relatedPos.height - ty);
    // Move to real viewport area
    x = (x - viewportInMain.x) * this._viewportRect.width / viewportInMain.width;
    y = (y - viewportInMain.y) * this._viewportRect.height / viewportInMain.height;
    if (this._isRotated) {
        result.x = this._viewportRect.width - y;
        result.y = x;
    }
    else {
        result.x = x;
        result.y = y;
    }
    return result;
};

wx.onMessage(function (data) {
    if (data.fromEngine) {
        if (data.event === 'viewport') {
            viewportInMain.x = data.x;
            viewportInMain.y = data.y;
            viewportInMain.width = data.width;
            viewportInMain.height = data.height;
        }
    }
});

// Canvas component adaptation

cc.Canvas.prototype.update = function () {
    if (this._width !== cc.game.canvas.width || this._height !== cc.game.canvas.height) {
        this.applySettings();
    }
};

cc.Canvas.prototype.applySettings = function () {
    var ResolutionPolicy = cc.ResolutionPolicy;
    var policy;
    if (this.fitHeight && this.fitWidth) {
        policy = ResolutionPolicy.SHOW_ALL;
    }
    else {
        if (this.fitWidth) {
            policy = ResolutionPolicy.FIXED_WIDTH;
        }
        else if (this.fitHeight) {
            policy = ResolutionPolicy.FIXED_HEIGHT;
        }
        else {
            policy = ResolutionPolicy.NO_BORDER
        }
    }
    var designRes = this._designResolution;
    cc.view.setDesignResolutionSize(designRes.width, designRes.height, policy);
    this._width = cc.game.canvas.width;
    this._height = cc.game.canvas.height;
};