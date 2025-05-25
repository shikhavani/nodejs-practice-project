const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/auth');
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');

router.get("/getProfile", userAuth, async (req, res) => {
    console.log("Get profile");
    try {
        if(!req.user) {
            return res.status(401).send('User not found');
        } 
        res.send(req.user);
    } catch(err) {
        console.log(err);
        return res.status(400).send('Error fetching user profile ' + err);  
    }
});


router.patch("/editProfile", userAuth, async (req, res) => {
    console.log("Edit profile");
    try {
        if(!req.user) {
            return res.status(401).send('User not found');
        } 
        console.log(req.body)
        const { firstName, lastName, age, photoURL, aboutMe, skills} = req.body;
        if (firstName === undefined && lastName === undefined && age === undefined && photoURL === undefined && aboutMe === undefined && skills === undefined) {
            return res.status(400).send('Invalid data');

        }       
        const user = await UserModel.findByIdAndUpdate(req.user._id, {
            firstName, lastName, age, photoURL, aboutMe, skills
        }, {
            runValidators: true,
            returnDocument: "after"
        });
        console.log(user);
        res.json({
            message: "Profile updated successfully",
            data: user
        });
    } catch(err) {
        console.log(err);
        return res.status(400).send('Error fetching user profile ' + err);  
    }
});

router.patch("/updatePassword", userAuth, async (req, res, next) => {
    console.log("Update password");
    try {
        if (!req.user) {
            return res.status(401).send('User not found');
        }
        const {newPassword, confirmPassword} = req.body;
        if (newPassword === undefined || confirmPassword === undefined) {
            return res.status(400).send('Invalid data');
        } else if (newPassword !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        const user = await UserModel.findByIdAndUpdate(req.user._id, {password: passwordHash}, {returnDocument: "after", runValidators: true});
        console.log(user);
        res.send('Password updated successfully');

    } catch(err) {
        console.log(err);
        return res.status(400).send('Error updating password ' + err);  
    }
});
 
module.exports = router;