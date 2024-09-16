const express = require('express');
var router = express.Router({mergeParams: true});

const gamesRouter = require('./private/games');
const reviewsRouter = require('./private/reviews');
const usersRouter = require('./private/users');


router.use('/games', gamesRouter);
router.use('/reviews', reviewsRouter);
router.use('/users', usersRouter);

module.exports = router;