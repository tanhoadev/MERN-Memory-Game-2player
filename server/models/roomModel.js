const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    iDRoom: {
        type: Number,
        required: true,
        unique: true
    },
    occupancy: {
        type: Number,
        default: 2
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    ready: {
        type: Boolean,
        default: false
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "RoomCategory",
        require: true
    },
    timeEndGame: {
        type: Date
    },
    participants: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    cards: [{
        type: mongoose.Types.ObjectId,
        ref: "Card",
    }],
    backCard: [{
        type: mongoose.Types.ObjectId,
        ref: "BackCard"
    }],
    stateCard: [{
        type: Boolean,
        default: false
    }],
    turn: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],
    clickedIndexes: [{
        type: Number,
    }],
    pairPlayers: [{
        type: Number
    }],
    status: {
        type: String,
        enum: ['waiting', 'started', 'finished'],
        default: 'waiting'
    }
}, { timestamps: true })

const Room = mongoose.model("Room", roomSchema)

module.exports = Room