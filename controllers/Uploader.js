const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/');
    },
    filename: function (req, file, cb) {
        file.originalname.replace(/\\/g, "/");
        let filenameArr = file.originalname.split('.');
        let extension = filenameArr[filenameArr.length - 1] || '';
        cb(null, Date.now() + `.${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/octet-stream') {
        cb(null, true);
    } else {
        cb(new Error("Image Upload Problem"), false);
    }
};

const m3uFileFilter = (req, file, cb) => {
    cb(null, true);
};

const videoFileFilter = (req, file, cb) => {
    if (file.mimetype === 'video/mp4') {
        cb(null, true);
    } else {
        cb(new Error("Video not valide"), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
}).array("image", 10);

const uploadM3u = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: m3uFileFilter
}).array("iptv", 10);

const uploadVideo = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: videoFileFilter
}).array("video", 10);

module.exports = {
    async uploadImage(req, res, next) {
        try {
            await upload(req, res, function (err) {
                if (err) {
                    console.log(err)
                    return res.send({status: false, msg: "Image not uploaded"})
                } else {
                    next();
                }
            })
        } catch (error) {
            res.status(200).send({
                status: false,
                msg: error
            })
        }
    },

    async uploadM3u(req, res, next) {
        try {
            await uploadM3u(req, res, function (err) {
                if (err) {
                    console.log(err)
                    return res.send({status: false, msg: "File not uploaded"})
                } else {
                    next();
                }
            })
        } catch (error) {
            res.status(200).send({
                status: false,
                msg: error
            })
        }
    },

    async uploadVideo(req, res, next) {
        try {
            await uploadVideo(req, res, function (err) {
                if (err) {
                    console.log(err)
                    return res.send({status: false, msg: "File not uploaded"})
                } else {
                    next()
                }
            })
        } catch (error) {
            res.status(200).send({
                status: false,
                msg: error
            })
        }
    },
};