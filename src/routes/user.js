const express = require('express');
const {userAuth} = require('../middlewares/auth');
const router = express.Router();
const connectionRequest = require('../models/connectionRequest');
const userModel = require('../models/user');

router.get("/getPendingRequests", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const myRequests = await connectionRequest.find({toUserId: userId, status: 'interested'})
        // populate works only on the model which is referenced in the schema, ref in connectionRequest schema
        // .populate('fromUserId', ['firstName', 'lastName', 'gender']); // this is also valid
        .populate('fromUserId', 'firstName lastName gender photoURL aboutMe skills');
        if (!myRequests){
            return res.status(404).send('No requests found');
        }
        res.send(myRequests);
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error fetching user requests ' + err);
    }
});

router.get("/getConnections", userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const myConnections = await connectionRequest.find({
            $or: [
                { fromUserId: userId, status: 'accepted' },
                { toUserId: userId, status: 'accepted' }
            ]
        }).populate('fromUserId', 'firstName lastName aboutMe skills photoURL')
        .populate('toUserId', 'firstName lastName aboutMe skills photoURL')

        const data = myConnections.map((item) => {
            // toString() is required to compare ObjectId in mongoose
            if (item.fromUserId._id.toString() === userId.toString()) {
                return item.toUserId
            } else {
                return item.fromUserId
            }
        });
        if (!data) {
            return res.status(404).send('No connections found');
        }

        res.send(data);
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error fetching user connections ' + err);
    }
});


// to get users feed, who are not ignored/ connected/ sent request
router.get("/feed", userAuth, async (req,res) => {
    try {
        const userId = req.user._id;
        console.log("User ID: " + userId);


        const page = parseInt(req.query.page) || 1; // default page is 1
        const limit = parseInt(req.query.limit) || 10; // default limit is 10
        const skip = (page - 1) * limit; // calculate skip value for pagination



        /** my way 
             // find all useres except the current user
            const users = await userModel.find({_id: {$ne: userId}}).select('firstName lastName aboutMe skills photoURL');

            console.log("users count except loggedin user : " + users.length);

            // all users who are not in connection request in fromUser or toUser
            const connectionReq = await connectionRequest.find({
                $or: [
                    {
                        fromUserId: userId
                    },
                    {
                        toUserId: userId        
                    }
                ]
            }).select('fromUserId toUserId');

            // pagination should be handled manually in this case
            const userIdsToBeRemovedfromFeed = connectionReq.map((item) => {
                if (item.fromUserId._id.toString() === userId.toString()) {
                    return item.toUserId.toString();
                } else {
                    return item.fromUserId.toString();
                }
            });
            console.log("userIds to be removed from feed: " + userIdsToBeRemovedfromFeed.length);

            const finalFeedUsers = users.filter((item) => {
                if (userIdsToBeRemovedfromFeed.includes(item._id.toString())) {
                    console.log("userId to be removed from feed: " + item._id);
                    return false
                } return true
            })
       */


        /** another way  */  
            const connectionReq = await connectionRequest.find({
                $or: [
                    {
                        fromUserId: userId
                    },
                    {
                        toUserId: userId        
                    }
                ]
            }).select('fromUserId toUserId');
            console.log("connection requests count: " + connectionReq.length);
            const hideUsersFromFeed = new Set();
            connectionReq.forEach((req) => {
                hideUsersFromFeed.add(req.toUserId.toString());
                hideUsersFromFeed.add(req.fromUserId.toString());
            });
            console.log("userIds to be removed from feed: " + hideUsersFromFeed.size);
            const finalFeedUsers = await userModel.find(
                {
                    $and: [
                        { _id: {$nin: Array.from(hideUsersFromFeed)}},
                        { _id: {$ne: userId} }
                    ]
                }
            ).select('firstName lastName aboutMe skills photoURL').skip(skip).limit(limit);
        

            console.log("final feed users count : " + finalFeedUsers.length);
            res.send(finalFeedUsers);
    } 
    catch(err) {

    }
})

module.exports = router;