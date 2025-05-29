const express = require('express');
const {validateSignupData} = require('../utils/validation');
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post("/signup", async (req, res) => {
    console.log(req.body); // results in undefined because data is sent as JSON, middleware(express.json) is required to convert JSON to JS object
    try {
        const {firstName, lastName, emailId, password, age, gender, photoURL, aboutMe, skills} = req.body;
        // 1. Validate data 
        validateSignupData(req);
        // 2. encrypt password
        
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        const user = new UserModel({
            firstName, lastName, emailId, password: passwordHash, age, gender, photoURL, aboutMe, skills
        });
        await user.save();
        res.send('Signup success!');
    }
    catch (err) {
        console.log(err);
        return res.status(400).send('Error saving user ' + err);
    }
});

router.post("/login", async (req, res) => {
    const {emailId, password} = req.body;
    try {
        // 1. Validate data
        if (!emailId) {
            return res.status(400).send('Invalid credentials');
        } else if (!password) {
            return res.status(400).send('Invalid credentials');
        }
        // 2. Check if user exists
        const user = await UserModel.findOne({emailId});

        if (!user || user?.length === 0) {
            return res.status(404).send('User not found');
        } else {
            // 3. Check if password is correct
            const isPasswordCorrect = await user.validatePassword(password);
            if (isPasswordCorrect) {
                // 1. Generate JWT token
                const token = await user.getJWT();
                // 2. Send token to client
                res.cookie("token", token, {
                    expires: new Date(Date.now() + 86400000), // 1 day
                    httpOnly: true, // only server can access the cookie
                });
                res.json({message: 'Login success', data: user});
            } else {
                return res.status(401).send('Invalid credentials');
            }
        }
    } catch {
        console.log(err);
        return res.status(400).send('Error login user ' + err);
    }
})

router.post("/logout", async (req, res) => {
    try {
        // 1. Clear the cookie
        res.clearCookie("token");
        // 2. Send response
        res.send('Logout success');
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error logout user ' + err);
    }
});


module.exports = router