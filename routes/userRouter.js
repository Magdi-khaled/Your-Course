const express = require('express');
const router = express.Router();

const RegiserationSchema = require('../middleware/RegistrationSchema');
const auth_controller = require('../Controllers/auth_controller');
const user_controller = require('../Controllers/user_controller');
const verfiyToken = require('../middleware/verfiyToken');
const userRole = require('../utils/userRole');
const allowedTo = require('../middleware/allowedTo');
const httpStatus = require('../utils/httpStatus');

//////
const multer = require('multer');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }

})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];

    if (imageType === 'image') {
        return cb(null, true)
    } else {
        return cb(appError.create('file must be an image', httpStatus.FAIL, 400), false)
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter
})

/////
router.route('/')
    .get(verfiyToken, user_controller.getUsers)  // GET /users

router.route('/register')
    .post(upload.single('avatar'), RegiserationSchema(), auth_controller.register) // ADD /user

router.route('/login')
    .post(upload.none(), auth_controller.login)    // LOGIN /user

router.route('/:id')
    .get(verfiyToken, user_controller.getSingleUser) // GET /single user
    .patch(verfiyToken, RegiserationSchema(), user_controller.updateUserData)
    .delete(verfiyToken, allowedTo(userRole.ADMIN, userRole.MANAGER), user_controller.deleteUser);

module.exports = router;