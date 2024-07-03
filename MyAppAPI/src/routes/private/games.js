const express = require('express');
var router = express.Router({mergeParams: true});

const gameModel = require('../../models/game');

router.get('/getGames', async (req, res) => {
    try {
        const games = await gameModel.find();
        res.status(200).send(games);
    } catch(error) {
        res.status(400).json({error: error})
    }
})

module.exports = router;