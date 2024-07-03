const express = require('express');
var router = express.Router({mergeParams: true});
var fs = require('fs');
var FP = require('filepath')

const userModel = require('../../models/user');
const reviewModel = require('../../models/review');
const gameModel = require('../../models/game');

//controllers
const editAccount = async (req, res) => {
    const {username, name, dateOfBirth} = req.body;
    const _id = req.params.id;

    try {
        const currUser = await userModel.findById({_id});
        
        const existingUser = await userModel.findOne({username});
        if (existingUser && existingUser._id != _id) {
            return res.status(400).json({error: 'USERNAME_EXISTS'})
        }
        
        let profileImagePath = currUser.profileImagePath;
        if(username != currUser.username && profileImagePath && profileImagePath != "") {
            const fileExt = currUser.profileImagePath.split('.')[1];
            const oldFileName = currUser.profileImagePath.slice(29, currUser.profileImagePath.length);
            const fpFolder  = FP.newPath() + '/' + 'src' + '/' + 'images' +'/';
            const oldFilePath = fpFolder + oldFileName;
            const newFilePath = fpFolder + username + '.' + fileExt;

            fs.rename(oldFilePath, newFilePath, (error) => {console.log(error)});
            profileImagePath = `http://localhost:${process.env.PORT}/images/${username}.${fileExt}`;
            console.log("first time: " + profileImagePath)
        }

        console.log("second time: " + profileImagePath);
        const updatedUser = await userModel.findByIdAndUpdate(_id, {username, name, dateOfBirth, profileImagePath});
        console.log(updatedUser)
        return res.status(200).send(updatedUser);
    } catch(error) {
        console.log(error);
        return res.status(400).json({error});
    }
}

const deleteAccount = async (req, res) => {
    const _id = req.params.id;

    try {
        const userReviews = await reviewModel.find({userID: _id});
        const allGames = await gameModel.find();
        let gamesToUpdate = []
        let newOverallRating;
        let newNumOfReviews;
        userReviews.forEach(review => {
            const game = allGames.filter(g => g.name === review.gameName)[0];
            newNumOfReviews = game.numOfReviews - 1;
            if (newNumOfReviews === 0) {
                newOverallRating = 0;
            } else {        
                newOverallRating = ((game.rating * game.numOfReviews) - review.rating )/(newNumOfReviews);
            }
            gamesToUpdate.push({_id: game._id, newOverallRating, newNumOfReviews});
        })
        gamesToUpdate.forEach(async g => {
            await gameModel.findByIdAndUpdate({_id: g._id}, {rating: g.newOverallRating, numOfReviews: g.newNumOfReviews});
        })
        userReviewsIDs = userReviews.map(r => {return r._id});
        await reviewModel.deleteMany({_id: {$in: userReviewsIDs}});
        await userModel.findByIdAndDelete({_id});
        return res.status(200).json();
    } catch(error) {    
        return res.status(400).json({error});
    }
}


const getUsersByReviewedGame = async (req, res) => {
    const gameName = req.params.gameName;
    try {
        const gameReviews = await reviewModel.find({gameName});
        const allUsers = await userModel.find();
        let requiredUsers = [];
        gameReviews.forEach(review => {
            let user = allUsers.filter(user => user._id === review.userID)[0];
            requiredUsers.push(user);
        })
        res.status(200).send({users: requiredUsers});
    } catch(error) {
        res.status(400).json({error: error});
    }
}

//routes
router.get('/getUsersByReviewedGame/:gameName', getUsersByReviewedGame);
router.put('/editAccount/:id', editAccount);
router.delete('/deleteAccount/:id', deleteAccount);

module.exports = router;