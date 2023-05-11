const router = require('express').Router()
const { authMiddleware } = require('../Middlewares/authMiddleware')

const gameService = require('../Services/gameService')

router.get('/', authMiddleware, async (req, res) => {
    res.json(await gameService.getAll())
})


router.get('/getGame/:gameId/:token', authMiddleware, async (req, res) => {
    res.json(await gameService.getGame(req.params.gameId))
})

router.post('/setInBoard', async (req, res) => {
    res.json(await gameService.setInBoard(req.body.data))
})






router.post('/createRoom/:token', authMiddleware, async (req, res) => {
    let result = await gameService.createRoom(req.params?.user?._id)

    res.json(result)
})

router.post('/joinRoom/:token', authMiddleware, async (req, res) => {
    let result = await gameService.joinRoom(req.params?.user?._id, req.body?.data)

    res.json(result)
})

router.post('/randomRoom/:token', authMiddleware, async (req, res) => {
    let result = await gameService.randomRoom(req.params?.user?._id)

    res.json(result)
})

router.post('/leaveRoom/:token', authMiddleware, async (req, res) => {
    let result = await gameService.leaveRoom(req.params?.user?._id)

    res.json(result)
})

module.exports = router
