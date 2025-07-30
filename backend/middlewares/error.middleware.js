const CustomErrorHandler = require("../utils/AppError");

const developmentErrors = (res , error) => {
    res.status(error.statusCode).json({
        status :  false,
        message : error.message,
        stackTrace : error.stack,
        error : error
    })
}

const productionError = (res , err) => {
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new CustomErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = "JSON Web Token is invalid. Try again.";
        err = new CustomErrorHandler(message, 400);
    }

    if (err.name === "TokenExpiredError") {
        const message = "JSON Web Token has expired.";
        err = new CustomErrorHandler(message, 400);
    }

    if (err.name === "CastError") {
        const message = `Invalid ${err.path}`;
        err = new CustomErrorHandler(message, 400);
    }


    const errorMessage = err.errors
        ? Object.values(err.errors)
              .map(error => error.message)
              .join(" ")
        : err.message;
    res.status(err.statusCode).json({
        success : false,
        message: errorMessage
    })
}


exports.globleErrorHandler = (err , req, res, next) => {
    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500
    if(process.env.NODE_ENV === 'development'){
        developmentErrors(res , err);
    }else if(process.env.NODE_ENV === 'production'){
        productionError(res , err);
    }
    
}