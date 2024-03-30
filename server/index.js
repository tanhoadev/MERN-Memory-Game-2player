const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors')
const authRouter = require('./routes/authRoute')
const cardRoute = require('./routes/cardRoute')
const roomRoute = require('./routes/roomRoute')
const userRoute = require('./routes/userRoute')
const roomCateRoute = require('./routes/roomCategory')
require('dotenv').config()

const app = express()

//Socket.io
const http = require('http')
const { Server } = require('socket.io')
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.URL_CLIENT,
        methods: ["GET", "POST", "PUT"]
    }
})
//Socket.io

// 1) Middleware
// app.use(cors())
app.use(express.json())


// 2) Route
app.use('/api/auth', authRouter)
app.use('/api/card', cardRoute)
app.use('/api/room', roomRoute)
app.use('/api/user', userRoute)
app.use('/api/roomCate', roomCateRoute)

// 3) Mongo Db Connection
mongoose
    .connect(process.env.MONGODB)
    .then(() => console.log(`connected to MongoDb`))
    .catch((error) => console.log("failed to connect to MongoDB", error))

// 4) Global Error Handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})

//5) Server
const PORT = process.env.PORT_SERVER
server.listen(PORT, () => {
    console.log("App running on", PORT)
})

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`)
    // socket.on("leave_room", (data) => {
    //     socket.leave(data.room)
    //     socket.to(data.room).emit("receive_notify", data)
    // })



    socket.on('join_room1', (data) => {
        socket.join(data.room)
        console.log('join roommmmmmmmm')
    })
    socket.on('kick_player', (data) => {
        socket.to(data.room).emit('Notify', data)
    })

    socket.on("enter_room", (data) => {
        socket.to(data.room).emit("New_join", data)
    })

    socket.on("leave_room", (data) => {
        socket.to(data.room).emit("notify_leave", data)
        socket.leave(data.room)
    })

    socket.on("delete_room", (data) => {
        socket.to(data.room).emit("the_end_room", { message: `The room owner has disbanded the group` })
        socket.leave(data.room)
    })

    socket.on('StartGame', (data) => {
        socket.to(data.room).emit('start', { message: 'start game' })
    })

    socket.on("click_Card", (data) => {
        socket.broadcast.to(data.room).emit('card_change', data)
    })

    socket.on("change_turn", (data) => {
        socket.broadcast.to(data.room).emit('change_turn_receive', data)
    })

    socket.on("draw_Game", (data) => {
        socket.to(data.room).emit("end_game_draw", data)
    })

    socket.on("Win_Or_Lose_Game", (data) => {
        socket.to(data.room).emit("end_game_win_lose", (data))
    })

    socket.on("send_message_room", (data) => {
        socket.to(data.room).emit("received_message_room", data)
    })

    socket.on("change_ready", (data) => {
        socket.to(data.room).emit("received_ready", data)
    })


    socket.on("result_game", (data) => {
        socket.to(data.room).emit("result_game_received", data)
    })
    socket.on("result_game_draw", (data) => {
        socket.to(data.room).emit("result_game_received_draw", data)
    })





    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data)
    })
})

// io.on('connection', (socket) => {
//     console.log("User connected: " + socket.id)
// })