const router = require('express').Router()

const gameController = require('./controllers/gameController')
const chatController = require('./controllers/chatController')
const authController = require('./controllers/authController')

const errorController = require('./controllers/errorController')

router.use('/game', gameController)
router.use('/users', authController)
router.use('/chat', chatController)

router.use('*', errorController)

module.exports = router