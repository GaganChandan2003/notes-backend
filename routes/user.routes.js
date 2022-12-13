const express = require('express');
const UserModel = require("../models/User.modal");
const bcrypt = require('bcrypt');
const userController = express.Router();
require("dotenv").config();
let jwt = require('jsonwebtoken');



userController.post("/register", async(req, res) => {
    const {username, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if(!user)
    {
        bcrypt.hash(password, 6, async (err, hash) => {
            if (err) {
                return res.send("Please try again");
            }
            const user = new UserModel({
                username,
                email,
                password: hash
            })
            try{
                await user.save();
                res.send({messege:"Signedup sucessfully"}).status(200);
            }
            catch{
                res.status(404)
            }
            
        })
    }
    else
    {
        res.status(404).send({messege:"User already exists"})
    }
    
    
    
})



userController.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.send("Invalid Credentials")
    }
    const hash = user.password;
    const userId = user._id
    bcrypt.compare(password, hash, function (err, result) {
        if (result) {
            var token = jwt.sign({ email, userId }, process.env.SECRET);
            res.send({ messege: "Login Sucessfull", token: token,username:user.username }).status(200)
        }
        else {
            return res.send("Invalid Credentials").status(403);
        }
    });
})

module.exports = userController;