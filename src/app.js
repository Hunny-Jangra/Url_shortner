const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const hbs = require('hbs');
const app = express();
const getUrl = require('./Router/urlRouter');
require('../services/cache');
const AppError = require('./utils/appError');
const globalErrorController = require('./controller/errorController');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

dotenv.config({
    path: './src/config.env'
})

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

app.use('/', getUrl);

app.all('*', (req, res, next) => {
    // res.status(404).send({
    //     status: false,
    //     message: `Ca't find ${req.originalUrl} to this server`
    // })

    // const err = new Error(`Can't find ${req.originalUrl} to this server`);
    // err.statusCode = 404;
    // err.status = 'fail';

    next(new AppError(`Can't find ${req.originalUrl} to this server`, 404));
})

app.use(globalErrorController);

module.exports = app;