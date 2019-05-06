const aws = require('aws-sdk');
const fs  = require('fs');
const dotenv = require('dotenv')
const Jimp = require('jimp')
const path = require('path');

dotenv.config()

let s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRET,
    region : 'us-east-1'

})

jimpImg('https://pbs.twimg.com/media/D55s2R8UwAASOO3.png', 320, 80).then((buffer)=>{
    var param = {
        'Bucket':'cmsnart',
        'ACL':'public-read',
        'Body':buffer,
        'Key': 'image/' + Date.now().toString()+'.jpg',
        'ContentType':'image/jpeg'
    }

    s3.upload(param, function(err, data){
        if(err) {
            console.log(err);
        }else{
            console.log(data);
    
        }
    });
})







async function jimpImg(imageSrc, width, jpegQuality) {

    console.log('[dataParser.js/jimpImg] Trying to jimp from src:', imageSrc);

    return Jimp.read(imageSrc).then(image => {
        console.log("[dataParser.js] jimp Image size WH", image.bitmap.width, image.bitmap.height)
        return image.resize(width, Jimp.AUTO).quality(jpegQuality).getBufferAsync(Jimp.MIME_JPEG)
    }).then(buffer => {
        console.info('[dataParser.js] Jimped Image');
        return buffer //[{ type: 'photo', src: buffer, source: 'base64', media_url_https: it.image }]; // media_url_https depreciated
        //console.log('<img src="'+buffer+'">');
    }).catch(err => {
        console.error(err);
    })

}