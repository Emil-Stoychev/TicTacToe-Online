const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../Models/User')
const { Game } = require('../Models/Game')

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

const initUser = async (data) => {
    try {
        let { username, uuid, option = '' } = data

        let user = await User.findOne({ username })

        if (!user) {
            user = await User.create({
                username,
                uuid,
            })
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

module.exports = {
    initUser,
    getUserByUsernames,
    getUserByToken
}