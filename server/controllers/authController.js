const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const createError = require('../utils/appError')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const { off } = require('process')
require('dotenv').config()

//REGISTER USERS
exports.signup = async (req, res, next) => {
    try {
        const emailUser = await User.findOne({ email: req.body.email })

        if (emailUser) {
            return next(new createError('Email already exists!', 400))
        }
        const user = await User.findOne({ name: req.body.name })
        if(user){
            return next(new createError('User already exists!', 400))
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12)

        const newUser = await User.create({
            ...req.body,
            password: hashedPassword
        })

        // Assign jwt
        const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY, {
            expiresIn: '90d'
        })

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

//LOGIN USER
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) return next(new createError('User not found', 404))

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return next(new createError("Invalid email or password", 400))
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: '90d'
        })

        res.status(200).json({
            status: 'success',
            token,
            message: 'Logged in successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                coins: user.coins,
                role: user.role
            }
        })
    } catch (error) {
        next(error)
    }
}

// exports.verifmail = async (email, link) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.USER,
//                 pass: process.env.PASSWORD
//             }
//         })
//         //send mail
//         let info = await transporter.sendMail({
//             from: process.env.USER,
//             to: email,
//             subject: "Account Verification",
//             text: "Welcome",
//             html: `
//             <div>
//              <a href=${link}>Click here to active your account</a>
//             </div>
//             `
//         })
//         console.log('mail send successfully')
//     } catch (error) {
//         console.log(error, "mail failed to send")
//     }
// }