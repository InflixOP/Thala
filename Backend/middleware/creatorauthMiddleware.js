const jwt = require('jsonwebtoken');
const Creator = require('../models/Creator');

const creatorrequireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'thala', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/creatorlogin');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect('/creatorlogin');
    }
};

const checkCreator = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'thala', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.creator = null;
                next();
            } else {
                console.log(decodedToken);
                try {
                    let creator = await Creator.findById(decodedToken.id);
                    res.locals.creator = creator;
                    next();
                } catch (err) {
                    console.error(err.message);
                    res.locals.creator = null;
                    next();
                }
            }
        });
    } else {
        res.locals.creator = null;
        next();
    }
};

module.exports = { creatorrequireAuth, checkCreator };
