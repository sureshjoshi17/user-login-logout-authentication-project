const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
        })
        console.log("mongodb connected");
}

module.exports = connectDb;