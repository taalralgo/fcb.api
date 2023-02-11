var express = require('express');
var router = express.Router();
const passport = require("passport");

require("../passport");
const Uploader = require('../controllers/Uploader');

const requireAuth = passport.authenticate("jwt", {session: false});

const newsController = require('../controllers/NewsController')

router.get('/', (req, res, next) => newsController.getAll(req, res, next));
router.post('/create', requireAuth, Uploader.uploadImage, (req, res, next) => newsController.create(req, res, next));
router.put('/update', requireAuth, Uploader.uploadImage, (req, res, next) => newsController.update(req, res, next));
router.get('/show/:id', (req, res, next) => newsController.show(req, res, next));
router.delete('/remove/:id', requireAuth, (req, res, next) => newsController.remove(req, res, next));

module.exports = router;
