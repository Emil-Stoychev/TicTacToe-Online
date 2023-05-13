const router = require('express').Router()
const { authMiddleware } = require('../Middlewares/authMiddleware')
const { addMessage, getMessages } = require('../Services/chatService')


router.post('/sendMessage/:token', authMiddleware, async (req, res) => {
    let result = await addMessage(req.body.message, req.params.user._id)

    return res.status(200).json(result) || res.status(500).json(result)
})

router.get('/messages/:skipNumber', async (req, res) => {
    let result = await getMessages(req.params.skipNumber)

    return res.status(200).json(result) || res.status(500).json(result)
})

module.exports = router
