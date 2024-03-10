const express = require('express');
const router = express.Router();
const { usersignupget, usersignuppost, userloginget, userloginpost, userlogoutget } = require('../controllers/userauthcontrollers');

// Define route for home page
router.get('/', (req, res) => {
    res.render('index'); // Assuming index.ejs is in your views directory
});

router.get('/usersignup', usersignupget);
router.post('/usersignup', usersignuppost);
router.get('/userlogin', userloginget);
router.post('/userlogin', userloginpost);
router.get('/userlogout', userlogoutget); 

router.get('/userdashboard', (req, res) => {
    res.render('userdashboard', { username: res.locals.username });
});

module.exports = router;
