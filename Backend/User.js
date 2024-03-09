const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a name']
    },
    useremail: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    usernumber: {
        type: Number,
        required: [true, 'Please enter your phone no'],
        unique: [true, 'Phone number is already registered']
    },
    userage: {
        type: Number,
        required: [true, 'Please enter your age']
    },
    usermetamaskid: {
        type: String,
        required: [true, 'Please enter your metamaskid'],
        unique: [true, 'This wallet is already registered']
    },
    userpassword: {
        type: String,
        required: true,
        minlength: 8,
    },
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.userpassword = await bcrypt.hash(this.userpassword, salt);
    next();
});

userSchema.post('save', function (doc, next) {
    console.log('New user was created & saved', doc);
    next();
});

userSchema.statics.userlogin = async function (useremail, userpassword) {
    const user = await this.findOne({ useremail });
    if (user) {
        const auth = await bcrypt.compare(userpassword, user.userpassword);
        if (auth) {
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect email');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
