const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { useremail: '', userpassword: '' };

    if (err.message === 'Incorrect email') {
        errors.useremail = 'That email is not registered';
    }

    if (err.message === 'Incorrect Password') {
        errors.userpassword = 'That password is incorrect';
    }

    if (err.code === 11000) {
        errors.useremail = 'That email is already registered';
        return errors;
    }

    if (err.message.includes('User validation failed')) {
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

module.exports.usersignupget = (req, res) => {
    res.render('usersignup');
};

module.exports.userloginget = (req, res) => {
    res.render('userlogin');
};

module.exports.usersignuppost = async (req, res) => {
    const { username, useremail, usernumber, userage, usermetamaskid, userpassword } = req.body;
    try {
        const user = await User.create({ username, useremail, usernumber, userage, usermetamaskid, userpassword });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.userloginpost = async (req, res) => {
    const { useremail, userpassword } = req.body;

    try {
        const user = await User.userlogin(useremail, userpassword);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.userlogoutget = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};
