const mongoose = require('mongoose');
const shortid = require('shortid');

const urlSchema = new mongoose.Schema({
    urlCode: {
        type: String,
        unique: true,
        trim: true
    },
    longUrl: {
        type: String,
        required: true,
        trim: true
    },
    shortUrl: {
        type: String,
        unique: true,
        trim: true
    }
})

const Short_Url = mongoose.model('Short_Url', urlSchema);

module.exports = Short_Url;