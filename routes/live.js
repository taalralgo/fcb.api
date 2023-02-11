var express = require('express');
var router = express.Router();
const passport = require("passport");

require("../passport");

const requireAuth = passport.authenticate("jwt", {session: false});

const Uploader = require('../controllers/Uploader');

const liveController = require('../controllers/LiveController')

router.get('/', (req, res, next) => liveController.getAll(req, res, next));
router.post('/create', requireAuth, Uploader.uploadImage, (req, res, next) => liveController.create(req, res, next));
router.post('/import', requireAuth, Uploader.uploadM3u, (req, res, next) => liveController.import(req, res, next));

module.exports = router;
