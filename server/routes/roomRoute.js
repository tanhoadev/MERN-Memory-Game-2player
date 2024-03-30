const express = require('express')
const roomController = require('../controllers/roomController')
const { protect } = require('../middleware/authMiddleware')


const router = express.Router()

router.get('/', roomController.fetchRoom)
router.get('/user/:idUser', roomController.getUserRoom)
router.post('/create', roomController.createRoom)
router.delete('/delete/:id', roomController.deleteRoom)
router.put("/add-player/:id", roomController.addPlayer)
router.put("/remove-player/:id", roomController.removePlayer)
router.put('/:idRoom', roomController.enterTheRoom)
router.put('/start/:id', roomController.startGame)
router.put('/start/update-card/:id', roomController.updateCardInGame)
router.put('/game/backroom/:id', roomController.endGameAndBackRoom)
router.delete('/delete-ad/:id', roomController.deleteRoomAd)
router.put('/game/change-ready/:id', roomController.ChangeReady)
router.put('/game/timeout/:id', roomController.timeOut)
router.put('/play-now/:idUser', roomController.PlayNow)
module.exports = router