/****************************************************************************
 Copyright (c) 2017 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var ID = 'WXDownloader';

var non_text_format = [
    'js','png','jpg','bmp','jpeg','gif','ico','tiff','webp','image','pvr','etc','mp3','ogg','wav','m4a','font','eot','ttf','woff','svg','ttc'
];

var REGEX = /^\w+:\/\/.*/;

var fs = wx.getFileSystemManager ? wx.getFileSystemManager() : {};

var _newAssets = [];
var WXDownloader = window.WXDownloader = function () {
    this.id = ID;
    this.async = true;
    this.pipeline = null;
    this.REMOTE_SERVER_ROOT = '';
    this.SUBCONTEXT_ROOT = '';
    _newAssets = [];
};
WXDownloader.ID = ID;

WXDownloader.prototype.handle = function (item, callback) {

    if (item.type === 'js') {
        callback(null, null);
        return;
    }
    if (item.type === 'uuid') {
        var result = cc.Pipeline.Downloader.PackDownloader.load(item, callback);
        // handled by PackDownloader
        if (result !== undefined) {
            // null result
            if (!!result) {
                return result;
            }
            else {
                return;
            }
        }
    }

    if (CC_WECHATGAME_SUB) {
        if (REGEX.test(item.url)) {
            callback(null, null);
            return;
        }

        item.url = this.SUBCONTEXT_ROOT + '/' + item.url;

        if (item.type && non_text_format.indexOf(item.type) !== -1) {
            nextPipe(item, callback);
            return;
        }
    }

    var filePath = item.url;
    // Read from package
    fs.access({
        path: filePath,
        success: function () {
            if (item.type && non_text_format.indexOf(item.type) !== -1) {
                nextPipe(item, callback);
            }
            else {
                readText(item, callback);
            }
        },
        fail: function (res) {
            readFromLocal(item, callback);
        }
    });
};

WXDownloader.prototype.cleanOldAssets = function () {
    cleanAllFiles(wx.env.USER_DATA_PATH, _newAssets, function (err) {
        if (err) {
            cc.warn(err);
        }
        else {
            for (var i = 0; i < _newAssets.length; ++i) {
                cc.log('reserve local file: ' + _newAssets[i]);
            }
            cc.log('Clean old Assets successfully!');
        }
    });
};

function cleanAllFiles(path, newAssets, finish) {
    fs.readdir({
        dirPath: path,
        success: function (res) {
            var files = res.files;
            (function next(idx) {
                if (idx < files.length) {
                    var dirPath = path + '/' + files[idx];
                    var stat = fs.statSync(dirPath);
                    if (stat.isDirectory()) {
                        cleanAllFiles(dirPath, newAssets, function () {
                            next(idx + 1);
                        });
                    }
                    else {
                        // remove old assets
                        if (newAssets && newAssets.indexOf(dirPath) !== -1) {
                            next(idx + 1);
                            return;
                        }
                        fs.unlink({
                            filePath: dirPath,
                            success: function () {
                                cc.log('unlink local file ' + dirPath + ' successfully!');
                            },
                            fail: function (res) {
                                cc.warn('failed to unlink file(' + dirPath + '): ' + res ? res.errMsg : 'unknown error');
                            },
                            complete: function () {
                                next(idx + 1);
                            }
                        });
                    }
                }
                else {
                    finish && finish();
                }

            })(0);
        },
        fail: function (res) {
            finish && finish();
        },
    });
}

WXDownloader.prototype.cleanAllAssets = function () {
    _newAssets = [];
    cleanAllFiles(wx.env.USER_DATA_PATH, null, function (err) {
        if (err) {
            cc.warn(err);
        }
        else {
            cc.log('Clean all Assets successfully!');
        }
    });
};

var wxDownloader = window.wxDownloader = new WXDownloader();

function nextPipe(item, callback) {
    var queue = cc.LoadingItems.getQueue(item);
    queue.addListener(item.id, function (item) {
        if (item.error) {
            fs.unlink({
                filePath: item.url,
                success: function () {
                    cc.log('Load failed, removed local file ' + item.url + ' successfully!');
                }
            });
        }
    });
    callback(null, null);
}

function readText (item, callback) {
    var url = item.url;
    fs.readFile({
        filePath: url,
        encoding: 'utf8',
        success: function (res) {
            item.states[cc.loader.downloader.id] = cc.Pipeline.ItemState.COMPLETE;
            callback(null, res.data);
        },
        fail: function (res) {
            cc.warn('Read file failed: ' + url);
            fs.unlink({
                filePath: url,
                success: function () {
                    cc.log('Read file failed, removed local file ' + url + ' successfully!');
                }
            });
            callback({
                status: 0,
                errorMessage: res && res.errMsg ? res.errMsg : "Read text file failed: " + url
            });
        }
    });
}

