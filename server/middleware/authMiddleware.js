const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = await User.findById(decoded.id).select("-password")
            next()
        } catch {
            res.status(401).json({
                status: "error",
                message: "Not authorized, token failed"
            })
        }
    }
    if (!token) {
        res.status(401).json({
            status: "error",
            message: "Not authorized, token failed"
        })
    }
}

module.exports = { protect }