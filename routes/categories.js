var express = require('express');
var router = express.Router();
const passport = require("passport");

require("../passport");
const requireAuth = passport.authenticate("jwt", {session: false});
const Uploader = require('../controllers/Uploader');

const categoryController = require('../controllers/CategoryController');

router.get('/', requireAuth, (req, res, next) => categoryController.getAll(req, res, next));
router.post('/create', requireAuth, Uploader.uploadImage, (req, res, next) => categoryController.create(req, res, next));
router.put('/update', requireAuth, Uploader.uploadImage, (req, res, next) => categoryController.update(req, res, next));
router.delete('/remove/:id', requireAuth, (req, res, next) => categoryController.remove(req, res, next));

module.exports = router;
