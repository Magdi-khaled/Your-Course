const jwt = require('jsonwebtoken');
const httpStatus = require('../utils/httpStatus');
const appError = require('../utils/appError');
const verfiyToken = (req, res, next) => {
    const authBrear = req.headers.token;
    if (!authBrear) {
        appError.create('Token is required', 401, httpStatus.ERROR);
        next(appError);
    }
    const token = authBrear.split(' ')[1];
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET);
        req.LoggedUser = currentUser;
        console.log("Current User : ", currentUser);
        next();
    } catch (err) {
        appError.create('Invalid Token', 401, httpStatus.ERROR);
        next(appError);
    }
}
module.exports = verfiyToken;