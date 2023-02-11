const mongoose = require('mongoose');
const {
    errorMessage,
    removeFile
} = require('./controllerHelper');
const url = require("url");
const path = require("path");
const Video = mongoose.model('Video');

exports.getAll = async (req, res) => {
    try {
        // const videos = await Video.find().sort({createdAt: 'desc'});
        const videos = await Video.find().sort('-_id');
        return res.send({status: true, data: videos, total: videos.length});
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: errorMessage()});
    }
}

exports.create = async (req, res) => {
    try {
        const {name, url, type, videoId} = req.body;
        const video = new Video();
        video.name = name;
        video.url = url;
        video.type = type;
        video.videoId = videoId;
        if (type === 'vod') {
            if (req.files && req.files[0]) {
                video.url = process.env.URL + '/' + req.files[0].filename;
                video.videoId = req.files[0].filename;
            } else {
                return res.status(200).json({status: false, msg: "No video uploaded."});
            }
        } else {
            if (!videoId) {
                return res.status(200).json({status: false, msg: "VideoId is require for video type youtube."});
            }
        }
        await video.save();
        res.status(200).json({status: true, msg: "Video added successfully."});
    } catch (error) {
        console.log(error);
        removeFileIfError(req);
        res.status(200).json({status: false, msg: "Something went wrong. Please try again"});
    }
}

exports.updateImage = async (req, res) => {
    try {
        const {slug} = req.params;
        const video = await Video.findOne({slug});
        if (!video) {
            removeFileIfError(req);
            return res.status(200).json({status: false, msg: "Video not found."});
        }
        const lastImage = video.image;
        if (req.files && req.files[0]) {
            video.image = process.env.URL + '/' + req.files[0].filename;
        } else {
            return res.status(200).json({status: false, msg: "No image uploaded."});
        }
        if(lastImage && video.type === 'vod') {
            removeVODImage(lastImage)
        }
        await video.save();
        res.status(200).json({status: true, msg: "Image updated successfully."});
    } catch (error) {
        console.log(error);
        removeFileIfError(req);
        res.status(200).json({status: false, msg: "Something went wrong. Please try again"});
    }
}

exports.delete = async (req, res) => {
    try {
        const slug = await req.params.slug;
        const video = await Video.findOne({slug: slug});
        if (!video) {
            return res.status(200).json({status: false, msg: "Video not found!"});
        }
        const rs = await Video.findOneAndRemove({slug: slug});
        if (rs) {
            const image = video.image;
            if (video.type === 'vod' && image) {
                removeVODImage(image);
            }
            if (video.type === 'vod') {
                removeFile(video.videoId);
            }
            return res.status(200).json({status: true, msg: "Video delete successfully!"});
        }
        res.status(200).json({status: true, msg: "Video not delete."});
    } catch (error) {
        console.log(error);
        res.status(200).json({status: false, msg: "Something went wrong. Please try again"});
    }
}

const removeFileIfError = (req) => {
    if (req.files && req.files[0]) {
        removeFile(req.files[0].filename);
    }
}

const removeVODImage = (imageUrl) => {
    const parsed = url.parse(imageUrl);
    const filename = path.basename(parsed.pathname);
    removeFile(filename);
}