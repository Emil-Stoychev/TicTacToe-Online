const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
    },
    uuid: {
        type: String,
        required: [true, 'Uuid is required'],
    },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
    gameOption: String,
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
},
    { timestamps: true },
)

const User = mongoose.model('User', userSchema)

exports.User = User