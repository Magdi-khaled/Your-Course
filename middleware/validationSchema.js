const { body } = require('express-validator');
const validationSchema = () => {
    return [
        body('title')
            .notEmpty()
            .withMessage('course title is empty')
            .isLength({ min: 4 })
            .withMessage('course title should be more than 3 chars'),
    ]
}
module.exports = validationSchema