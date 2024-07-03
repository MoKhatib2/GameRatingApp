const express = require('express');
var router = express.Router({mergeParams: true});
const userModel = require('../../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const storage = require('../../helpers/storage');

// controllers

const login = async (req, res) => {
    const {email, password} = req.body;
    let user;
    try{
        user = await userModel.findOne({ email: email });
        if(!user){
            return res.status(400).json({ error: 'INVALID_CREDENTIALS' });
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({error: 'INVALID_CREDENTIALS'});
        }        
    }catch(error) {
        return res.status(400).json({ error: [error.message] });
    }

    let token;
    let expiresIn = 1* 60 * 60; // hr * min * sec 
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
        return res.status(400).json({ error: 'UNKONWN_ERROR' }); 
    }

    res.status(200).json({user, token, expiresIn});    
}

const signup = async (req, res) => {
    const {username, name, email, dateOfBirth} = req.body;
    let profileImagePath;
    if(req.file && req.file.filename){
        profileImagePath = `http://localhost:${process.env.PORT}/images/` + req.file.filename;
    } else {
        profileImagePath = "";
    }
    // Hash password using bcrypt and 10 rounds
	const password = bcrypt.hashSync(req.body.password, 10);

    const user = new userModel({
        username, 
        name, 
        email, 
        dateOfBirth,
        password,
        profileImagePath
    });

    try{
        let users = await userModel.find({ username: username });
        if(users && users.length !=0){
            return res.status(400).json({error: 'USERNAME_EXISTS'});
        }

        users = await userModel.find({ email: email });
        if(users && users.length !=0){
            return res.status(400).json({error: 'EMAIL_EXISTS'});; 
        }

        const createdUser = await user.save();

        let token;
        let expiresIn = 1 * 60 * 60; 

        token = jwt.sign(
            {
                userId: user.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: expiresIn }
        ) 
        res.status(200).json({user: createdUser, token, expiresIn});    
    }catch(error) {
        console.log(error);
        return res.status(400).json({ error: 'UNKONWN_ERROR' });
    } 
}

// routes

router.post('/login', login);
router.post('/signup', storage, signup);

module.exports = router;