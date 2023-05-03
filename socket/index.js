
const io = require('socket.io')(3000, {
    cors: {
        origin: '*',
    }
})

let activeUsers = []

const addNewUser = (_id, socketId) => {
    !activeUsers.some((user) => user._id == _id) && activeUsers.push({ _id, socketId })
}

const getUser = (_id) => {
    return activeUsers.find((user) => user._id == _id)
}

io.on('connection', (socket) => {
    socket.on("newUser", (_id) => {
        addNewUser(_id, socket.id)
        io.emit('get-users', activeUsers)

        console.log('connected', socket.id);
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
            if (data?.type == 'delete') {
                const user = activeUsers.find(x => x._id == data.receiverId)

                if (user) {
                    io.to(user.socketId).emit('receive-message', { msgId: data.msgId, type: data.type, chatId: data.chatId })
                }
            } else {
                const { receiverId } = data
                const user = activeUsers.find(x => x._id == receiverId)

                if (user) {
                    io.to(user.socketId).emit('receive-message', data.res)
                }
            }
        }
    })

    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter(x => x.socketId != socket.id)
        io.emit('get-users', activeUsers)

        console.log('Disconnected: ', activeUsers);
    })
})