
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
    !activeGames.some((x) => x.socketId == socketId) && activeGames.push({ room, socketId })
}

const removeGame = (roomId, socketId) => {
    activeGames = activeGames.filter((x) => x.socketId != socketId)
}

const getGame = (socketId) => {
    return activeGames.find((game) => game.socketId == socketId)
}

io.on('connection', (socket) => {
    socket.on("newUser", (user) => {
        addNewUser(user, socket.id)
        io.emit('get-users', activeUsers)
        io.emit('get-allGames', activeGames)

        console.log(activeGames);

        console.log('connected', socket.id);
    })

    socket.on("new-game", ({ room, socketId }) => {

        console.log(room);
        console.log(socketId);

        let game = getGame(socketId)

        if (game) {
            io.emit('get-game', game)

            return
        }
        addNewGame(room, socketId)
        let createdGame = getGame(socketId)

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

    socket.on("remove-game", (gameOption) => {
        console.log('REMOVING GAMES...');
        console.log(gameOption);
        const removedGame = removeGame(gameOption?.gameId, socket.id)

        activeUsers.forEach((x) => {
            io.to(x.socketId).emit('get-allGames', activeGames)
        })

        console.log(`Game with id: ${gameOption?.gameId} was removed!`);
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