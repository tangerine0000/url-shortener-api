const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortCode: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    longUrl: {
        type: String,
        required: true,
        trim: true,
        match: /^(http|https):\/\/[^ "]+$/
    },
    clicks: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastAccessedAt: {
        type: Date
    }
});

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;
