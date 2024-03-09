const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')


const creatorSchema = new mongoose.Schema({
    creatorname: {
        type: String,
        required: [true,'Please enter a name']
    },
    creatoremail:{
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase : true,
        validate : [isEmail, 'Please enter a valid email']
    },
    creatorplatformActive: {
        type: String,
        enum: ['youtube', 'meta'],
        default: 'youtube',
    },
    creatorchannelid:{
        type: String,
        required: [true,'Please enter your handle id'],
        unique: [true, 'This handle is already registered']
    },
    creatorchannelname:{
        type: String,
        required: [true,'Please enter your channel name']
    },
    creatormetamaskid:{
        type: String,
        required: [true, 'Please enter your metamaskid'],
        unique: [true, 'This wallet is already registered']
    },
    creatorpassword: {
        type: String,
        required: true,
        minlength: 8,
    },
});

creatorSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.creatorpassword = await bcrypt.hash(this.creatorpassword, salt);
    next();
});

creatorSchema.post('save', function (doc, next) {
    console.log('New creator was created & saved', doc);
    next();
});

creatorSchema.statics.creatorlogin = async function (creatoremail, creatorpassword) {
    const creator = await this.findOne({ creatoremail });
    if (creator) {
        const auth = await bcrypt.compare(creatorpassword, creator.creatorpassword);
        if (auth) {
            return creator;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect email');
};

const Creator = mongoose.model('Creator', creatorSchema)

module.exports = Creator; 