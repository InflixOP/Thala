const express = require('express');
const router = express.Router();
const { creatorsignupget, creatorsignuppost, creatorloginget, creatorloginpost, creatorlogoutget, updateTokens } = require('../controllers/creatorauthcontrollers');


router.get('/', (req, res) => {
    res.render('index'); 
});

router.get('/creatorsignup', creatorsignupget);
router.post('/creatorsignup', creatorsignuppost);
router.get('/creatorlogin', creatorloginget);
router.post('/creatorlogin', creatorloginpost);
router.get('/creatorlogout', creatorlogoutget);
router.post('/updateTokens', updateTokens); 

module.exports = router;
