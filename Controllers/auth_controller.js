const httpStatus = require('../utils/httpStatus');
const appError = require('../utils/appError');
const { validationResult } = require('express-validator');
const asyncWrapper = require('../middleware/asyncCatchHandler');
const generateToken = require('../utils/generateToken');
const user = require('../models/user.model');
const bcrypt = require('bcryptjs')

const register = asyncWrapper(async (req, res, next) => {

    console.log(req.file);
    const { firstname, lastname, email, password, role } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        appError.create(errors.array(), 400, httpStatus.FAIL);
        return next(appError);
    }
    const UserFound = await user.findOne({ email });
    if (UserFound) {
        console.log(UserFound);
        appError.create("Email has already been registered. Please try another one.", 400, httpStatus.FAIL);
        return next(appError);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const User = new user({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role,
        avatar: req.file.filename
    });
    const token = await generateToken({
        id: User._id,
        name: User.firstname + ' ' + User.lastname,
        email: User.email,
        role: User.role
    });
    User.token = token;
    console.log(token);
    await User.save();
    res.status(201).json({ status: httpStatus.SUCCESS, data: { User } });
});
/////////
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    const User = await user.findOne({ email });
    if (!User) {
        appError.create("Wrong Credentials :(", 401, httpStatus.FAIL);
        return next(appError);
    }
    const isPasswordCorrect = await bcrypt.compare(password, User.password);
    if (!isPasswordCorrect) {
        appError.create("Wrong Password :(", 401, httpStatus.FAIL);
        return next(appError);
    }
    const token = await generateToken({
        id: User._id,
        name: User.firstname + ' ' + User.lastname,
        email: User.email,
        role: User.role
    });
    User.token = token;
    res.status(200).json({ status: httpStatus.SUCCESS, data: { User: User } })
});

module.exports = {
    login,
    register
}