// import FrontCard from '../models/frontCardModel'
const FrontCard = require('../models/frontCardModel')
const BackCard = require('../models/backCardModel')
const createError = require('../utils/appError')

exports.getFrontCard = async (req, res) => {
    try {
        await FrontCard.find()
            .then((result) => {
                res.status(200).json({
                    status: "Success",
                    data: result
                })
            })
    } catch (error) {
        res.status(500).json({ message: 'error get frontCard' })
    }
}

exports.addFrontCard = async (req, res, next) => {
    try {
        const frontCard = await FrontCard.findOne({ src: req.body.src })
        if (frontCard) {
            return next(new createError("Card already exists.", 400))
        }
        const newFrontCard = await FrontCard.create({
            src: req.body.src,
            isUsed: req.body.isUsed
        })
        const AllFrontCard = await FrontCard.find()
        res.status(201).json({
            status: "Success",
            newFrontCard,
            data: AllFrontCard
        })
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: error
        })
    }
}

exports.updateFrontCard = async (req, res) => {
    try {
        const id = req.params._id
        const { src, isUsed } = req.body
        const frontCard = await FrontCard.findById(id)
        if (!frontCard) {
            res.status(404).json({
                message: 'NotFound'
            })
            return
        }
        const updateFrontCard = await FrontCard.findByIdAndUpdate(id, { src, isUsed }, { new: true })
        if (!updateFrontCard) {
            res.status(400).json({
                status: "Error",
                message: 'Failed to update data'
            })
        } else {
            const AllFrontCard = await FrontCard.find()
            res.status(201).json({
                status: "Success",
                newFront: {
                    _id: updateFrontCard._id,
                    src: updateFrontCard.src,
                    isUsed: updateFrontCard.isUsed
                },
                data: AllFrontCard
            })
        }
    } catch {
        res.status(500).json({
            status: "Error",
            message: 'Failed to update data'
        })
    }
}

exports.deleteFrontCard = async (req, res) => {
    try {
        const { _id } = req.params
        const frontCard = await FrontCard.findById(_id)
        if (!frontCard) {
            res.status(404).json({
                message: 'Not Found'
            })
            return
        }
        const deleteFrontCard = await FrontCard.findByIdAndDelete(_id)
        if (!deleteFrontCard) {
            res.status(400).json({
                message: 'can not delete front card'
            })
            return
        }
        const AllFrontCard = await FrontCard.find()
        res.status(200).json({
            status: "Success",
            data: AllFrontCard
        })
    } catch (error) {
        res.status(500).json({ status: "Error", message: error })
    }
}

exports.getBackCard = async (req, res) => {
    try {
        await BackCard.find()
            .then((result) => {
                res.status(200).json({
                    status: "Success",
                    data: result
                })
            })
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error
        })
    }
}

exports.addBackCard = async (req, res, next) => {
    try {
        const backcard = await BackCard.findOne({ src: req.body.src })
        if (backcard) {
            return next(new createError('Card already exists.'), 400)
        }
        const newBackCard = await BackCard.create({
            src: req.body.src,
            isUsed: req.body.isUsed
        })
        const AllBackCard = await BackCard.find()
        res.status(201).json({
            status: "Success",
            newBack: {
                _id: newBackCard._id,
                src: newBackCard.src,
                isUsed: newBackCard.isUsed
            },
            data: AllBackCard
        })
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error
        })
    }
}

exports.UpdateBackCard = async (req, res) => {
    try {
        const _id = req.params._id
        const { src, isUsed } = req.body

        const UpdateBackCard = await BackCard.findByIdAndUpdate(_id, { src, isUsed }, { new: true })
        if (!UpdateBackCard) {
            res.status(400).json({
                status: "Error",
                message: 'Failed to update data'
            })
        } else {
            const AllBackCard = await BackCard.find()
            res.status(201).json({
                status: "Success",
                newBack: {
                    _id: UpdateBackCard._id,
                    src: UpdateBackCard.src,
                    isUsed: UpdateBackCard.isUsed
                },
                data: AllBackCard
            })
        }
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: 'Failed to update data'
        })
    }
}

exports.DeleteBackCard = async (req, res) => {
    try {
        const _id = req.params._id
        const backcard = await BackCard.findById(_id)
        if (!backcard) {
            res.status(404).json({
                message: 'back card not found'
            })
            return
        }
        const deleteBackCard = await BackCard.findByIdAndDelete(_id)
        if (!deleteBackCard) {
            res.status(400).json({
                message: 'can not delete back card'
            })
            return
        }
        const AllBackCard = await BackCard.find()
        res.status(200).json({
            data: AllBackCard
        })
    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
}