var express = require('express');
var router = express.Router();
const passport = require("passport");

require("../passport");

const requireAuth = passport.authenticate("jwt", {session: false});

const Uploader = require('../controllers/Uploader');

const videoController = require('../controllers/VideoController.js')

router.get('/', (req, res, next) => videoController.getAll(req, res, next));
// router.post('/create', requireAuth, Uploader.uploadImage, Uploader.uploadVideo, (req, res, next) => videoController.create(req, res, next));
router.post('/create', requireAuth, Uploader.uploadVideo, (req, res, next) => videoController.create(req, res, next));
router.post('/update-image/:slug', requireAuth, Uploader.uploadImage, (req, res, next) => videoController.updateImage(req, res, next));
router.delete('/delete/:slug', requireAuth, (req, res, next) => videoController.delete(req, res, next));

module.exports = router;
