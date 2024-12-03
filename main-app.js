const express = require('express');
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const httpStatus = require('./utils/httpStatus');
const path = require('path');

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(console.log("server mongodb connected"));

app.use(cors());
const courseRouter = require('./routes/coursesRouter');
const userRouter = require('./routes/userRouter');

app.use('/api/courses', courseRouter);
app.use('/api/users', userRouter);

// Global Router Error Handler
app.all('*', (req, res) => {
    res.status(404).json({ status: httpStatus.ERROR, RouterError: "URL NOT FOUND" });
});

// Global Error Handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500)
        .json({
            status: error.statusText || httpStatus.ERROR,
            errors: error.message, code: error.statusCode || 500
        });
    next();
});


app.listen(process.env.PORT || 4000, () => {
    console.log('success!')
});