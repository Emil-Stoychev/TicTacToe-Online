const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    container: [],
},
    { timestamps: true },
)

const Chat = mongoose.model('Chat', chatSchema)

exports.Chat = Chat