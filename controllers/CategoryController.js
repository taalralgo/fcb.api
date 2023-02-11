const mongoose = require('mongoose');
const {permissionDenied, errorMessage, removeFile} = require("./controllerHelper");
const Category = mongoose.model('Category');
const config = require("../config");
const fc = require("fs");


exports.getAll = async (req, res) => {
    try {
        const user = req.user;
        const {page, rowsPerPage, searchValue} = req.query;
        let pageIndex = parseInt(page);
        let pageSize = parseInt(rowsPerPage);
        let query = {name: {$regex: searchValue, '$options': 'i'}};
        if (user.role.name === 'Admin') {
            const all = await Category.find(query);
            const result = await Category.find(query).limit(pageSize).skip(pageSize * pageIndex);
            for (let i = 0; i < result.length; i++) {
                result[i].image = config.URL + '/' + result[i].image;
            }
            res.send({status: true, data: result, total: all.length});
        } else {
            res.status(200).json({msg: permissionDenied()})
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: errorMessage()});
    }
}

exports.create = async (req, res) => {
    try {
        const {name} = req.body;
        const category = new Category();
        category.name = name;
        if (req.files && req.files[0]) {
            category.image = req.files[0].filename
        }
        const exist = await Category.findOne({name});
        if (exist) {
            removeFileIfError(req);
            return res.status(200).json({status: false, msg: "Category already exist."});
        }
        await category.save();
        res.status(200).json({status: true, msg: "Category created successfully."});
    } catch (error) {
        console.log(error);
        removeFileIfError(req);
        res.status(200).json({status: false, msg: "Something went wrong. Please try again"});
    }
}

exports.update = async (req, res) => {
    try {
        const user = req.user
        if (user.role.name === 'Admin') {
            const {_id, name} = req.body;
            const category = await Category.findById(_id);
            if (category) {
                category.name = name;
                if (req.files && req.files[0]) {
                    removeFile(category.image);
                    category.image = req.files[0].filename
                }
                await Category.findByIdAndUpdate(category._id, {name: category.name, image: category.image});
                return res.send({status: true, msg: "Category updated successfully"});
            }
            removeFileIfError(req);
            res.send({status: false, msg: "Category not found"});
        } else {
            removeFileIfError(req);
            res.status(200).json({status: false, msg: permissionDenied()})
        }
    } catch (error) {
        console.log(error);
        removeFileIfError(req);
        res.status(200).json({status: false, msg: errorMessage()});
    }
}

exports.remove = async (req, res) => {
    try {
        const user = req.user
        if (user.role.name === 'Admin') {
            const result = await Category.findByIdAndRemove(req.params.id);
            if (result) {
                removeFile(result.image);
                res.send({status: true, msg: "Category deleted successfully"});
            } else {
                res.send({status: false, msg: "Category not found"});
            }
        } else {
            res.status(200).json({status: false, msg: permissionDenied()})
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: errorMessage()});
    }
}

const removeFileIfError = (req) => {
    if (req.files && req.files[0]) {
        removeFile(req.files[0].filename);
    }
}