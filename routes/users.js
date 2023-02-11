var express = require('express');
var router = express.Router();
const passport = require("passport");

require("../passport");
const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

const userController = require('../controllers/UserController')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', requireSignin, (req, res, next) => userController.loginWithEmail(req, res, next));
router.get('/getAdmins', requireAuth, (req, res, next) => userController.getAdmins(req, res, next));
router.post('/addUser', requireAuth, (req, res, next) => userController.addUser(req, res, next));
router.put('/updateUser', requireAuth, (req, res, next) => userController.updateUser(req, res, next));
router.post('/jwtLogin', requireAuth, (req, res, next) => userController.loginWithEmail(req, res, next));
router.get('/getUser/:id', requireAuth, (req, res, next) => userController.getUser(req, res, next));
router.get('/getRoles', requireAuth, (req, res, next) => userController.getRoles(req, res, next));
router.delete('/removeUser/:id', requireAuth, (req, res, next) => userController.removeUser(req, res, next));

module.exports = router;
