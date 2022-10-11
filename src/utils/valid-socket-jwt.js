const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validSocketJWT = async (token = '') => {
    try {
        if (token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRET_PRIVATE_KEY);
        const user = await User.findById(uid);

        if (!user) {
            return null;
        }

        if (!user.state) {
            return null;
        }

        return user;
    } catch ( error ) {
        return null;
    }
}

module.exports = {
    validSocketJWT
}