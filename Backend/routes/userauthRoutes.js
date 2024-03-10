const express = require('express');
const router = express.Router();
const { usersignupget, usersignuppost, userloginget, userloginpost, userlogoutget } = require('../controllers/userauthcontrollers');

router.get('/usersignup', usersignupget);
router.post('/usersignup', usersignuppost);
router.get('/userlogin', userloginget);
router.post('/userlogin', userloginpost);
router.get('/userlogout', userlogoutget); 

router.get('/userdashboard', (req, res) => {
    res.render('userdashboard', { username: res.locals.username });
    res.render('userdashboard');
});


module.exports = router;