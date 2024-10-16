const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatus");

module.exports = (...roles) => {
    return (req, res, next) => {
        console.log("Roles : ", roles);
        if (!roles.includes(req.LoggedUser.role)) {
            console.log(roles.includes(req.LoggedUser.role));
            appError.create("Access Denied !", 403, httpStatus.FAIL);
            return next(appError);
        }
        next();
    }
}