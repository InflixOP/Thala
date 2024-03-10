const Creator = require('../models/Creator');
const jwt = require('jsonwebtoken');

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

const axios = require('axios');

module.exports.creatorsignuppost = async (req, res) => {
    const { creatorname, creatoremail, creatorplatformActive, creatorchannelid, creatorchannelname, creatormetamaskid, creatorpassword } = req.body;
    
    try {
        // Fetch views and subscribers count from the YouTube API
        const { views: todayViews, subscribers } = await fetchChannelData(creatorchannelid);
        const { views: yesterdayViews } = await fetchChannelDataForLastNDays(creatorchannelid, 2);

        const { tokens, pricepertoken } = calculateTokenAllocation(subscribers);
        
        
        let adjustedPricePerToken = pricepertoken;

      
        const percentageChange = ((todayViews - yesterdayViews) / yesterdayViews) * 100;

        
        if (percentageChange > 0) {
            adjustedPricePerToken *= (1 + percentageChange / 100);
        } else if (percentageChange < 0) {
            adjustedPricePerToken *= (1 - Math.abs(percentageChange) / 100);
        }

        
        const creator = await Creator.create({ creatorname, creatoremail, creatorplatformActive, creatorchannelid, creatorchannelname, creatormetamaskid, creatorpassword, todayViews, yesterdayViews, tokens, pricepertoken: adjustedPricePerToken });
        
        
        const token = createToken(creator._id);
        
        // Set cookie and respond with creator ID
        res.cookie('jwt', token, { httpOnly:true, maxAge: maxAge * 1000 });
        res.status(201).json({ creator: creator._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

async function fetchChannelDataForLastNDays(channelId, days) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - days);

    const todayFormatted = formatDate(today);
    const yesterdayFormatted = formatDate(yesterday);

    try {
        const todayResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=AIzaSyC-jOYXLF0tkK7AwI3Mqa791zIcAvY3pGQ&date=${todayFormatted}`);
        const yesterdayResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=AIzaSyC-jOYXLF0tkK7AwI3Mqa791zIcAvY3pGQ&date=${yesterdayFormatted}`);

        const todayViews = todayResponse.data.items[0].statistics.viewCount;
        const yesterdayViews = yesterdayResponse.data.items[0].statistics.viewCount;

        return { todayViews, yesterdayViews };
    } catch (err) {
        throw new Error('Failed to fetch YouTube channel data');
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    return `${year}-${month}-${day}`;
}


function calculateTokenAllocation(subscribers) {
    if (subscribers >= 5000 && subscribers < 10000) {
        return { tokens: 20, pricepertoken: 200 };
    } else if (subscribers >= 10000 && subscribers < 50000) {
        return { tokens: 80, pricepertoken: 400 };
    } else if (subscribers >= 50000 && subscribers < 100000) {
        return { tokens: 200, pricepertoken: 600 };
    } else if (subscribers >= 100000 && subscribers < 300000) {
        return { tokens: 1000, pricepertoken: 1000 };
    } else if (subscribers >= 300000 && subscribers < 500000) {
        return { tokens: 1000, pricepertoken: 1500 };
    } else if (subscribers >= 500000 && subscribers < 1000000) {
        return { tokens: 1500, pricepertoken: 2500 };
    } else if (subscribers >= 1000000 && subscribers < 5000000) {
        return { tokens: 2500, pricepertoken: 4000 };
    } else if (subscribers >= 5000000 && subscribers < 10000000) {
        return { tokens: 6000, pricepertoken: 6000 };
    } else if (subscribers >= 10000000) {
        return { tokens: 10000, pricepertoken: 10000 };
    } else {
        
        return { tokens: 0, pricepertoken: 0 };
    }
}

// Function to fetch channel views from YouTube API
async function fetchChannelData(channelId) {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=AIzaSyC-jOYXLF0tkK7AwI3Mqa791zIcAvY3pGQ`);
        if (!response.data.items || !response.data.items.length) {
            throw new Error('Failed to fetch YouTube channel data');
        }
        const { viewCount, subscriberCount } = response.data.items[0].statistics;
        return { views: viewCount, subscribers: subscriberCount };
    } catch (err) {
        throw new Error('Failed to fetch YouTube channel data');
    }
}


module.exports.creatorloginpost = async (req, res) => {
    const { creatoremail, creatorpassword } = req.body;

    try {
        const creator = await Creator.creatorlogin(creatoremail, creatorpassword);
        if (!creator) {
            throw Error('Creator not found'); // Handle the case where creator is null
        }
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





module.exports.updateTokens = async (req, res) => {
    const { creatorchannelname, quantity } = req.body;

    try {
        
        const creator = await Creator.findOne({ creatorchannelname: creatorchannelname });

        if (!creator) {
            throw Error('Creator not found');
        }

        
        creator.tokens -= quantity;

       
        await creator.save();

        
        res.status(200).json({ message: 'Tokens updated successfully' });
    } catch (err) {
        
        res.status(400).json({ error: err.message });
    }
};
