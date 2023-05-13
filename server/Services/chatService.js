const { User } = require("../Models/User.js")
const { Chat } = require("../Models/Chat.js")

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

        console.log(chat);

        if (!chat[0]?.container) {
            chat = await Chat.create({
                container: []
            })
        }

        await chat[0].container.push({
            chatId: chat[0]._id,
            senderId,
            text: message,
        })

        await chat[0].save()

        return chat[0]
    } catch (error) {
        console.error(error)
        return error
    }
}

const getMessages = async (chatId, skipNumber) => {
    try {
        let result = await MessageModel.find({ chatId })
            .populate('image', ['thumbnail'])
            .sort({ createdAt: -1 })
            .skip(skipNumber)
            .limit(10)

        return result.reverse()
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