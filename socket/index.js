
const { instrument } = require('@socket.io/admin-ui')

const io = require('socket.io')(3060, {
    cors: {
        origin: "*"
    }
})

let activeUsers = []
let activeGames = []

const addNewUser = (user, socketId) => {
    !activeUsers.some((x) => x.user._id == user._id) && activeUsers.push({ user, socketId })
}

const getUser = (_id) => {
    return activeUsers.find((user) => user._id == _id)
}

const addNewGame = (room, socketId) => {
    return !activeGames.some((x) => x.room.gameId == room.gameId) && activeGames.push({ room, socketId })
}

const removeGame = (gameId, socketId) => {
    let currUser = activeUsers.find(x => x.socketId == socketId)

    activeGames = activeGames.filter(x => {
        if (x.room.gameId == gameId) {
            if (x.room.members.length > 1) {
                if (x.room.members.includes(currUser.user._id)) {
                    x.room.members = x.room.members.filter(currUser.user._id)

                    return x
                }
            }
        } else {
            return x
        }
    })
}

const getGame = (gameId) => {
    return activeGames.find((game) => game.room.gameId == gameId)
}

io.on('connection', (socket) => {
    socket.on("newUser", (user) => {
        addNewUser(user, socket.id)
        io.emit('get-users', activeUsers)
        io.emit('get-allGames', activeGames)

        console.log('connected', socket.id);
    })

    socket.on("new-game", (room) => {
        console.log('STARTING!!!');
        console.log(room);

        let game = getGame(room.gameId)

        if (game) {
            io.emit('get-game', game)

            return
        }

        addNewGame(room, socket.id)
        let createdGame = getGame(room.gameId)

        io.emit('get-game', createdGame)

        // if (game) {
        //     game.members.forEach(x => {
        //         if (x.socketId == socketId) {
        //             io.to(x.socketId).emit('get-game', room)
        //         }
        //     })
        // }

        console.log('game created', socket.id);
    })

    socket.on("remove-game", ({ gameId }) => {
        removeGame(gameId, socket.id)

        activeUsers.forEach((x) => {
            io.to(x.socketId).emit('get-allGames', activeGames)
        })

        console.log(`Game with id: ${gameId} was removed!`);
    })

    socket.on("sendNotification", ({ senderId, receiverId }) => {
        const receiver = getUser(receiverId)

        if (receiver != undefined) {
            io.to(receiver.socketId).emit("getNotification", {
                senderId,
            })
        }
    })

    socket.on('send-message', (data) => {
        if (data != null) {
            // socket.broadcast.emit() THIS WILL SEND MESSAGE FOR ALL USERS WITHOUT ME
            socket.broadcast.emit('receive-message', data)
        }
    })

    socket.on('update-board', (data) => {
        if (data != null) {
            const { receiverId } = data
            const user = activeUsers.find(x => x._id == receiverId)

            if (user) {
                io.to(user.socketId).emit('updated-board', data.res)
            }
        }
    })

    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter(x => x.socketId != socket.id)
        io.emit('get-users', activeUsers)

        console.log('Disconnected: ', socket.id);
    })
})


instrument(io, { auth: false })