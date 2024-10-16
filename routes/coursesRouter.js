const express = require('express');
const router = express.Router();

const course_controller = require('../Controllers/course-controller');
const validationSchema = require('../middleware/validationSchema');
const verfiyToken = require('../middleware/verfiyToken');

const userRole = require('../utils/userRole');
const allowedTo = require('../middleware/allowedTo');

// 
router.route('/')
    .get(verfiyToken, course_controller.getAllCourses)
    .post(verfiyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), validationSchema(), course_controller.addCourse);
// 
router.route('/:id')
    .get(verfiyToken, course_controller.getSpecificCourse)
    .patch(verfiyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), validationSchema(), course_controller.updateCourseContent)
    .delete(verfiyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), course_controller.deleteCourseContent);

module.exports = router;