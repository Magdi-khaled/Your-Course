const httpStatus = require('../utils/httpStatus');
const appError = require('../utils/appError');
const { validationResult } = require('express-validator');
const asyncWrapper = require('../middleware/asyncCatchHandler');
const user = require('../models/user.model');


const getUsers = asyncWrapper(async (req, res, next) => {
    const users = await user.find({}, { "__v": false });
    res.status(200).json({ status: httpStatus.SUCCESS, data: { users } });
});

const getSingleUser = asyncWrapper(async (req, res, next) => {
    const token = req.headers.token;
    console.log(token.split(' ')[1]);
    const foundUser = await user.findById(req.params.id, { "__v": false });
    if (!foundUser) {
        appError.create("User Not Found", 404, httpStatus.FAIL);
        return next(appError);
    }
    res.status(200).json({ status: httpStatus.SUCCESS, data: { User: foundUser } });
});

const updateUserData = asyncWrapper(async (req, res, next) => {
    const updatedUser = await user.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    );
    if (!updatedUser) {
        appError.create("User Not Found", 404, httpStatus.FAIL);
        return next(appError);
    }
    res.status(200).json({ status: httpStatus.SUCCESS, data: { user: updatedUser } });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
    const deletedUser = await user.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
        appError.create("User Not Found", 404, httpStatus.FAIL);
        return next(appError);
    }
    res.status(200).json({ status: httpStatus.SUCCESS, data: { deletedUser: deletedUser } });
});

module.exports = {
    getUsers,
    getSingleUser,
    updateUserData,
    deleteUser
}