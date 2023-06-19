const router = require('express').Router()
const { authMiddleware } = require('../Middlewares/authMiddleware')

const authService = require('../Services/authService')

router.get('/', authMiddleware, async (req, res) => {
    res.json(await authService.getAll())
})

router.get('/getUser/:token', authMiddleware, async (req, res) => {
    res.json(await authService.getUserByToken(req.params?.user?._id))
})

router.post('/initUser', async (req, res) => {
    let result = await authService.initUser(req.body)

    res.json(result)
})

router.post('/leaveUser/:token', authMiddleware, async (req, res) => {
    let result = await authService.leaveUser(req.body?.user)

    res.json(result)
})

router.get('/getUserByUsernames/:token/:searchValue', authMiddleware, async (req, res) => {
    res.json(await authService.getUserByUsernames(req.params.searchValue))
})


router.get('/getGameStatistic', async (req, res) => {
    res.json(await authService.getGameStatistic())
})

router.post('/rateUs/:token', authMiddleware, async (req, res) => {
    let result = await authService.rateUs(req.body?.num, req.params?.user?._id)

    res.json(result)
})





module.exports = router