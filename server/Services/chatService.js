const { User } = require("../Models/User.js")
const { Chat } = require("../Models/Chat.js")

const { v4 } = require('uuid')

const createChat = async (senderId, receiverId) => {
    try {
        let currChat = await findChat(senderId, receiverId)


        if (currChat) {
            await Chat.findByIdAndUpdate(currChat._id, { $set: { updatedAt: new Date() } })

            return { message: 'This chat already exist!' }
        }

        const newChat = new Chat({
            members: [senderId, receiverId]
        })

        await Chat.findByIdAndUpdate(newChat._id, { $set: { updatedAt: new Date() } })

        return await newChat.save()
    } catch (error) {
        console.error(error)
        return error
    }
}

const userChats = async (userId) => {
    try {
        let chat = await Chat.find({ members: { $in: [userId] } })
            .populate('members', ['image', 'username', 'location'])
            .sort('-updatedAt')

        return chat
    } catch (error) {
        console.error(error)
        return error
    }
}

const findChat = async (firstId, secondId) => {
    try {
        const chat = await Chat.findOne({
            members: { $all: [firstId, secondId] }
        })

        return chat
    } catch (error) {
        console.error(error)
        return error
    }
}

const addMessage = async (message, senderId) => {
    try {
        let chat = await Chat.find()

        let user = await User.findById(senderId)

        if (!user._id) {
            return { message: 'User does not exist' }
        }

        if (chat[0]?.container == undefined) {
            chat = await Chat.create({
                container: []
            })
        }

        let msg = {
            senderName: user.username,
            _id: v4(),
            chatId: chat[0]._id,
            senderId,
            text: message,
        }

        chat[0]?.container.push(msg)

        await chat[0].save()

        return msg
    } catch (error) {
        console.error(error)
        return error
    }
}

const getMessages = async (skipNumber) => {
    try {
        let chat = await Chat.find()
        let num = 0

        if (chat[0]?.container == undefined) {
            chat = await Chat.create({
                container: []
            })
            num++
        }

        // .sort({ createdAt: -1 })
        // .skip(skipNumber)
        // .limit(10)

        if (num == 0) {
            return chat[0]?.container.slice(chat[0]?.container.length - 7)
        } else {
            return chat[0]?.container
        }
    } catch (error) {
        console.error(error)
        return error
    }
}

module.exports = {
    createChat,
    userChats,
    findChat,
    addMessage,
    getMessages,
}