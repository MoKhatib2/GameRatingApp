const express = require('express');
var router = express.Router({mergeParams: true});
const userModel = require('../models/user.js');
const reviewModel = require('../models/review.js')

router.get('/reviews', async (req, res) => {
    try {
        const reviews = await reviewModel.find();
        res.status(200).send(reviews);
    } catch(error){
        res.status(400).json({error: error});
    }
})

router.get('/reviews/:gameName', async (req, res) => {
    const gameName = req.params.gameName;
    try {
        const reviews = await reviewModel.find({gameName});
        res.status(200).send(reviews);
    } catch(error){
        res.status(400).json({error: error});
    }
})

router.post('/addReview', async (req, res) => {
    const {username, gameName, thoughtsOnGame, enjoyedGame, rating} = req.body.review;

    console.log(req.body);
    try{
        console.log(username)
        const existingUser = await userModel.findOne({username});
        if(!existingUser){
            return res.status(400).json({error: 'USER_DOESNT_EXIST'});
        }

        const existingReview = await reviewModel.findOne({username, gameName});
        if(existingReview){
            return res.status(400).json({error: 'REVIEW_EXISTS'});
        }
        const review = await reviewModel.create({username, gameName, thoughtsOnGame, enjoyedGame, rating});
        await review.save();
        res.status(200).send(review);
    }catch(error){
        res.status(400).json({error: error});
    }
})

router.put('/updateReview/:id', async (req, res) => {
    const reviewId = req.params.id;
    const {username, gameName, thoughtsOnGame, enjoyedGame, rating} = req.body.review;

    if(!reviewId){
        return res.status(400).json({error: 'ID_NOT_SENT'})
    }
    console.log(reviewId)
    try{
        const existingUser = await userModel.findOne({username});
        if(!existingUser){
            return res.status(400).json({error: 'USER_DOESNT_EXIST'});
        }

        const existingReview = await reviewModel.findOne({_id: reviewId});
        if(!existingReview){
            return res.status(400).json({error: 'REVIEW_DOESNT_EXIST'});
        }
        const review = await reviewModel.findByIdAndUpdate(reviewId, {username, gameName, thoughtsOnGame, enjoyedGame, rating});
        res.status(200).send(review);
    }catch(error){
        res.status(400).json({error: 'UNKOWN_ERROR'});
    }
})

module.exports = router;