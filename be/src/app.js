const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// const practiceApp = require('./practice');

const app = express();

// whitelisting these domain as the URLs are unsecure, so bypassing with cors which requires frontend is hosting in what domain port
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json()); // Middleware to parse JSON data from the request body, for all routes
app.use(cookieParser()); // Middleware to parse cookies from the request headers, for all routes

const authRouter     = require('./routes/auth');
const profileRouter = require('./routes/profile');   
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/auth', authRouter);  // Mount the auth router on the /api path
app.use('/profile', profileRouter); // Mount the profile router on the /api path
app.use('/request', requestRouter); // Mount the request router on the /api path
app.use('/user', userRouter); // Mount the user router on the /api path




connectDB().then(() => {
    // app.listen, to make sure that the server is running after the connection is established
    console.log('MongoDB connected');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log('MongoDB connection error:', err);
});
