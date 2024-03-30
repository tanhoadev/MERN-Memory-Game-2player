const express = require('express')
const RoomCategoryController = require('../controllers/roomCategoryController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', protect, RoomCategoryController.fetchRoomCate)
router.post('/add', protect, RoomCategoryController.AddRoomCate)
router.put('/update-cate/:id', protect, RoomCategoryController.UpdateRoomCate)
router.delete('/:id', protect, RoomCategoryController.DeleteRoomCate)

module.exports = router