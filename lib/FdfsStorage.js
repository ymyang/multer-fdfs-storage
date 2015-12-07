/**
 * Created by yang on 2015/12/3.
 */
var path = require('path');
var FdfsClient = require('fdfs');

module.exports = function (opts) {
    return new FdfsStorage(opts)
};

function FdfsStorage (opts) {
    this.fdfs = new FdfsClient(opts);
}

FdfsStorage.prototype._handleFile = function(req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext) {
        ext = ext.substring(1);
    }

    var size = req.query.fs;

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
