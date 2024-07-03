const express = require('express');
var router = express.Router({mergeParams: true});

const userModel = require('../../models/user.js');
const reviewModel = require('../../models/review.js');
const gameModel = require('../../models/game.js');

router.get('/getReviews', async (req, res) => {
    try {
        const reviews = await reviewModel.find();
        res.status(200).send(reviews);
    } catch(error){
        res.status(400).json({error: error});
    }
})

router.get('/getReviews/:gameName', async (req, res) => {
    const gameName = req.params.gameName;
    try {
        const reviews = await reviewModel.find({gameName});
        res.status(200).send(reviews);
    } catch(error){
        res.status(400).json({error: error});
    }
})

router.get('/getReviewsWithUsers/:gameName', async (req, res) => {
    const gameName = req.params.gameName;
    try {
        const gameReviews = await reviewModel.find({gameName});
        const allUsers = await userModel.find();
        let response = [];
        gameReviews.forEach(review => {
            let user = allUsers.filter(user => user._id.equals(review.userID))[0];
            response.push({review, user});
        });
        console.log(response);    
        return res.status(200).send(response);
    } catch(error){
        res.status(400).json({error: error});
    }
})

router.post('/addReview', async (req, res) => {
    const {userID, gameName, thoughtsOnGame, enjoyedGame, rating} = req.body.review;

    console.log(req.body);
    try{
        const existingUser = await userModel.findById({_id: userID});
        if(!existingUser){
            return res.status(400).json({error: 'USER_DOESNT_EXIST'});
        }

        const existingReview = await reviewModel.findOne({userID, gameName});
        if(existingReview){
            return res.status(400).json({error: 'REVIEW_EXISTS'});
        }
        const review = await reviewModel.create({userID, gameName, thoughtsOnGame, enjoyedGame, rating});
        await review.save();
        const game = await gameModel.findOne({name: gameName});
        let newOverallRating, newNumOfReviews;
        if(!!game.rating){
            newNumOfReviews = game.numOfReviews + 1;
            newOverallRating = ((game.numOfReviews * game.rating) + rating )/(newNumOfReviews)
        } else {
            newNumOfReviews = 1;
            newOverallRating = rating;
        }
        await gameModel.updateOne({name: gameName}, {rating: newOverallRating, numOfReviews: newNumOfReviews});
        res.status(200).json({review: review, newOverallRating: newOverallRating});
    }catch(error){
        res.status(400).json({error: error});
    }
})

router.put('/updateReview/:id', async (req, res) => {
    const reviewId = req.params.id;
    const {userID, gameName, thoughtsOnGame, enjoyedGame, rating} = req.body.review;

    if(!reviewId){
        return res.status(400).json({error: 'ID_NOT_SENT'})
    }
    
    try{
        const existingUser = await userModel.findById({_id: userID});
        if(!existingUser){
            return res.status(400).json({error: 'USER_DOESNT_EXIST'});
        }

        const existingReview = await reviewModel.findOne({_id: reviewId});
        if(!existingReview){
            return res.status(400).json({error: 'REVIEW_DOESNT_EXIST'});
        }

        const game = await gameModel.findOne({name: gameName});
        const newOverallRating = ((game.rating * game.numOfReviews) -  existingReview.rating + rating)/game.numOfReviews;
        const review = await reviewModel.findByIdAndUpdate(reviewId, {userID, gameName, thoughtsOnGame, enjoyedGame, rating});
        await gameModel.updateOne({name: gameName}, {rating: newOverallRating});
        res.status(200).send({review: review, newOverallRating: newOverallRating});
    }catch(error){
        res.status(400).json({error: error});
    }
})

module.exports = router;