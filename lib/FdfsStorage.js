/**
 * Created by yang on 2015/12/3.
 */
var path = require('path');
var util = require('util');

module.exports = function (fdfs) {
    return new FdfsStorage(fdfs)
};

function FdfsStorage (fdfs) {
    this.fdfs = fdfs;
}

FdfsStorage.prototype._handleFile = function(req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext) {
        ext = ext.substring(1);
    }

    var param = req.body.param;
    if (util.isString(param)) {
        try {
            param = JSON.parse(param);
        } catch(err) {
            cb(err);
        }
    }

    if (!param) {
        cb(new Error('param is missed'));
        return;
    }

    var size = param.fileSize;
    if (util.isString(param.fileSize)) {
        size = Number(param.fileSize);
    }
    if (!(param.fileSize >= 0)) {
        cb(new Error('param.fileSize is missed'));
        return;
    }

    var options = {
        size: size,
        ext: ext
    };

    var _self = this;
    _self.fdfs.upload(file.stream, options, function (err, fileId) {
        if (err) {
            cb(err);
            return;
        }
        cb(null, {
            filename: fileId,
            size: size
        });
    });
};

FdfsStorage.prototype._removeFile = function(req, file, cb) {
    this.fdfs.del(file.filename, cb);
};
