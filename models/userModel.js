const crypto = require('crypto')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: [true, "please provied a username"]
    },
    email:{
        type: String,
        required: [true, "please provied an email"],
        unique: true,
        match: [ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
                "please provied a valid email" ]
    },
    password: {
        type: String,
        required: [true, "please enter a passeord"],
        minlength: [6, "password must be minimum six character"],
        select: false
    },
    resetpasswordtoken: String,
    resetpasswordexpire: Date

})

userSchema.pre('save', async function(next) {
    // only hash the password if it has been modified (or is new)
    if(!this.isModified("password")) {
        next();
    }

    //generate the salt
    const salt = await bcrypt.genSalt(10);
    //hash the password
    this.password =await bcrypt.hash(this.password, salt)
    next();
})

userSchema.methods.matchPassword = async function (password) {
    //compare password
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.getSignedToken = async function () {
    return await jwt.sign(
        { id: this._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRE,})
}

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this. resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);