const jwt = require('jsonwebtoken');
const generateToken = (payload) => {
    const Token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log(Token);
    return Token;
}
module.exports = generateToken;