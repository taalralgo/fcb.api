const mongoose = require('mongoose');
const {
    errorMessage,
    permissionDenied,
    requestAddAdminUserValidate,
    userFieldExist,
    userEmailExist,
    userPhoneExist
} = require('./controllerHelper');
const User = mongoose.model('User');
const Role = mongoose.model('Role');

exports.loginWithEmail = async (req, res) => {
    try {
        const user = req.user
        if (user.role.name === 'Admin') {
            return res.send({status: true, data: user});
        }
        res.status(200).json({status: false, msg: "Permission denied"});
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: "Something went wrong. Please try again"});
    }
}

exports.addUser = async (req, res) => {
    try {
        const user = req.user
        const {firstName, lastName, email, phone, password, role} = req.body;
        if (user.role.name === 'Admin') {
            const validate = requestAddAdminUserValidate(req.body);
            if (!validate.status) {
                return res.status(200).json({status: false, msg: validate.msg});
            }
            if (await userEmailExist(email)) {
                return res.json({status: false, msg: "L'adresse email est déjà utilisée."})
            }
            if (await userPhoneExist(phone)) {
                return res.json({status: false, msg: "Le numéro de téléphone renseigné est déjà utilisé."})
            }
            const result = await new User({
                firstName,
                lastName,
                password,
                email,
                role,
                phone
            }).save();

            res.send({status: true, msg: "User created successfully"});
        } else {
            res.status(200).json({status: false, error: 'Permission denied'})
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: "Something went wrong. Please try again"});
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = req.user
        if (user.role.name === 'Admin') {
            const result = await User.findById(req.params.id).populate('roleInfo');
            res.send({status: true, data: result});
        } else {
            res.status(200).json({status: false, error: permissionDenied()})
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: errorMessage()});
    }
}

exports.getAdmins = async (req, res) => {
    try {
        const user = req.user
        if (user.role.name === 'Admin') {
            console.log("Ad")
            const adminRoles = await Role.find({'name': {$in: ['Admin']}}).select('id');
            let adminSuperRolesIds = [];
            for (const val of adminRoles) {
                adminSuperRolesIds.push(val.id);
            }
            const result = await User.find({'role': {$in: adminSuperRolesIds}}).select('-token').populate('roleInfo');
            return res.send({status: true, data: result});
        } else {
            res.status(200).json({status: false, error: permissionDenied()})
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: errorMessage()});
    }
}

exports.getRoles = async (req, res) => {
    try {
        const user = req.user
        if (user.role.name === 'Admin') {
            const result = await Role.find();
            res.send({status: true, data: result});
        } else {
            res.status(200).json({msg: permissionDenied()})
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: errorMessage()});
    }
}

exports.updateUser = async (req, res) => {
    try {
        const user = req.user
        if (user.role.name === 'Admin') {
            const {_id, firstName, lastName, role} = req.body;
            const result = await User.findByIdAndUpdate(_id, {firstName, lastName, role});
            res.send({status: true, msg: "User updated successfully"});
        } else {
            res.status(200).json({status: false, msg: permissionDenied()})
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: errorMessage()});
    }
}

exports.removeUser = async (req, res) => {
    try {
        const user = req.user
        if (user.role.name === 'Admin') {
            const result = await User.findByIdAndRemove(req.params.id);
            if (result) {
                res.send({status: true, msg: "User deleted successfully"});
            } else {
                res.send({status: false, msg: "User not found"});
            }
        } else {
            res.status(200).json({status: false, msg: permissionDenied()})
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: errorMessage()});
    }
}