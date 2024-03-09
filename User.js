const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please enter a name']
    },
    email:{
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase : true,
        validate : [isEmail, 'Please enter a valid email']
    },
    phoneno:{
        type: Number,
        required: [true, 'Please enter your phone no'], 
        unique: [true, 'Phone number is already registered']
    },
    age:{
        type: Number,
        required: [true,'Please enter your age']
    },
    metamaskid:{
        type: String,
        required: [true, 'Please enter your metamaskid'],
        unique: [true, 'This wallet is already registered']
    },
    password: {
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
    confirmPassword: {
        type: String,
        required: true
    },
});

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.post('save', function(doc, next) {
    console.log('new user was created & saved', doc);
    next();
})

userSchema.statics.login = async function(email, password){
    const user = await thisfindOne({email});
    if(user){
       const auth = await bcrypt.compare(password, user.password)
       if(auth){
            return user;
       }
       throw Error('Incorrect Password')
    }
    throw Error('Incorrect email')
}

const User = mongoose.model('User', userSchema)

module.exports = User; 