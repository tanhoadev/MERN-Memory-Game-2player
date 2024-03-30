const express = require('express')
const cardController = require('../controllers/cardController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/get-back-card', protect, cardController.getBackCard)
router.post('/add-back-card',protect, cardController.addBackCard)
router.put('/update-back-card/:_id',protect, cardController.UpdateBackCard)
router.delete('/delete-back-card/:_id',protect, cardController.DeleteBackCard)

router.get('/get-front-card',protect, cardController.getFrontCard)
router.post('/add-front-card',protect, cardController.addFrontCard)
router.put('/update-front-card/:_id',protect, cardController.updateFrontCard)
router.delete('/delete-front-card/:_id',protect, cardController.deleteFrontCard)

module.exports = router