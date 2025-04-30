const express = require('express');
const connectDB = require('./config/database');
const UserModel = require('./models/user');
// const practiceApp = require('./practice');

const app = express();

app.post("/user/signup", async (req, res) => {
    const user = new UserModel({
        firstName: "Shikha",
        lastName: "Vani",
        emailId: "shikhajp96@gmail.com",
        password: "56789",
        age: 28,
        gender: "female"
    });
    try {
        await user.save();
        res.send('Signup success!');
    }
    catch (err) {
        console.log(err);
        return res.status(400).send('Error saving user');
    }
});


connectDB().then(() => {
    // app.listen, to make sure that the server is running after the connection is established
    console.log('MongoDB connected');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log('MongoDB connection error:', err);
});
