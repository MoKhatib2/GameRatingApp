const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    gameName: {
        type: String,
        required: true
    },
    thoughtsOnGame: {
        type: String
    },
    enjoyedGame: {
        type: Boolean,
        required: true
    },
    rating: {
        type: Number,
        requied: true
    }
});

const review = mongoose.model('review', reviewSchema);
module.exports = review;