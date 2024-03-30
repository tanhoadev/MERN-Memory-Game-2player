const RoomCate = require('../models/roomCategory')

exports.fetchRoomCate = async (req, res) => {
    try {
        const AllRoomCate = await RoomCate.find()
        res.status(200).json({
            data: AllRoomCate
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.AddRoomCate = async (req, res) => {
    try {
        const { duration, price } = req.body
        const newRoomCate = await RoomCate.create({
            duration,
            price
        })
        if (!newRoomCate) {
            res.status(400).json({
                message: 'Can not add RoomCate'
            })
            return
        }
        const AllRoomCate = await RoomCate.find()
        res.status(200).json({
            message: 'Success',
            data: AllRoomCate
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.UpdateRoomCate = async (req, res) => {
    try {
        const { id } = req.params
        const { duration, price } = req.body
        const roomCate = await RoomCate.findById(id)
        if (!roomCate) {
            res.status(400).json({
                message: 'Room cate not found'
            })
            return
        }
        const updateRoomCate = await RoomCate.findByIdAndUpdate(id, {
            duration,
            price
        }, { new: 'true' })
        if (!updateRoomCate) {
            res.status(400).json({
                message: 'Can not update RoomCate'
            })
            return
        }
        const AllRoomCate = await RoomCate.find()
        res.status(201).json({
            data: AllRoomCate
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.DeleteRoomCate = async (req, res) => {
    try {
        const { id } = req.params
        const roomCate = await RoomCate.findById(id)
        if (!roomCate) {
            res.status(400).json({
                message: 'Room cate not found'
            })
            return
        }
        const deleteRoomCate = await RoomCate.findByIdAndDelete(id)
        if (!deleteRoomCate) {
            res.status(400).json({
                message: 'can not delete RoomCate'
            })
            return
        }
        const AllRoomCate = await RoomCate.find()
        res.status(200).json({
            data: AllRoomCate
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}