function readFromLocal (item, callback) {
    var localPath = wx.env.USER_DATA_PATH + '/' + item.url;

    // Read from local file cache
    fs.access({
        path: localPath,
        success: function () {

            // cache new asset
            _newAssets.push(localPath);

            item.url = localPath;
            if (item.type && non_text_format.indexOf(item.type) !== -1) {
                nextPipe(item, callback);
            }
            else {
                readText(item, callback);
            }
        },
        fail: function (res) {
            // No remote server indicated, then continue to downloader
            if (!wxDownloader.REMOTE_SERVER_ROOT) {
                callback(null, null);
                return;
            }

            downloadRemoteFile(item, callback);
        }
    });
}

function ensureDirFor (path, callback) {
    // cc.log('mkdir:' + path);
    var ensureDir = cc.path.dirname(path);
    if (ensureDir === "wxfile://usr" || ensureDir === "http://usr") {
        callback();
        return;
    }
    fs.access({
        path: ensureDir,
        success: callback,
        fail: function (res) {
            ensureDirFor(ensureDir, function () {
                fs.mkdir({
                    dirPath: ensureDir,
                    complete: callback,
                });
            });
        },
    });
}

function downloadRemoteFile (item, callback) {
    // Download from remote server
    var relatUrl = item.url;

    // filter protocol url (E.g: https:// or http:// or ftp://)
    if (REGEX.test(relatUrl)) {
        callback(null, null);
        return;
    }

    var remoteUrl = wxDownloader.REMOTE_SERVER_ROOT + '/' + relatUrl;
    item.url = remoteUrl;
    wx.downloadFile({
        url: remoteUrl,
        success: function (res) {
            if (res.statusCode === 404) {
                cc.warn("Download file failed: " + remoteUrl);
                callback({
                    status: 0,
                    errorMessage: res && res.errMsg ? res.errMsg : "Download file failed: " + remoteUrl
                });
            }
            else if (res.tempFilePath) {
                // http reading is not cached
                var temp = res.tempFilePath;
                var localPath = wx.env.USER_DATA_PATH + '/' + relatUrl;
                // check and mkdir remote folder has exists
                ensureDirFor(localPath, function () {
                    // Save to local path
                    wx.saveFile({
                        tempFilePath: res.tempFilePath,
                        filePath: localPath,
                        success: function (res) {
                            // cc.log('save:' + localPath);
                            item.url = res.savedFilePath;
                            if (item.type && non_text_format.indexOf(item.type) !== -1) {
                                nextPipe(item, callback);
                            }
                            else {
                                readText(item, callback);
                            }
                        },
                        fail: function (res) {
                            // Failed to save file, then just use temp
                            console.log(res && res.errMsg ? res.errMsg : 'save file failed: ' + remoteUrl);
                            console.log('It might be due to out of storage spaces, you can clean your storage spaces manually.');
                            item.url = temp;
                            if (item.type && non_text_format.indexOf(item.type) !== -1) {
                                nextPipe(item, callback);
                            }
                            else {
                                readText(item, callback);
                            }
                        }
                    });
                });
            }
        },
        fail: function (res) {
            // Continue to try download with downloader, most probably will also fail
            callback({
                status: 0,
                errorMessage: res && res.errMsg ? res.errMsg : "Download file failed: " + remoteUrl
            }, null);
        }
    })
}

// function downloadRemoteTextFile (item, callback) {
//     // Download from remote server
//     var relatUrl = item.url;
//     var remoteUrl = wxDownloader.REMOTE_SERVER_ROOT + '/' + relatUrl;
//     item.url = remoteUrl;
//     wx.request({
//         url: remoteUrl,
//         success: function(res) {
//             if (res.data) {
//                 if (res.statusCode === 200 || res.statusCode === 0) {
//                     var data = res.data;
//                     item.states[cc.loader.downloader.ID] = cc.Pipeline.ItemState.COMPLETE;
//                     if (data) {
//                         if (typeof data !== 'string' && !(data instanceof ArrayBuffer)) {
//                             // Should we check if item.type is json ? If not, loader behavior could be different
//                             item.states[cc.loader.loader.ID] = cc.Pipeline.ItemState.COMPLETE;
//                             callback(null, data);
//                             data = JSON.stringify(data);
//                         }
//                         else {
//                             callback(null, data);
//                         }
//                     }

//                     // Save to local path
//                     var localPath = wx.env.USER_DATA_PATH + '/' + relatUrl;
//                     // Should recursively mkdir first
//                     fs.writeFile({
//                         filePath: localPath,
//                         data: data,
//                         encoding: 'utf8',
//                         success: function (res) {
//                             cc.log('Write file to ' + res.savedFilePath + ' successfully!');
//                         },
//                         fail: function (res) {
//                             // undone implementation
//                         }
//                     });
//                 } else {
//                     cc.warn("Download text file failed: " + remoteUrl);
//                     callback({
//                         status:0, 
//                         errorMessage: res && res.errMsg ? res.errMsg : "Download text file failed: " + remoteUrl
//                     });
//                 }
//             }
//         },
//         fail: function (res) {
//             // Continue to try download with downloader, most probably will also fail
//             callback(null, null);
//         }
//     });
// }
