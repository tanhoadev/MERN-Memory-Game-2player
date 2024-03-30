const mongoose = require('mongoose')

const CardSchema = new mongoose.Schema({
    src: {
        type: String,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const CardFront = mongoose.model("Card", CardSchema)

module.exports = CardFront