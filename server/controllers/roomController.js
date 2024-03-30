const Room = require('../models/roomModel')
const User = require('../models/userModel')
const RoomCate = require('../models/roomCategory')
const FrontCard = require('../models/frontCardModel');
const BackCard = require('../models/backCardModel')

const generateIdRoom = () => {
    var val = Math.floor(1000 + Math.random() * 9000);
    const idRoom = Room.findOne({ iDRoom: val })
    if (!idRoom) {
        generateIdRoom()
    }
    return val;
}

exports.createRoom = async (req, res) => {
    try {
        let iDRoom = generateIdRoom()
        const { idUser, idRoomCate } = req.body
        const owner = await User.findById(idUser).select("-password")
        if (!owner) {
            res.status(404).json({ message: "User not found" })
            return
        }
        const roomCate = await RoomCate.findById(idRoomCate)
        if (!roomCate) {
            res.status(404).json({
                message: "Room Category not found"
            })
            return
        }
        if (owner.coins < roomCate.price) {
            res.status(400).json({
                message: "The amount of coins you have is insufficient."
            })
            return
        }
        const isUserInRoom = await Room.findOne({ participants: idUser })
        if (isUserInRoom) {
            res.status(400).json({
                message: "User has joined another room",
            })
            return
        }
        const newRoom = await Room.create({
            iDRoom,
            owner: owner,
            participants: [owner],
            category: roomCate
        })
        res.status(201).json({
            status: "Success",
            newRoom
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.fetchRoom = async (req, res) => {
    try {
        const allRoom = await Room.find()
            .populate("owner", "-password")
            .populate("participants", "-password")
            .populate("cards")
            .populate("backCard")
            .populate("category")
        res.status(200).json({
            status: "Success",
            data: allRoom
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error
        })
    }
}

exports.deleteRoom = async (req, res) => {
    try {
        const { id } = req.params
        const { idUser } = req.query
        const room = await Room.findById(id)
            .populate("owner", "-password")
        if (!room) {
            res.status(404).json({
                message: "Room not found"
            })
            return
        }
        if (room.owner._id.toString() !== idUser) {
            res.status(400).json({
                message: "The room owner is the only one who can delete the room",
                data: [room.owner._id.toString(), idUser]
            })
            return
        }
        const removeRoom = await Room.findByIdAndDelete(id)
        if (!removeRoom) {
            res.status(400).json({
                message: "can not remove room"
            })
            return
        }
        res.status(200).json({
            status: "Success",
            message: "Success deleted"
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error
        })
    }
}

exports.addPlayer = async (req, res) => {
    try {
        const { id } = req.params
        const { idUser, idGuestUser } = req.body
        const room = await Room.findById(id)
            .populate("owner", "-password")
            .populate("participants", "-password")
        if (!room) {
            res.status(404).json({
                message: "Room not found"
            })
            return
        }
        if (room.owner._id.toString() !== idUser) {
            res.status(400).json({
                message: "The room owner is the only one who can add player the room",
            })
            return
        }
        if (room.participants.length >= room.occupancy) {
            res.status(400).json({
                message: "the room is already full"
            })
            return
        }
        const playerGest = await Room.findOne({ participants: idGuestUser })
        if (playerGest) {
            res.status(400).json({
                message: "It seems the player has already joined another room"
            })
            return
        }
        const newParticipants = [...room.participants, idGuestUser]
        const updateRoom = await Room.findByIdAndUpdate(id, {
            participants: newParticipants
        }, { new: true })
            .populate("owner", "-password")
            .populate("participants", "-password")
        if (!updateRoom) {
            res.status(400).json({
                message: "Unable to add player"
            })
            return
        }
        res.status(200).json({
            status: "Success",
            message: "Update SuccessFully",
            updateRoom
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.removePlayer = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const { idUser, idGuestUser } = req.body
        const room = await Room.findById(id)
        if (!room) {
            res.status(404).json({
                message: "Room not found"
            })
            return
        }
        if (idUser !== room.owner._id.toString()) {
            res.status(400).json({
                message: "The room owner is the only one who can update the room"
            })
            return
        }
        if (idGuestUser === idUser) {
            res.status(400).json({
                message: "Unable to delete yourself"
            })
            return
        }
        if (!room.participants.includes(idGuestUser)) {
            res.status(400).json({
                message: "Player is not in this room."
            })
            return
        }
        if (room.status !== "waiting") {
            res.status(400).json({
                message: "Cannot remove a player while the game is in progress."
            })
            return
        }
        const updateRoom = await Room.findByIdAndUpdate(id, {
            $pull: { participants: idGuestUser },
            ready: false
        }, { new: true })
            .populate("owner", "-password")
            .populate("participants", "-password")
        if (!updateRoom) {
            res.status(404).json({
                message: "Unable to add player"
            })
            return
        }
        res.status(200).json({
            status: "Success",
            updateRoom
        })
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error.message
        })
    }
}

exports.enterTheRoom = async (req, res) => {
    try {
        const { idRoom } = req.params
        const { idUser } = req.body
        const room = await Room.findOne({ iDRoom: idRoom })
            .populate("category")
        if (!room) {
            res.status(404).json({
                message: "Room not found",
                idRoom
            })
            return
        }
        if (room.participants.length >= room.occupancy) {
            res.status(400).json({
                message: "the room is already full"
            })
            return
        }
        const userExits = await User.findById(idUser)
        if (!userExits) {
            res.status(400).json({
                message: "User does not exist in the system"
            })
            return
        }
        const user = await Room.findOne({ participants: idUser })
        if (user) {
            res.status(400).json({
                message: "It seems the player has already joined another room"
            })
            return
        }
        if (userExits.coins < room.category.price) {
            res.status(400).json({
                message: "The amount of coins you have is insufficient."
            })
            return
        }
        const updateRoom = await Room.findByIdAndUpdate(room._id.toString(), {
            $push: { participants: idUser }
        }, { new: true })
            .populate("owner", "-password")
            .populate("participants", "-password")

        if (!updateRoom) {
            res.status(400).json({
                message: "Cannot join this room"
            })
        }
        res.status(200).json({
            status: "Success",
            updateRoom
        })
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error
        })
    }
}

exports.startGame = async (req, res) => {
    try {
        const { id } = req.params
        const { idUser } = req.body
        const room = await Room.findById(id)
            .populate("participants", "-password")
            .populate("category")

        if (!room) {
            res.status(404).json({
                message: "Room not found"
            })
            return
        }
        if (room.owner._id.toString() !== idUser) {
            res.status(400).json({
                message: "Only the room owner can start the game"
            })
            return
        }
        if (room.participants.length !== room.occupancy) {
            res.status(400).json({
                message: "Invalid number of players"
            })
            return
        }
        if (room.status !== "waiting") {
            res.status(400).json({
                message: "The match has already started."
            })
            return
        }

        let cards = await FrontCard.find({ isUsed: true }).limit(8)
        let backCard = await BackCard.find({ isUsed: true }).limit(1)
        if (backCard.length < 1) {
            res.status(400).json({
                message: 'not found back card'
            })
            return
        }

        if (cards.length < 8) {
            res.status(400).json({
                message: "Not enough cards to start"
            })
            return
        }

        if (!room.ready) {
            res.status(400).json({
                message: "Please make sure all players are ready before starting the game"
            })
            return
        }
        let doubledCards = [...cards, ...cards];
        for (let i = doubledCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [doubledCards[i], doubledCards[j]] = [doubledCards[j], doubledCards[i]];
        }

        let stateCard = []
        for (let i = 0; i < cards.length * 2; i++) {
            stateCard.push(false)
        }
        const updateRoom = await Room.findByIdAndUpdate(id, {
            cards: doubledCards,
            status: "started",
            stateCard,
            turn: room.participants[0],
            backCard,
            pairPlayers: [0, 0],
            timeEndGame: new Date(Date.now() + room.category.duration * 60000)
        }, { new: true })
            .populate("owner", "-password")
            .populate("participants", "-password")
            .populate("cards")
            .populate("backCard")
        if (!updateRoom) {
            res.status(400).json({
                message: "Unable to start the match due to some unspecified errors."
            })
            return
        }
        res.status(200).json({
            updateRoom
        })
    } catch (error) {
        res.status(500).json({
            status: "Error",
            message: error
        })
    }
}

exports.getUserRoom = async (req, res) => {
    try {
        const { idUser } = req.params
        const user = await Room.findOne({ participants: idUser })
            .populate("owner", "-password")
            .populate("participants", "-password")
            .populate("cards")
            .populate("stateCard")
            .populate("backCard")
            .populate("turn", "-password")
            .populate("category")
        if (!user) {
            res.status(404).json({
                message: 'User not found'
            })
            return
        }
        res.status(200).json({
            status: 'success',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error
        })
    }
}

exports.updateCardInGame = async (req, res) => {
    try {
        const { id } = req.params
        const { userId, clickedIndex } = req.body
        const room = await Room.findById(id)
        if (!room) {
            res.status(400).json({
                message: 'room not found'
            })
            return
        }
        if (room.status !== "started") {
            res.status(400).json({
                message: "Match hasn't started yet"
            })
            return
        }
        if (!room.participants.includes(userId)) {
            res.status(400).json({
                message: 'There is no such player in the room'
            })
            return
        }
        if (userId !== room.turn[0]._id.toString()) {
            res.status(400).json({
                message: 'This is not your turn'
            })
            return
        }
        if (clickedIndex >= 16 || clickedIndex < 0 || typeof clickedIndex !== "number") {
            res.status(400).json({
                message: 'Invalid location'
            })
            return
        }
        const updateCards = [...room.stateCard]
        if (updateCards[clickedIndex] === true) {
            res.status(400).json({
                message: 'This card has been revealed'
            })
            return
        }
        updateCards[clickedIndex] = true
        if (room.clickedIndexes.length + 1 === 2) {
            const index1 = room.clickedIndexes[0]
            const index2 = clickedIndex
            const card1 = room.cards[index1]._id.toString()
            const card2 = room.cards[index2]._id.toString()
            // console.log(room.cards[index1]._id.toString())
            // console.log(room.cards[index2]._id.toString())
            let indexesVirtual = [index1, index2]
            let stateCardVirtual = [...updateCards]
            let pairPlayersTmp = [...room.pairPlayers]
            if (card1 !== card2) {
                updateCards[index1] = false
                updateCards[index2] = false

            } else if (card1 === card2) {
                if (room.turn[0]._id.toString() === room.participants[0]._id.toString()) {
                    pairPlayersTmp[0]++
                } else {
                    pairPlayersTmp[1]++
                }
            }

            let newTurn;
            if (room.turn[0]._id.toString() === room.participants[0]._id.toString()) {
                newTurn = room.participants[1]
            } else {
                newTurn = room.participants[0]
            }
            const newUpdateRoom = await Room.findByIdAndUpdate(id, {
                turn: newTurn,
                clickedIndexes: [],
                stateCard: updateCards,
                pairPlayers: pairPlayersTmp
            }, { new: true })
                .populate("owner", "-password")
                .populate("participants", "-password")
                .populate("cards")
                .populate("stateCard")
                .populate("backCard")
                .populate("turn", "-password")
                .populate("category")

            if (!newUpdateRoom) {
                res.status(400).json({
                    message: 'Can not update'
                })
                return
            }

            if (newUpdateRoom.pairPlayers[0] + newUpdateRoom.pairPlayers[1] === 8) {
                endGame = true
                let idUserWin
                let idUserLose
                let stateGame
                if (newUpdateRoom.pairPlayers[0] > newUpdateRoom.pairPlayers[1]) {
                    idUserWin = newUpdateRoom.participants[0]
                    idUserLose = newUpdateRoom.participants[1]
                    newUpdateRoom.participants[0].coins += newUpdateRoom.category.price
                    newUpdateRoom.participants[1].coins -= newUpdateRoom.category.price
                } else if (newUpdateRoom.pairPlayers[0] < newUpdateRoom.pairPlayers[1]) {
                    idUserLose = newUpdateRoom.participants[0]
                    idUserWin = newUpdateRoom.participants[1]
                    newUpdateRoom.participants[0].coins -= newUpdateRoom.category.price
                    newUpdateRoom.participants[1].coins += newUpdateRoom.category.price
                } else if (newUpdateRoom.pairPlayers[0] === newUpdateRoom.pairPlayers[1]) {
                    stateGame = "draw"
                }
                const pl1 = await User.findByIdAndUpdate(room.participants[0]._id, {
                    coins: newUpdateRoom.participants[0].coins
                }, { new: true })
                const pl2 = await User.findByIdAndUpdate(room.participants[1]._id, {
                    coins: newUpdateRoom.participants[1].coins
                }, { new: true })
                res.status(200).json({
                    message: 'success',
                    newUpdateRoom,
                    stateCardVirtual,
                    indexesVirtual,
                    endGame,
                    stateGame,
                    idUserWin,
                    idUserLose
                })
                return
            }
            res.status(200).json({
                message: 'success',
                newUpdateRoom,
                stateCardVirtual,
                indexesVirtual,
                pairPlayers: pairPlayersTmp
            })
            return
        }
        const updateRoom = await Room.findByIdAndUpdate(id, {
            $push: { clickedIndexes: clickedIndex },
            stateCard: updateCards
        }, { new: true })
            .populate("owner", "-password")
            .populate("participants", "-password")
            .populate("cards")
            .populate("stateCard")
            .populate("backCard")
            .populate("turn", "-password")
        if (!updateCards) {
            res.status(400).json({
                message: 'can not set state card'
            })
            return
        }
        res.status(200).json({
            message: 'success',
            updateRoom
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error
        })
    }
}

exports.endGameAndBackRoom = async (req, res) => {
    try {
        const { id } = req.params
        const room = await Room.findById(id)
        if (!room) {
            res.status(404).json({
                message: 'room not found'
            })
        }
        const updateRoom = await Room.findByIdAndUpdate(id, {
            cards: [],
            backCard: [],
            clickedIndexes: [],
            stateCard: [],
            ready: false,
            status: "waiting"
        }, { new: true })
            .populate("owner", "-password")
            .populate("participants", "-password")
            .populate("cards")
            .populate("stateCard")
            .populate("backCard")
            .populate("turn", "-password")
        if (!updateRoom) {
            res.status(400).json({
                message: "can not update room"
            })
            return
        }
        res.status(200).json({
            status: "success",
            updateRoom
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.deleteRoomAd = async (req, res) => {
    try {
        const { id } = req.params
        const room = await Room.findById(id)
        if (!room) {
            res.status(404).json({
                message: 'Not Found'
            })
            return
        }

        const deleteRoom = await Room.findByIdAndDelete(id)
        if (!deleteRoom) {
            res.status(400).json({
                message: 'can not delete'
            })
            return
        }
        const AllRoom = await Room.find()
        res.status(200).json({
            data: AllRoom
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.ChangeReady = async (req, res) => {
    try {
        const { id } = req.params
        const { ready } = req.body
        const room = await Room.findById(id)
        if (!room) {
            res.status(404).json({
                message: 'room not found'
            })
            return
        }
        const RoomUpdate = await Room.findByIdAndUpdate(id, {
            ready
        }, { new: true })
            .populate("owner", "-password")
            .populate("participants", "-password")
        if (!RoomUpdate) {
            res.status(400).json({
                message: 'can not ready'
            })
            return
        }
        res.status(200).json({
            data: RoomUpdate
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.timeOut = async (req, res) => {
    try {
        const { id } = req.params
        const room = await Room.findById(id).select(["pairPlayers", "category", "participants"])
            .populate("category", "price")
            .populate("participants", "-password")
        if (!room) {
            res.status(404).json({
                message: 'Room not found'
            })
            return
        }
        const player1 = room.participants[0]
        const player2 = room.participants[1]
        let playerWin;
        let playerLose;
        let stateGame;
        console.log(room.pairPlayers[1], room.pairPlayers[0])
        if (room.pairPlayers[0] > room.pairPlayers[1]) {
            player1.coins += (room.category.price)
            player2.coins -= (room.category.price)
            playerWin = player1
            playerLose = player2
        } else if (room.pairPlayers[0] < room.pairPlayers[1]) {
            player1.coins -= (room.category.price)
            player2.coins += (room.category.price)
            playerWin = player2
            playerLose = player1
        } else if (room.pairPlayers[0] === room.pairPlayers[1]) {
            stateGame = "draw"
        }
        const pl1 = await User.findByIdAndUpdate(room.participants[0]._id, {
            coins: player1.coins
        }, { new: true })
        const pl2 = await User.findByIdAndUpdate(room.participants[1]._id, {
            coins: player2.coins
        }, { new: true })
        const updateRoom = await Room.findByIdAndUpdate(id, {
            status: "waiting",
            backCard: [],
            cards: [],
            stateCard: [],
            turn: player1,
            clickedIndexes: [],
            ready: false,
            pairPlayers: [0, 0]
        }, { new: true })
        res.status(200).json({
            data: updateRoom,
            stateGame,
            playerWin,
            playerLose,
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

exports.PlayNow = async (req, res) => {
    try {
        const { idUser } = req.params
        const user = await User.findById(idUser)
        if (!user) {
            res.status(404).json({
                message: 'user not found'
            })
            return
        }
        const checkUserJoinRoom = await Room.findOne({ participants: user })
        if (checkUserJoinRoom) {
            res.status(400).json({
                message: "The player has already joined another room"
            })
            return
        }
        const roomFind = await Room.find({
            status: 'waiting',
            $expr: { $lt: [{ $size: '$participants' }, '$occupancy'] }
        })
            .populate('category')
        if (roomFind.length < 1) {
            res.status(404).json({
                message: "Currently, there are no suitable rooms for you."
            })
            return
        }
        const roomFilter = roomFind.filter(item => user.coins >= item.category.price)
        if (roomFilter.length < 1) {
            res.status(404).json({
                message: "Currently, there are no suitable rooms for you."
            })
            return
        }
        const roomWillJoin = roomFilter[0]
        const updateRoom = await Room.findByIdAndUpdate(roomFilter[0]._id, {
            $push: { participants: user }
        }, { new: true })
        if (!updateRoom) {
            res.status(400).json({
                message: 'can not update room'
            })
            return
        }
        res.status(200).json({
            updateRoom,
        })
        return
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}