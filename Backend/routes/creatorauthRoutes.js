const express = require('express');
const router = express.Router();
const { creatorsignupget, creatorsignuppost, creatorloginget, creatorloginpost, creatorlogoutget } = require('../controllers/creatorauthcontrollers');

router.get('/creatorsignup', creatorsignupget);
router.post('/creatorsignup', creatorsignuppost);
router.get('/creatorlogin', creatorloginget);
router.post('/creatorlogin', creatorloginpost);
router.get('/creatorlogout', creatorlogoutget);


const { updateCreatorViews } = require('../controllers/creatorauthcontrollers');

router.get('/creatorviews/:creatorchannelid', updateCreatorViews);

module.exports = router;


module.exports = router;