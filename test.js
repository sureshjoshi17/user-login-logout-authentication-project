require('dotenv').config();

const express = require('express');
const userRoute = require('./routes/userRoute');
const privateRoute = require('./routes/privateRoute');
const connectDb = require('./config/db');
const errorHandler = require('./middleware/error')

connectDb();

const app = express();

app.use(express.json());

app.use('/api/user', userRoute);
app.use('/api/private', privateRoute);

//Error handler (Should be last piece of middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`app is running on port ${PORT}`));

process.on('unhandleRejection', (err, promise) => {
    console.log(`logged Error: ${err}`);
    server.close( () => process.exit(1));
})