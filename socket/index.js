
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
    return !activeGames.some((x) => x.room._id == room._id) && activeGames.push({ room, socketId })
}

const joinNewUserToGame = (room, userId) => {
    activeGames = activeGames.map((x) => {
        if (x.room._id == room._id) {
            x.room.members.push(userId)
        }

        return x
    })
}

const removeGame = (gameId, socketId, userId) => {
    activeGames = activeGames.filter(x => {
        if (x.room._id.toString() == gameId.toString()) {
            if (x.room.members.includes(userId)) {
                if (x.room.members.length > 1) {
                    x.room.members = x.room.members.filter(y => y.toString() != userId)

                    return x
                }
            }
        } else {
            return x
        }
    })
}

const getGame = (gameId) => {
    return activeGames.find((game) => game.room._id == gameId)
}

io.on('connection', (socket) => {
    socket.on("newUser", (user) => {
        addNewUser(user, socket.id)
        io.emit('get-users', activeUsers)
        io.emit('get-allGames', activeGames)

        console.log('connected', socket.id);
    })

    socket.on("new-game", (room) => {
        let game = getGame(room._id || room.gameId)

        if (game) {
            io.emit('get-game', game)

            console.log('return game', socket.id);

            return
        }

        addNewGame(room, socket.id)
        game = getGame(room._id)

        io.emit('get-game', game)

        console.log('game created', socket.id);
    })

    socket.on("join-game", ({ room, userId }) => {
        let game = getGame(room._id || room.gameId)

        if (game) {
            if (game.room.members.includes(userId)) {

                activeUsers.forEach(x => {
                    if (game.room.members.includes(x.user._id)) {
                        io.to(x.socketId).emit('get-game', game)
                    }
                })

                console.log('u already exist in this room', socket.id);

                return
            }

            if (game.room.members.length < 2) {
                joinNewUserToGame(room, userId)

                console.log(game);

                activeUsers.forEach(x => {
                    if (game.room.members.includes(x.user._id)) {
                        io.to(x.socketId).emit('get-game', game)
                    }
                })

                console.log('join successfully', socket.id);

                return
            }

            return { message: 'Game does not exist!' }
        }
    })

    socket.on("remove-game", ({ gameId, userId }) => {
        removeGame(gameId, socket.id, userId)
        let game = getGame(gameId)

        console.log(game);

        if (game != null || game != undefined) {
            activeUsers.forEach((x) => {
                if (game.room.members.includes(x.user._id)) {
                    io.to(x.socketId).emit('get-game', game)
                }
            })

            console.log(`User left the game with id: ${gameId}!`);
        } else {
            activeUsers.forEach((x) => {
                io.to(x.socketId).emit('get-allGames', activeGames)
            })

            console.log(`Game with id: ${gameId} was removed!`);
        }

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
        let currUser = activeUsers.find(x => x.socketId == socket.id)
        activeGames = activeGames.filter(x => {
            if (x.room.members.includes(currUser?.user?._id)) {
                if (x.room.members.length > 1) {
                    console.log(x.room.members);
                    x.room.members = x.room.members.filter(x => x != currUser.user._id)

                    console.log(x.room.members);
                    let anotherPlayer = activeUsers.find(y => y.user._id == x.room.members[0])
                    console.log('anotherPlayer');
                    console.log(anotherPlayer);
                    io.to(anotherPlayer.socketId).emit('get-game', x)

                    return x
                }
            } else {
                return x
            }
        })
        activeUsers = activeUsers.filter(x => x.socketId != socket.id)
        io.emit('get-users', activeUsers)

        console.log('Disconnected: ', socket.id);
    })
})


instrument(io, { auth: false })