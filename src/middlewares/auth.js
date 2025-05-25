const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');


const adminAuth = (req, res, next) => {
    console.log("checking admin access");
    const token = "xyz56";
    const isAdminAuthorized = token === "xyz";
    if (isAdminAuthorized) {
        console.log("access validated");
        next();
    } else {
        res.status(401).send('Unauthorized access');
    }
};


const userAuth = async (req, res, next) => {
   try {
     // read token from request cookies
    const {token} = req.cookies;
    if (!token) {
        throw new Error("Token not found");
    }
     // validate the token
    const decodedMsg = await jwt.verify(token, "DEV@SV21");
    const {_id} = decodedMsg;
    console.log("Logged in user id:" + _id);

     // find the user
    const user = await UserModel.findById(_id);
    if (!user) {
        throw new Error("User not found"); 
    }
    req.user = user;
    next();
   } catch(err) {
        res.status(400).send('Bad Request: ' + err);

        console.log()
        console.log(err);
   }
};

const userAuthOld = (req, res, next) => {
    console.log("checking user access");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (isAdminAuthorized) {
        console.log("access validated");
        next();
    } else {
        res.status(401).send('Unauthorized access');
    }
};

module.exports = {adminAuth, userAuth} ;
