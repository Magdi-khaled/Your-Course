const { body } = require('express-validator');
const userRole = require('../utils/userRole');

const RegiserationSchema = () => {
    return [
        body('password')
            .notEmpty()
            .withMessage('Password is empty')
            .isLength({ min: 4 })
            .withMessage('Password should be more than 4 chars'),
        body('role')
            .isIn([userRole.USER, userRole.ADMIN, userRole.MANAGER])
            .withMessage('role is must be [User , Admin or Manager]'),
    ]
}
module.exports = RegiserationSchema
