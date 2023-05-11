const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    visible: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Public'
    },
    roomId: String,
    board: {
        type: Array,
        default: ['', '', '', '', '', '', '', '', '']
    },
    playerX: {
        type: Number,
        default: 0
    },
    playerO: {
        type: Number,
        default: 0
    },
    playerTurn: Number,
    currentPlayer: String,
},
    { timestamps: true },
)

const Game = mongoose.model('Game', gameSchema)

exports.Game = Game