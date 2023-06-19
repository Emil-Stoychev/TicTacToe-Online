const mongoose = require('mongoose')

const gameStatisticSchema = new mongoose.Schema({
    playedUsers: Number,
    fiveStars: Number,
    happyUsers: Number,
    peoples: Array
},
    { timestamps: true },
)

const GameStatistic = mongoose.model('GameStatistic', gameStatisticSchema)

exports.GameStatistic = GameStatistic