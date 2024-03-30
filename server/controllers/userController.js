const User = require("../models/userModel")
const bcrypt = require('bcryptjs')

exports.FetchAllUser = async (req, res) => {
    try {
        const allUser = await User.find()
        res.status(200).json({
            status: "Success",
            data: allUser
        })
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error
        })
    }
}

exports.AddUser = async (req, res) => {
    try {
        const { name, email, password, role, isActivated, coins } = req.body
        const user = await User.findOne({ name })
        if (user) {
            res.status(400).json({
                message: 'username has already'
            })
            return
        }
        const checkEmail = await User.findOne({ email })
        if (checkEmail) {
            res.status(400).json({
                message: 'email has already'
            })
            return
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const AddUser = await User.create({
            name,
            email,
            role,
            coins,
            password: hashedPassword,
            isActivated
        })
        if (!AddUser) {
            res.status(400).json({
                message: 'can not add user'
            })
            return
        }
        const AllUser = await User.find()
        res.status(200).json({
            message: 'success',
            data: AllUser
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.UpdateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { name, email, role, isActivated, coins } = req.body
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({
                message: 'user not found'
            })
            return
        }
        if (name !== user.name) {
            const nameUp = await User.findOne({ name })
            if (nameUp) {
                res.status(400).json({
                    message: 'username has already'
                })
                return
            }
        }
        if (email !== user.email) {
            const emailUp = await User.findOne({ email })
            if (emailUp) {
                res.status(400).json({
                    message: 'email has already'
                })
                return
            }
        }
        const UpdateUser = await User.findByIdAndUpdate(id, { name, email, role, isActivated, coins }, { new: true })
        if (!UpdateUser) {
            res.status(400).json({
                message: 'can not update user'
            })
            return
        }
        const AllUser = await User.find()
        res.status(200).json({
            message: 'ok',
            data: AllUser
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}

exports.DeleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        if (!user) {
            res.status(404).json({
                message: 'not found'
            })
            return
        }
        const delUser = await User.findByIdAndDelete(id)
        if (!delUser) {
            res.status(400).json({
                message: 'can not remove'
            })
            return
        }
        const AllUser = await User.find()
        res.status(200).json({
            message: 'success',
            data: AllUser
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.GetRanking = async (req, res) => {
    try {
        const { idUser } = req.query
        const userExits = await User.findById(idUser)
        if (!userExits) {
            res.status(404).json({
                message: 'User not found'
            })
            return
        }
        const allUser = await User.find().sort({ coins: -1 }).select(["name", "coins"])
        const userRankNumber = allUser.map(item => item._id.toString()).indexOf(idUser)
        res.status(200).json({
            data: allUser,
            userRankNumber
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.GetCoinsUser = async(req, res) =>{
    try{
        const {id} = req.params
        const user = await User.findById(id)
        if(!user){
            res.status(404).json({
                message: 'user not found'
            })
            return
        }
        res.status(200).json({
            coins: user.coins
        })
    }
    catch(error){
        res.status(500).json({
            message: error
        })
    }
}