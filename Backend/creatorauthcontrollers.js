const Creator = require('../models/Creator');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { creatoremail: '', creatorpassword: '' };

    if (err.message === 'Incorrect email') {
        errors.creatoremail = 'That email is not registered';
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

module.exports.creatorlogoutget = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};
