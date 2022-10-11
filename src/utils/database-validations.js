const User = require('../models/user');

const existEmailValidation = async(email = '') => {
    const existEmail = await User.findOne({email});
    if (existEmail) {
        throw new Error(`The email ${email} already exist`);
    }
}

const existUserId = async(id = '') => {
    const existUser = await User.findById(id);
    if (!existUser) {
        throw new Error(`The user id "${id}" not exist`);
    }
}

module.exports = {
    existEmailValidation,
    existUserId
}