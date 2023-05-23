const { User } = require('../Models/User')
const { Game } = require('../Models/Game')
const { Chat } = require('../Models/Chat')

const shortid = require('shortid')

const enterRoom = async (data, userId) => {
    try {
        let user = await User.findById(userId)

        if (!user) {
            return { message: 'User not found!' }
        }

        if (data?.option == undefined) {
            data.option = user.gameOption
        }

        if (data?.option == 'create') {
            let gameRoom = await Game.findById(user?.gameId)

            if (gameRoom) {
                return { newRoom: { gameId: gameRoom?._id, members: gameRoom?.members, roomId: gameRoom?.roomId }, userGameOption: user.gameOption }
            }

            let newRoom = await Game.create({
                members: [userId],
                author: userId,
                visible: 'Private',
                roomId: shortid.generate(),
                playerX: 0,
                playerO: 0,
                playerTurn: Math.floor(Math.random() * 2) == 0 ? 0 : 1
            })

            user.gameId = newRoom?._id
            user.gameOption = 'create'
            user.save()

            return { newRoom, userGameOption: user.gameOption }
        } else if (data?.option == 'join') {
            let gameRoom

            if (data.roomId) {
                gameRoom = await Game.findOne({ roomId: data?.roomId })
            } else {
                gameRoom = await Game.findById(user?.gameId)
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
            await gameRoom.save()

            user.gameId = gameRoom?._id
            user.gameOption = 'join'
            await user.save()

            return gameRoom
        } else if (data?.option == 'random') {
            if (user.gameId != undefined && user.gameId != '') {
                return await Game.findById(user.gameId)
            }

            let gameRoom = await Game.findOne({ visible: 'Public', members: { $size: 1 } })

            if (gameRoom) {
                user.gameId = gameRoom?._id
                user.gameOption = 'random'
                user.save()

                gameRoom.members.push(user?._id)
                await gameRoom.save()

                return gameRoom
            }

            let newRoom = await Game.create({
                members: [userId],
                author: userId,
                visible: 'Public',
                playerX: 0,
                playerO: 0,
                playerTurn: Math.floor(Math.random() * 2) == 0 ? 0 : 1
            })

            user.gameId = newRoom?._id
            user.gameOption = 'random'
            user.save()

            return newRoom
        }
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
        await user.save()

        return user
    } catch (error) {
        console.log(error);
        return error
    }
}



// GAME LOGIC

const getGame = async (gameId) => {
    try {
        let game = await Game.findById(gameId).populate('members')

        if (!game) {
            return { message: 'Game not found!' }
        }

        return game
    } catch (error) {
        console.log(error);
        return error
    }
}

const setInBoard = async (data) => {
    try {
        let { tile, index, currPlayerName, gameId } = data

        let game = await Game.findById(gameId).populate('members')

        if (!game) {
            return { message: 'Game not found!' }
        }

        game.board = game.board.map((x, i) => {
            if (i == index) {
                x = tile
            }

            return x
        })

        let gameEnd = await resultValidate(gameId)

        if (gameEnd) {
            game.board = ['', '', '', '', '', '', '', '', '']

            if (tile == 'X') {
                game.playerX++
            } else {
                game.playerO++
            }
        }

        await game.save()

        return await Game.findById(gameId).populate('members')
    } catch (error) {
        console.log(error);
        return error
    }
}

async function resultValidate(gameId) {
    let game = await Game.findById(gameId)

    let roundWin = false

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

    let e
    let s
    let r

    for (let i = 0; i <= 7; i++) {
        let winCondition = winningConditions[i]
        let a = game.board[winCondition[0]]
        let b = game.board[winCondition[1]]
        let c = game.board[winCondition[2]]

        if (a == '' || b == '' || c == '') {
            continue
        }

        if (a == b && b == c) {
            roundWin = true
            e = winCondition[0]
            s = winCondition[1]
            r = winCondition[2]
            break
        }
    }

    if (roundWin) {
        return true
    } else {
        return false
    }
}

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
    enterRoom,
    leaveRoom,
    getGame,
    setInBoard
}

