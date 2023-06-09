
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
        if (x.room._id?.toString() == gameId?.toString()) {
            if (x.room.members.includes(userId)) {
                if (x.room.members.length > 1) {
                    if (x.room.author == userId) {
                        let anotherPerson = x.room.members.find(x => x.toString() != userId)

                        x.room.author = anotherPerson.toString()
                    }
                    x.room.members = x.room.members.filter(y => y.toString() != userId)

                    return x
                }
            }
        } else {
            return x
        }
    })
}

const getRandomGame = (room, userId) => {
    activeGames = activeGames.map(x => {
        if (x.room._id == room?._id) {
            x.room = room
        }

        return x
    })

    return activeGames.find((game) => {
        if (game.room._id == room?._id) {
            return room
        }
        if (game.room.author == userId) {
            return game
        } else if (game.room.visible == 'Public' && game.room.members.length == 1) {
            if (game.room.members.includes(userId)) {
                return game
            } else {
                game.room.members.push(userId)

                return game
            }
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
        socket.emit('get-allGames', activeGames)

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

    socket.on("random-game", ({ room, userId }) => {
        let game = getRandomGame(room, userId)

        if (game) {
            io.emit('get-game', game)

            console.log('return random game', socket.id);

            return
        }

        addNewGame(room, socket.id)
        game = getGame(room._id)

        game.room.members.forEach(x => {

        })
        io.emit('get-game', game)
        // socket.emit('get-allGames', activeGames)
        activeUsers.forEach((x) => {
            io.to(x.socketId).emit('get-allGames', activeGames)
        })

        console.log('random game created', socket.id);

        // if (game) {
        //     if (game.room.members.includes(userId)) {

        //         activeUsers.forEach(x => {
        //             if (game.room.members.includes(x.user._id)) {
        //                 io.to(x.socketId).emit('get-game', game)
        //             }
        //         })

        //         console.log('u already exist in this room', socket.id);

        //         return
        //     }

        //     if (game.room.members.length < 2) {
        //         joinNewUserToGame(room, userId)

        //         console.log(game);

        //         activeUsers.forEach(x => {
        //             if (game.room.members.includes(x.user._id)) {
        //                 io.to(x.socketId).emit('get-game', game)
        //             }
        //         })

        //         console.log('join successfully', socket.id);

        //         return
        //     }

        //     return { message: 'Game does not exist!' }
        // }
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

    socket.on('send-message', (data) => {
        if (data != null) {
            // socket.broadcast.emit() THIS WILL SEND MESSAGE FOR ALL USERS WITHOUT ME
            socket.broadcast.emit('receive-message', data)
        }
    })

    socket.on('update-board', (data) => {
        if (data != null) {
            const { receiverId } = data
            const user = activeUsers.find(x => x.user._id == receiverId)

            if (user) {
                io.to(user.socketId).emit('game-update', data)
            }
        }
    })

    socket.on('leave-game', (data) => {
        if (data != null) {
            const { receiverId } = data
            const user = activeUsers.find(x => x.user._id == receiverId)
            
            if (user) {
                io.to(user.socketId).emit('game-update-afterUserLeaved', data)
            }
        }
    })

    socket.on('disconnect', () => {
        let currUser = activeUsers.find(x => x.socketId == socket.id)
        activeGames = activeGames.filter(x => {
            if (x.room.members.includes(currUser?.user?._id)) {
                if (x.room.members.length == 2) {
                    x.room.members = x.room.members.filter(x => x.toString() != currUser.user._id.toString())

                    let anotherPlayer = activeUsers.find(y => y.user._id == x.room.members[0].toString())
                    io.to(anotherPlayer?.socketId).emit('get-game', x)

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