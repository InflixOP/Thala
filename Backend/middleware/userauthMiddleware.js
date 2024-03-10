const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userrequireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'thala', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/userlogin');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/userlogin');
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'thala', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken);
                try {
                    let user = await User.findById(decodedToken.id);
                    res.locals.user = user;
                    next();
                } catch (err) {
                    console.error(err.message);
                    res.locals.user = null;
                    next();
                }
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

const getUsername = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'thala', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.username = null;
                next();
            } else {
                console.log(decodedToken);
                try {
                    let user = await User.findById(decodedToken.id);
                    res.locals.username = user.username;
                    next();
                } catch (err) {
                    console.error(err.message);
                    res.locals.username = null;
                    next();
                }
            }
        });
    } else {
        res.locals.username = null;
        next();
    }
};

module.exports = { userrequireAuth, checkUser, getUsername };
