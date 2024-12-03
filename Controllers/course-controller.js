const course = require('../models/course.model'); //Courses_DB_Model 
const httpStatus = require('../utils/httpStatus');
const appError = require('../utils/appError');
const { validationResult } = require('express-validator');
const asyncWrapper = require('../middleware/asyncCatchHandler');

// Get All Courses
const getAllCourses = asyncWrapper(async (req, res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await course.find({}, { "__v": false }).skip(skip).limit(limit);
    res.status(200).json({ status: httpStatus.SUCCESS, data: { courses } });
});
// Get Specific Course
const getSpecificCourse = asyncWrapper(async (req, res, next) => {
    const foundCourse = await course.findById(req.params.id, { "__v": false });
    if (!foundCourse) {
        appError.create("Course Not Found", 404, httpStatus.FAIL);
        next(appError);
    } else {
        res.status(200).json({ status: httpStatus.SUCCESS, data: { course: foundCourse } });
    }
});
// create Course
const addCourse = asyncWrapper(async (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        appError.create(err.array(), 400, httpStatus.FAIL);
        next(appError);
    }
    else {
        const newCourse = new course(req.body);
        await newCourse.save();
        res.status(201).json({ status: httpStatus.SUCCESS, data: { course: newCourse } });
    }
});
// update course
const updateCourseContent = asyncWrapper(async (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        appError.create(err.array(), 400, httpStatus.FAIL);
        return next(appError);
    }
    // Find course by ID and update it
    const updatedCourse = await course.findByIdAndUpdate(
        req.params.id, { $set: req.body }, { new: true }
    );
    if (!updatedCourse) {
        appError.create("Course Not Found", 404, httpStatus.FAIL);
        return next(appError);
    }
    res.status(200).json({ status: httpStatus.SUCCESS, data: { course: updatedCourse } });
});
// delete course
const deleteCourseContent = asyncWrapper(async (req, res, next) => {
    const deletedCourse = await course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
        appError.create("Course Not Found", 404, "Fail");
        return next(appError);
    }
    res.status(200).json({ status: httpStatus.SUCCESS, data: { course: deletedCourse } })
});

module.exports = {
    getAllCourses,
    getSpecificCourse,
    addCourse,
    updateCourseContent,
    deleteCourseContent
}