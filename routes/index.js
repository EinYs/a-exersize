const express = require('express');
const router = express.Router();
const path = require('path');
const dotenv = require('dotenv')
dotenv.config()

let AWS = require("aws-sdk");
let s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-east-1'
});

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useFindAndModify: false }, function (err) {
    if (err)
        console.log(err)
    else
        console.log('mongodb connected ... ', process.env.DATABASE_URI)
})

const Attachment = require('../data/attachment.model')

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

router.get('/images', function(req, res, next) {
    Attachment.find({}).limit(20).exec().then( docs =>{
        res.json(docs)
    })
});

router.post('/upload', upload.single("imgFile"), function(req, res, next){
    let imgFile = req.file;
    res.json(imgFile);
})

router.get('/upload', function(req, res, next) {
    res.render('upload');
});

module.exports = router;