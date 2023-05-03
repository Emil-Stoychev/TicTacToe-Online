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

const addMessage = async (chatId, senderId, text, image) => {
    try {
        let imageData

        if (image) {
            imageData = await createImage(senderId, image)
        }

        const message = new MessageModel({
            chatId,
            senderId,
            text,
            image: imageData?._id || undefined
        })

        let newMessage = await message.save()

        let currChat = await Chat.findByIdAndUpdate(chatId, { $set: { updatedAt: new Date() } })

        // await User.findByIdAndUpdate(currChat.members[0], { $pull: { chat: chatId } })
        // await User.findByIdAndUpdate(currChat.members[1], { $pull: { chat: chatId } })

        // await User.findByIdAndUpdate(currChat.members[0], { $push: { chat: chatId } })
        // await User.findByIdAndUpdate(currChat.members[1], { $push: { chat: chatId } })

        return await MessageModel.findById(newMessage._id)
            .populate('image', ['thumbnail'])
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