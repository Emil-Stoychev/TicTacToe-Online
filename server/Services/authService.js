const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../Models/User')
const { Game } = require('../Models/Game')
const { GameStatistic } = require('../Models/GameStatistic')

let sessionName = 'sessionStorage'
let secret = 'asdkamsioj321hj01jpdomasdx]c[;zc-3-='

const getUserByToken = async (_id) => {
    try {
        console.log(_id);
        let userAcc = await User.findById(_id)

        if (!userAcc) {
            return { message: 'User does not exist!' }
        }

        return userAcc
    } catch (error) {
        return error
    }
}

const getUserByUsernames = async (searchValue) => {
    try {
        let users = await User.find({ username: { $regex: ("^" + searchValue) } })

        return users
    } catch (error) {
        return error
    }
}

const leaveUser = async (user) => {
    try {
        let currUser = await User.findById(user?._id)

        let ids = {
            userId: currUser?._id,
            gameId: currUser?.gameId,
        }

        let game = await Game.findById(currUser?.gameId)

        if (game) {
            if (game.members.length > 1) {
                game.members = game.members.filter(x => x != user?._id)
                game.author = game.members[0]

                await game.save()
            } else {
                await Game.findByIdAndDelete(currUser?.gameId)
            }
        }

        await User.findByIdAndDelete(currUser?._id)

        return ids
    } catch (error) {
        return error
    }
}

const initUser = async (data) => {
    try {
        let { username, uuid, option = '' } = data

        let user = await User.findOne({ username })

        if (!user) {
            user = await User.create({
                username,
                uuid,
            })

            let gameStats = await GameStatistic.findOne()

            if (!gameStats) {
                await GameStatistic.create({
                    happyUsers: 0,
                    playedUsers: 1,
                    fiveStars: 0
                })
            } else {
                gameStats.playedUsers = gameStats.playedUsers + 1

                await gameStats.save()
            }
        }

        let result = await new Promise((resolve, reject) => {
            jwt.sign({ _id: user?._id, username: user?.username, uuid: user.uuid }, secret, { expiresIn: '2d' }, (err, token) => {
                if (err) {
                    return reject(err)
                }

                resolve(token)
            })
        })

        if (user.gameId != undefined && user.gameId != '') {
            if (user.gameOption == 'create') {
                let game = await Game.findById(user.gameId)

                if (game.members.includes(user._id)) {
                    return { username: user?.username, uuid: user?.uuid, _id: user?._id, token: result, gameOption: 'create', gameId: game.roomId }
                }

                return { username: user?.username, uuid: user?.uuid, _id: user?._id, token: result, gameOption: 'create', gameId: game.roomId }
            } else if (user.gameOption == 'join') {
                let game = await Game.findById(user.gameId)

                if (game.members.includes(user._id)) {
                    return { username: user?.username, uuid: user?.uuid, _id: user?._id, token: result, gameOption: user.gameOption, gameId: game.roomId }
                }

                return { username: user?.username, uuid: user?.uuid, _id: user?._id, token: result, gameOption: 'join' }
            } else {
                return { username: user?.username, uuid: user?.uuid, _id: user?._id, token: result, gameOption: 'random' }
            }
        } else {
            return { username: user?.username, uuid: user?.uuid, _id: user?._id, token: result }
        }

    } catch (error) {
        return error
    }
}

const getGameStatistic = async () => {
    try {
        let gameStats = await GameStatistic.findOne()

        if (!gameStats) {
            gameStats = await GameStatistic.create({
                happyUsers: 0,
                playedUsers: 1,
                fiveStars: 0
            })
        }

        return gameStats
    } catch (error) {
        return error
        console.log(error)
    }
}

const rateUs = async (number, userId) => {
    try {
        let user = await User.findById(userId)

        if (!user) {
            return { message: 'Unauthorized!' }
        }

        let gameStats = await GameStatistic.findOne()

        if (!gameStats) {
            gameStats = await GameStatistic.create({
                happyUsers: 0,
                playedUsers: 1,
                fiveStars: 0
            })
        }

        if (gameStats.peoples.includes(userId)) {
            return { message: 'You already rated!' }
        }

        if (number == 5) {
            gameStats.happyUsers = gameStats.happyUsers + 1
            gameStats.fiveStars = gameStats.fiveStars + 1
        } else {
            gameStats.happyUsers = gameStats.happyUsers + 1
        }

        gameStats.peoples.push(userId)

        await gameStats.save()

        return gameStats
    } catch (error) {
        return error
        console.log(error)
    }
}

module.exports = {
    initUser,
    getUserByUsernames,
    getUserByToken,
    leaveUser,
    getGameStatistic,
    rateUs
}