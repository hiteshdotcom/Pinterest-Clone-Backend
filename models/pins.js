const mongoose = require('mongoose');

const pinsSchema = new mongoose.Schema({
    imgUrl: String,
    title: String,
    description: String,
})

const Pins = mongoose.model('pins', pinsSchema);

module.exports = {Pins};