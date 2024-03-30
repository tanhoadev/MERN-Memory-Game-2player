const express = require('express')
const UserController = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', protect, UserController.FetchAllUser)
router.post('/add', protect, UserController.AddUser)
router.put('/update/:id', protect, UserController.UpdateUser)
router.delete('/:id', protect, UserController.DeleteUser)
router.get('/ranking', protect, UserController.GetRanking)
router.get('/:id', UserController.GetCoinsUser)

module.exports = router