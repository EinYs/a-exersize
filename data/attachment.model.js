const mongoose = require('mongoose')

module.exports = mongoose.model('attachment', {
    store: {
        w: Number,
        h: Number,
        image: {key:String, location:String},
        thumb: {key:String, location:String}
    }
})