const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://shikhavani:mgdb21@nodelessoncluster.dxemo1y.mongodb.net/DevTinder');
};

module.exports = connectDB;