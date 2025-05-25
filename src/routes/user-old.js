const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');



router.get("/getAllUsers", async (req, res) => {
    try {
        const users = await UserModel.find();
        res.send(users); 
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error fetching users');
    }
});



router.get("/:findByVal", async (req, res) => {
    const findValue = req.params.findByVal;
    console.log(findValue)
    try {
        const userByEmail = await UserModel.find({emailId: findValue});
        if(userByEmail.length === 0) {
            const userById = await UserModel.findById(findValue);
            if (userById.length === 0) {
                return res.status(404).send('User not found');
            } else {
                res.send(userById);
            }
        } else {
            res.send(userByEmail); 
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error fetching user by userid');
    }
});

router.delete("/deleteUser/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        await UserModel.findByIdAndDelete(userId);
        res.send('User deleted successfully');
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error deleting user');
    }
});

router.patch("/updateUser/:userId", async (req, res) => {
    const userId = req.params.userId;
    console.log(userId);
    try {
        const allowedUpdates = ['photoURL', 'aboutMe', 'password', 'age', 'skills'];
        const isValidOperation = Object.keys(req.body).every((item) => allowedUpdates.includes(item));
        if (!isValidOperation) {
            return res.status(400).send('Invalid updates');
        } else {
            // returnDocument: "after" returns the updated document
            // runValidators: true runs the validators on the updated document
            const user = await UserModel.findByIdAndUpdate(userId, req.body, {returnDocument: "after", runValidators: true}); 
            console.log(user);
            res.send('User updated successfully');
        }

    } catch (err) {
        console.log(err);
        return res.status(400).send('Error updating user' + err);
    }
});

module.exports = router;