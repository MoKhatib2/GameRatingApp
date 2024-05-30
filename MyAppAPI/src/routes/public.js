const express = require('express');
var router = express.Router({mergeParams: true});
const userModel = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    let user;
    try{
        user = await userModel.findOne({ email: email });
        if(!user){
            return res.status(400).json({ errors: 'INVALID_CREDENTIALS' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({errors: 'INVALID_CREDENTIALS'});
        }        
    }catch(error) {
        return res.status(400).json({ errors: [error.message] });
    }

    let token;
    let expiresIn = 1 * 60 * 60; 
    try{
        token = jwt.sign(
            {
                userId: user.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: expiresIn }
        );    
    }catch(error) {
        console.log(error);
        return res.status(400).json({ errors: 'UNKONWN_ERROR' }); 
    }

    res.status(200).json({user, token, expiresIn});    
})

router.post('/signup', async (req, res) => {
    const {username, name, email, dateOfBirth} = req.body;
    let user;
    // Hash password using bcrypt and 10 rounds
	const password = bcrypt.hashSync(req.body.password, 10);

    try{
        let users = await userModel.find({ username: username });
        if(users && users.length !=0){
            return res.status(400).json({error: 'USERNAME_EXISTS'});
        }

        users = await userModel.find({ email: email });
        if(users && users.length !=0){
            return res.status(400).json({error: 'EMAIL_EXISTS'});; 
        }

        user = await userModel.create({username, name, email, dateOfBirth, password});
        await user.save();
    }catch(error) {
        return res.status(400).json({ errors: [error.message] });
    }

    let token;
    let expiresIn = 1 * 60 * 60; 
    try{
        token = jwt.sign(
            {
                userId: user.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: expiresIn }
        )   
    }catch(error) {
        console.log(error);
        return res.status(400).json({ errors: 'UNKONWN_ERROR' });
    }

    res.status(200).json({user, token, expiresIn});  
})

module.exports = router;