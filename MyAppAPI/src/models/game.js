const mongoose = require('mongoose')
const { release } = require('process')
const Schema = mongoose.Schema

const gameSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    mainColor: {
        type: String,
        required: true
    }, 
    imageIconPath: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    coverPath: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    rating: {
        type: Number
    },
    numOfReviews: {
        type: Number
    }
})

const game = mongoose.model('game', gameSchema)
module.exports = game;