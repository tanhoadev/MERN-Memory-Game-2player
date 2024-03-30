const mongoose = require("mongoose")

const BackCardSchema = ({
    src: {
        type: String,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
})

const BackCard = mongoose.model("BackCard", BackCardSchema)

module.exports = BackCard