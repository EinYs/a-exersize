const dotenv = require('dotenv')
dotenv.config()

const aws = require('aws-sdk');
const fs = require('fs');

const Jimp = require('jimp')
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useFindAndModify: false }, function (err) {
    if (err)
        console.log(err)
    else
        console.log('mongodb connected ... ', process.env.DATABASE_URI)
})

let Image = mongoose.model('attachment', {
    store: {
        w: Number,
        h: Number,
        key: String,
        keythumb: String
    }
})

let s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-east-1'
})

const IMG_LINK = "https://pbs.twimg.com/media/D55k2hvUUAAfhMs.jpg"
let store = {}

const THUMB_SIZE = 125
const THUMB_Q = 85
thumbImg(IMG_LINK, THUMB_SIZE, THUMB_Q).then(async (thumb) => {
    var param = {
        'Bucket': 'cmsnart',
        'ACL': 'public-read',
        'Body': thumb.buffer,
        'Key': 'thumbs/' + Date.now().toString() + '.jpg',
        'ContentType': 'image/jpeg'
    }

    let res = await s3.upload(param).promise();
    store.keythumb = res.Key
    console.log(res);
})

const JIMP_SIZE = 360
const JIMP_Q = 85
jimpImg(IMG_LINK, JIMP_SIZE, JIMP_Q).then(async (image) => {
    var param = {
        'Bucket': 'cmsnart',
        'ACL': 'public-read',
        'Body': image.buffer,
        'Key': 'images/' + Date.now().toString() + '.jpg',
        'ContentType': 'image/jpeg'
    }

    let res = await s3.upload(param).promise();
    console.log(res);
})

/**
 * resize a image from src
 * @param {} imageSrc 
 * @param {*} size 
 * @param {*} jpegQuality 
 */
async function jimpImg(imageSrc, size, jpegQuality) {

    console.log('[dataParser.js/jimpImg] Trying to jimp from src:', imageSrc);

    return Jimp.read(imageSrc).then(image => {
        console.log("[dataParser.js] original Image size WH", image.bitmap.width, image.bitmap.height)
        //가로가길면 가로고정값...세로가길면 세로고정값
        let resized;
        if (image.bitmap.width > image.bitmap.height) {
            resized = image.resize(size, Jimp.AUTO)
        } else {
            resized = image.resize(Jimp.AUTO, size)
        }
        return resized.quality(jpegQuality).getBufferAsync(Jimp.MIME_JPEG).then(buffer => {
            return { ok: true, w: resized.getWidth(), h: resized.getHeight(), buffer: buffer }
        })
    }).catch(err => {
        console.error(err);
        return { ok: false }
    })
}

/**
 * make square image from src
 * @param {} imageSrc 
 * @param {*} size 
 * @param {*} jpegQuality 
 */
async function thumbImg(imageSrc, size, jpegQuality) {

    console.log('[dataParser.js/jimpImg] Trying to jimp from src:', imageSrc);

    return Jimp.read(imageSrc).then(image => {
        console.log("[dataParser.js] original Image size WH", image.bitmap.width, image.bitmap.height)
        //가로가길면 가로고정값...세로가길면 세로고정값
        let resized = image.crop(size, size)
        return resized.quality(jpegQuality).getBufferAsync(Jimp.MIME_JPEG).then(buffer => {
            return { ok: true, w: resized.getWidth(), h: resized.getHeight(), buffer: buffer }
        })
    }).catch(err => {
        console.error(err);
        return { ok: false }
    })
}
