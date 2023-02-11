const mongoose = require('mongoose');
const User = mongoose.model('User');
const fs = require('fs');

const errorMessage = () => {
    return "Something went wrong";
}

const permissionDenied = () => {
    return "Permission Denied";
}

const requestAddAdminUserValidate = (user) => {
    const error = {
        msg: '',
        status: true
    };
    if (!user.phone && !user.email) {
        error.msg = "Merci de renseigner un numéro de telephone ou un email."
        error.status = false
        return error;
    }
    if (!user.firstName || !user.lastName) {
        error.msg = "Merci de renseigner votre nom et prénom."
        error.status = false
        return error;
    }
    if (!user.password) {
        error.msg = "Merci de définir un mot de passe."
        error.status = false
        return error;
    }
    return error;
}

const userEmailExist = async (email) => {
    if (email) {
        return User.findOne({email});
    }
    return null;
}

const userPhoneExist = async (phone) => {
    if (phone) {
        return User.findOne({phone});
    }
    return null;
}

const removeFile = (filename) => {
    try {
        fs.unlinkSync(__dirname + '/../public/' + filename);
        console.log('successfully file deleted');
        return true;
    } catch (error) {
        console.error('there was an error:', error.message);
        return false;
    }
}

module.exports = {
    errorMessage,
    permissionDenied,
    requestAddAdminUserValidate,
    userEmailExist,
    userPhoneExist,
    removeFile
}