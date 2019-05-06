const express = require('express');
const router = express.Router();
const path = require('path');

let AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + "/../config/aws.json");
let s3 = new AWS.S3();

let multer = require("multer");
let multerS3 = require('multer-s3');
let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "cmsnart",
        key: function (req, file, cb) {
             let extension = path.extname(file.originalname);
             cb(null, Date.now().toString() + extension)
        },
        acl: 'public-read-write',
    })
})

router.get('/', function(req, res, next) {
    res.render('upload');
});

router.post('/upload', upload.single("imgFile"), function(req, res, next){
    let imgFile = req.file;
    res.json(imgFile);
})

router.get('/upload', function(req, res, next) {
    res.render('upload');
});

module.exports = router;