const mongoose = require('mongoose');
const config = require('config');
const mongoUrl = config.mongoUrl;

const connectDB =  async() => {
    try {
        await mongoose.connect(mongoUrl);
        console.log("mongoose Connected")
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;