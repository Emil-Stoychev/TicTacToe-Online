const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { authMiddleware } = require('../Middlewares/authMiddleware')
const { createChat, userChats, findChat, addMessage, getMessages, deleteMessage } = require('../Services/chatService')


router.post('/', authMiddleware, async (req, res) => {
    let result = await createChat(req.body.senderId, req.body.receiverId)

    return res.status(200).json(result) || res.status(500).json(result)
})

router.get('/:userId', async (req, res) => {
    let result = await userChats(req.params.userId)

    return res.status(200).json(result) || res.status(500).json(result)
})

router.get('/find/:firstId/:secondId', async (req, res) => {
    let result = await findChat(req.params.firstId, req.params.secondId)

    return res.status(200).json(result) || res.status(500).json(result)
})

router.post('/message', authMiddleware, async (req, res) => {
    let result = await addMessage(req.body.message.chatId, req.body.message.senderId, req.body.message.text, req.body.message.image)

    return res.status(200).json(result) || res.status(500).json(result)
})
router.get('/message/:chatId/:skipNumber', async (req, res) => {
    let result = await getMessages(req.params.chatId, req.params.skipNumber)

    return res.status(200).json(result) || res.status(500).json(result)
})

module.exports = router
