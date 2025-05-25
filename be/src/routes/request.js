const express = require('express');
const router = express.Router();
const {userAuth} = require('../middlewares/auth');
const connectionRequest = require('../models/connectionRequest');
const UserModel = require('../models/user');
const mongoose = require('mongoose');


router.get("/send/:status/:toUserId", userAuth, async (req, res) => {
    try {

        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        console.log("From user: " + fromUserId);
        console.log("To user: " + toUserId);
        console.log("Status: " + status);

        const allowedStatuses = ['interested', 'ignored'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status ' + status,
            });
        }
        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).json({
                message: 'Invalid user ID' + toUserId,
            });
        }
        const user = await UserModel.findById(toUserId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        // implemented this check in schema itself
        // if (fromUserId === toUserId) {
        //     return res.status(400).json({
        //         message: 'Cannot send connection request to self'
        //     });
        // }
        const existingConnectionReq = await connectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnectionReq) {
            return res.status(400).json({
                message: 'Connection request already exists'
            });
        }
        const connecttionReq = new connectionRequest({ 
            fromUserId,
            toUserId,
            status
        });

        const data = await connecttionReq.save();
        res.json({
            message: `Your connection request to user- ${user.firstName} is marked as ${status}`,
            data: data
        })
    }
    catch (err) {
        console.log(err);
        return res.status(400).send('Error sending request ' + err);
    }
});


router.get("/review/:status/:requestId", userAuth, async (req, res, next) => {
    try {
        const requestId = req.params.requestId;
        const toUserId = req.user.id;
        const status = req.params.status;
        console.log("From user: " + requestId); 
        console.log("To user: " + toUserId);
        console.log("Status: " + status);

        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({
                message: 'Invalid request ID' + requestId,
            });
        }

        const allowedStatuses = ['accepted', 'rejected'];
        if(!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid status ' + status,
            });
        }

        const filter = {
            _id: requestId,
            toUserId: toUserId,
            status: 'interested'
        };
        const update = {
            status: status
        };
        const connectedReq = await connectionRequest.findOneAndUpdate(filter, update);
        if (!connectedReq) {
            return res.status(404).json({
                message: 'Connection request not found'
            });
        }
        const fromUser = await UserModel.findById(connectedReq.fromUserId);
        if (!fromUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.send({
            message: `The connection request from user- ${fromUser.firstName} is ${status} successfully`,
            data: connectedReq
        });

    } catch (err) {
        console.log(err);
        return res.status(400).send('Error receiving request ' + err);
    }
});

module.exports = router;