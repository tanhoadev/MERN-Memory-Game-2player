const mongoose = require('mongoose')

const RoomCategorySchema = new mongoose.Schema({
    duration: {
        type: Number,
        default: 3
    },
    price: {
        type: Number,
        default: 1
    }
})

const RoomCategory = mongoose.model("RoomCategory", RoomCategorySchema)

module.exports = RoomCategory