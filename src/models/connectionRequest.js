const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // reference to user model
        ref: 'User'
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status'
        }
    }
},  {
        timestamps: true
   }
);

// compound Index on fromUserId and toUserId- used to optimize the query performance by creating a special DB index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });


// to do things before saving the connection request
// middleware function
connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    // check if fromuserid and touser id are same
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        const error = new Error('Cannot send connection request to self');
        error.status = 400;
        return next(error);
        
    }
    next();
});
    
module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);; 
