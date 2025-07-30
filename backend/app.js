const express = require('express');
const app = express();
require('dotenv').config({path : './config/config.env'});
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');

const authRouter = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const CustomErrorHandler = require('./utils/AppError');
const { globleErrorHandler } = require('./middlewares/error.middleware');
const shopRouter = require('./routes/shop.routes');
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
// app.use(
//   mongoSanitize({
//     replaceWith: '_',
//   }),
// );

// app.use(xss());
app.use(helmet());
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}



app.use('/api/v1/auth',authRouter);
app.use('/api/v1/shop',shopRouter);

app.use((req,res,next) => {
    next(new CustomErrorHandler('path not found ', 404));
})

app.use(globleErrorHandler)


module.exports = app