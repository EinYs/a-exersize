const dotenv = require('dotenv')
dotenv.config()

const aws = require('aws-sdk');

const Jimp = require('jimp')
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useFindAndModify: false }, function (err) {
    if (err)
        console.log(err)
    else
        console.log('mongodb connected ... ', process.env.DATABASE_URI)
})




async function storeImage(imageLink, s3, model) {
    let store = {}

    try {
        //썸네일 스토어
        const THUMB_SIZE = 125
        const THUMB_Q = 85
        const thumb = await thumbImg(imageLink, THUMB_SIZE, THUMB_Q);
        var thumbParams = {
            'Bucket': 'cmsnart',
            'ACL': 'public-read',
            'Body': thumb.buffer,
            'Key': 'thumbs/' + Date.now().toString() + '.jpg',
            'ContentType': 'image/jpeg'
        };
        let thumbStored = await s3.upload(thumbParams).promise();
        store.thumb = {key: thumbStored.key, location: thumbStored.Location};
        console.log(thumbStored);
    
        //이미지 스토어
        const JIMP_SIZE = 360;
        const JIMP_Q = 85;
        const image = await jimpImg(imageLink, JIMP_SIZE, JIMP_Q);
        var imageParams = {
            'Bucket': 'cmsnart',
            'ACL': 'public-read',
            'Body': image.buffer,
            'Key': 'images/' + Date.now().toString() + '.jpg',
            'ContentType': 'image/jpeg'
        };
        store.w = image.w;
        store.h = image.h;
        let imageStored = await s3.upload(imageParams).promise();
        store.image = {key: imageStored.key, location: imageStored.Location};
        console.log(imageStored);


        
        //인덱스 데이터베이스
        let s = new model({ store: store });
        return s.save(function (err, res) {
            if (err)
                console.log(err);
            else {
                console.log('Saved Image');
                return { ok: true, image: res };
            }
        });
    }
    catch (err) {
        console.log(err);
        return { ok: false };
    }
}


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
        //throw new Error('test error')
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
        throw err
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
        let resized = image.cover(size, size)
        return resized.quality(jpegQuality).getBufferAsync(Jimp.MIME_JPEG).then(buffer => {
            return { ok: true, w: resized.getWidth(), h: resized.getHeight(), buffer: buffer }
        })
    }).catch(err => {
        throw err
    })
}

let Image = require('./data/attachment.model')

let s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-east-1'
})

const IMG_LINKS = ["https://pbs.twimg.com/media/D55k2hvUUAAfhMs.jpg", "https://pbs.twimg.com/media/D4WzlIdU4AENbQp.png", "https://pbs.twimg.com/media/D4Wzq1kUIAEhCVJ.png", "https://pbs.twimg.com/media/D5xwO1AUcAATSw1.jpg", "https://pbs.twimg.com/media/D46fNvVUYAAZ22h.jpg", "https://pbs.twimg.com/media/DzsREsqUwAAwu3m.jpg", "https://pbs.twimg.com/media/D04OzJuUwAATssy.png", "https://pbs.twimg.com/media/D24nm38U4AAiRIA.jpg", "https://pbs.twimg.com/media/D5kDgCEX4AEwMxR.jpg", "https://pbs.twimg.com/media/Dv95yLGUUAIRupl.jpg", "https://pbs.twimg.com/media/D2rI5tYU0AAdtEF.jpg", "https://pbs.twimg.com/media/D58Z1avVUAA6qC9.jpg", "https://pbs.twimg.com/media/D5P0NJuUUAAJ236.png", "https://pbs.twimg.com/media/D58Xb7nVUAALcCs.jpg"]


IMG_LINKS.forEach( link => {
    storeImage(link, s3, Image) 
});
