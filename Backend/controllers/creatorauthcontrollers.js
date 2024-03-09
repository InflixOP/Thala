const Creator = require('../models/Creator');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { creatoremail: '', creatorpassword: '' };

    if (err.message === 'Incorrect email') {
        errors.creatoremail = 'That email is incorrect';
    }

    if (err.message === 'Incorrect Password') {
        errors.creatorpassword = 'That password is incorrect';
    }

    if (err.code === 11000) {
        errors.creatoremail = 'That email is already registered';
        return errors;
    }

    if (err.message.includes('Creator validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'thala', {
        expiresIn: maxAge
    });
};

module.exports.creatorsignupget = (req, res) => {
    res.render('creatorsignup');
};

module.exports.creatorloginget = (req, res) => {
    res.render('creatorlogin');
};

module.exports.creatorsignuppost = async (req, res) => {
    const { creatorname, creatoremail, creatorplatformActive, creatorchannelid, creatorchannelname, creatormetamaskid, creatorpassword } = req.body;
    try {
        const creator = await Creator.create({ creatorname, creatoremail, creatorplatformActive, creatorchannelid, creatorchannelname, creatormetamaskid, creatorpassword });
        const token = createToken(creator._id);
        res.cookie('jwt', token, { httpOnly:true, maxAge: maxAge * 1000 });
        res.status(201).json({ creator: creator._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.creatorloginpost = async (req, res) => {
    const { creatoremail, creatorpassword } = req.body;

    try {
        const creator = await Creator.creatorlogin(creatoremail, creatorpassword);
        const token = createToken(creator._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ creator: creator._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.updateCreatorViews = async (req, res) => {
    const { creatorchannelid } = req.params;
    try {
      // Fetch the creator with the specified creatorchannelid from the database
      const creator = await Creator.findOne({ creatorchannelid });
      if (!creator) {
        // If the creator is not found, return a 404 Not Found response
        return res.status(404).json({ error: 'Creator not found' });
      }
  
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${creatorchannelid}&key=AIzaSyC-jOYXLF0tkK7AwI3Mqa791zIcAvY3pGQ`);
      const views = response.data.items[0].statistics.viewCount;
      // Update the creator's views count in the database
      creator.views = views;
      await creator.save();
      res.status(200).json({ views });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

module.exports.creatorlogoutget = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};