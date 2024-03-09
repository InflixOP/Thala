const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')


const creatorSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true,'Please enter a name']
    },
    useremail:{
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase : true,
        validate : [isEmail, 'Please enter a valid email']
    },
    userplatformActive: {
        type: String,
        enum: ['youtube', 'meta'],
        default: 'youtube',
    },
    userchannelid:{
        type: String,
        required: [true,'Please enter your handle id'],
        unique: [true, 'This handle is already registered']
    },
    userchannelname:{
        type: String,
        required: [true,'Please enter your channel name']
    },
    usermetamaskid:{
        type: String,
        required: [true, 'Please enter your metamaskid'],
        unique: [true, 'This wallet is already registered']
    },
    userpassword: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
          validator: function (value) {
            return value === this.confirmPassword;
          },
          message: 'Passwords do not match',
        },
      },
    userconfirmPassword: {
        type: String,
        required: true
    },
});

creatorSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

creatorSchema.post('save', function(doc, next) {
    console.log('new user was created & saved', doc);
    next();
})

creatorSchema.statics.login = async function(email, password){
    const creator = await thisfindOne({email});
    if(creator){
       const auth = await bcrypt.compare(password, creator.password)
       if(auth){
            return creator;
       }
       throw Error('Incorrect Password')
    }
    throw Error('Incorrect email')
}

const Creator = mongoose.model('Creator', creatorSchema)

module.exports = Creator; 