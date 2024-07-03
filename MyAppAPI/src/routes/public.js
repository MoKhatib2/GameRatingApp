const express = require('express');
var router = express.Router({mergeParams: true});

const authRouter = require('./public/auth');

router.use('/auth', authRouter)

module.exports = router;