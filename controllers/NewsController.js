const mongoose = require('mongoose');
const {
    errorMessage,
    permissionDenied, removeFile,
} = require('./controllerHelper');
const News = mongoose.model('News');
const Category = mongoose.model('Category');

exports.getAll = async (req, res) => {
    try {
        const {page, rowsPerPage, searchValue} = req.query;
        let pageIndex = parseInt(page);
        let pageSize = parseInt(rowsPerPage);
        let query = {name: {$regex: searchValue, '$options': 'i'}};
        const all = await News.find(query);
        const news = await News.find(query)
            .limit(pageSize)
            .skip(pageSize * pageIndex)
            .populate('categoryInfo');

        return res.send({status: true, data: news, total: all.length});

    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: errorMessage()});
    }
}

exports.create = async (req, res) => {
    try {
        const {name, content, categorySlug} = req.body;
        let category = null;
        if (categorySlug) {
            category = await Category.findOne({slug: categorySlug});
        }
        if (!category) {
            removeFileIfError(req);
            return res.status(200).json({status: false, msg: "Category not found."});
        }
        const news = new News();
        news.name = name;
        news.content = content;
        news.category = category._id;
        if (req.files && req.files[0]) {
            news.image = req.files[0].filename
        }
        await news.save();
        res.status(200).json({status: true, msg: "News created successfully."});
    } catch (error) {
        console.log(error);
        removeFileIfError(req);
        res.status(200).json({status: false, msg: "Something went wrong. Please try again"});
    }
}

exports.show = async (req, res) => {
    try {
        const {slug} = req.params;
        const result = await News.findOne(slug).populate('categoryInfo');
        res.send({status: true, data: result});
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: errorMessage()});
    }
}

exports.update = async (req, res) => {
    try {
        const user = req.user
        if (user.role.name === 'Admin') {
            const {_id, name, content, categorySlug} = req.body;
            const news = await News.findById(_id);
            let category = null;
            if (!news) {
                removeFileIfError(req);
                return res.send({status: false, msg: "News not found"});
            }
            if (categorySlug) {
                category = await Category.findOne({slug: categorySlug});
                if (!category) {
                    removeFileIfError(req);
                    return res.send({status: false, msg: "Category not found"});
                }
                news.category = category._id;
            }
            news.name = name || news.name;
            news.content = content || news.content;
            if (req.files && req.files[0]) {
                removeFile(news.image);
                news.image = req.files[0].filename
            }
            await news.save();
            return res.send({status: true, msg: "News updated successfully"});
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
            const result = await News.findByIdAndRemove(req.params.id);
            if (result) {
                removeFile(result.image);
                res.send({status: true, msg: "News deleted successfully"});
            } else {
                res.send({status: false, msg: "News not found"});
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