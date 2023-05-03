const { User } = require('../Models/User')
const { Game } = require('../Models/Game')
const { Chat } = require('../Models/Chat')

const shortid = require('shortid')

const createRoom = async (userId) => {
    try {
        let user = await User.findById(userId)

        if (!user) {
            return { message: 'User not found!' }
        }

        let gameRoom = await Game.findById(user?.gameId)

        if (gameRoom) {
            return { gameId: gameRoom?._id, members: gameRoom?.members, roomId: gameRoom?.roomId }
        }

        let newRoom = await Game.create({
            members: [userId],
            author: userId,
            visible: 'Private',
            roomId: shortid.generate()
        })

        user.gameId = newRoom?._id
        user.gameOption = 'create'
        user.save()

        return { gameId: newRoom?._id, members: newRoom?.members, roomId: newRoom?.roomId }
    } catch (error) {
        console.error(error)
        return error
    }
}

const joinRoom = async (userId, data) => {
    try {
        let user = await User.findById(userId)

        if (!user) {
            return { message: 'User not found!' }
        }

        let gameRoom
        if (data.roomId) {
            gameRoom = await Game.findOne({ roomId: data?.roomId })
        } else {
            gameRoom = await Game.findById(data?.gameId)
        }


        if (gameRoom == null || gameRoom == undefined) {
            return { message: 'Game room not found, maybe wrong code or it doesnt exist!' }
        }

        if (gameRoom.members.includes(user._id)) {
            return { gameId: gameRoom?._id, members: gameRoom?.members, roomId: gameRoom?.roomId }
        }

        if (gameRoom.members.length >= 2) {
            return { message: 'Room is full!' }
        }

        gameRoom.members.push(user?._id)
        gameRoom.save()

        user.gameId = gameRoom?._id
        user.gameOption = 'join'
        user.save()

        return { gameId: gameRoom?._id, members: gameRoom?.members, roomId: gameRoom?.roomId }
    } catch (error) {
        console.error(error)
        return error
    }
}

const randomRoom = async (userId) => {
    try {
        let user = await User.findById(userId)

        if (!user) {
            return { message: 'User not found!' }
        }

        if (user.gameId != undefined && user.gameId != '') {
            let game = await Game.findById(user.gameId)

            return { gameId: game?._id, members: game?.members, roomId: game?.roomId }
        }

        let gameRoom = await Game.findOne({ visible: 'Public', members: { $size: 1 } })

        if (gameRoom) {
            user.gameId = gameRoom?._id
            user.gameOption = 'random'
            user.save()

            gameRoom.members.push(user?._id)
            gameRoom.save()

            return { gameId: gameRoom?._id, members: gameRoom?.members, roomId: gameRoom?.roomId }
        }

        let newRoom = await Game.create({
            members: [userId],
            author: userId,
            visible: 'Public',
        })

        user.gameId = newRoom?._id
        user.gameOption = 'random'
        user.save()

        return { gameId: newRoom?._id, members: newRoom?.members }
    } catch (error) {
        console.error(error)
        return error
    }
}

const leaveRoom = async (userId) => {
    try {
        let user = await User.findById(userId)

        if (!user) {
            return { message: 'User not found!' }
        }

        await Game.findByIdAndUpdate(user.gameId, { $pull: { members: user._id } })

        let isEmptyRoom = await Game.findById(user.gameId)

        if (isEmptyRoom.members.length == 0) {
            await Game.findByIdAndDelete(user.gameId)
        }

        user.gameOption = ''
        user.gameId = undefined
        user.save()

        return {}
    } catch (error) {
        console.log(error);
        return error
    }
}


// GAME LOGIC
const game = async () => {
    try {

        /*
            Board indexes
            [0] [1] [2]
            [3] [4] [5]
            [6] [7] [8]
        */

        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];


    } catch (error) {
        return error
        console.log(error);
    }
}

module.exports = {
    createRoom,
    joinRoom,
    randomRoom,
    leaveRoom
}

