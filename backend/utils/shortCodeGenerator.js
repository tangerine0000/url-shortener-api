const Counter = require('../models/Counter');
const { toBase62 } = require('./base62');

async function getNextSequenceValue(sequenceName) {
    const counter = await Counter.findByIdAndUpdate(
        sequenceName,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
}

async function generateShortCode() {
    const sequenceNum = await getNextSequenceValue('url_id')
    let shortCode = toBase62(sequenceNum);
    while (shortCode.length < 5) {
        shortCode = '0' + shortCode;
    }
    return shortCode;
}

module.exports = { generateShortCode };