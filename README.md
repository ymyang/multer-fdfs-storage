# multer-fdfs-storage
multer storage for fastdfs

# 安装

```
npm install multer-fdfs-storage
```

# 使用

```javascript

var express = require('express');
var multer = require('multer');
var FdfsStorage = require('multer-fdfs-storage');
var FdfsClient = require('fdfs');
var UploadCtrl = require('../controller/UploadCtrl.js');

var router = module.exports = express.Router();

var fdfs = new FdfsClient({
    trackers: [
        {
            "host": "192.168.1.120",
            "port": 22122
        }
    ],
    timeout: 10000,
    defaultExt: '',
    charset: 'utf8'
});

var fdfsStorage = FdfsStorage(fdfs);

var upload = multer({
    storage: fdfsStorage,
    limits: {
        // 文件大小限制10G
        fileSize: 10*1024*1024*1024,
        // 一次只能上传一个文件
        files: 1
    }
});

// 上传文件
router.post('/upload/file', upload.single('file'), _upload);

function _upload(req, res) {
    // param.fileSize id required
    var param = req.body.param ? JSON.parse(req.body.param);
    
    // file info
    param.file = req.file;

    res.json(req.file);

    // TODO
}

```