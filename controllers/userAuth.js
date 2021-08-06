const crypto = require('crypto');
const User = require('../models/userModel')
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');


//User Register Controller

exports.register = async (req, res, next) => {
    
    const {username, email, password} = req.body;

    try {
        const user = await User.create({
            username, email, password
        });

        sendToken(user, 201, res);
        
    } catch (error) {
        next(error);
    }
}


//Login Controller

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new ErrorResponse("please provied an email and password", 400))
    }

    try {
        const user = await User.findOne({ email }).select("+password")

        if(!user) {
            return next(new ErrorResponse("Invalid Credentials", 401))
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch) {
            res.status(404).json({
                success: false,
                error: "Invalid Credentials"
            })
        }

        sendToken(user, 200, res);

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


//Forgot Password Controller

exports.forgotPassword = async (req, res, next) => {
    const {email} = eq.body;

    try {
        const user = await User.findOne({email});

        if(!user) {
            return next(new ErrorResponse("Email could not be sent", 404))
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();
        const resetUrl = `http://localhost:3000/password-reset/${resetToken}`;

        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please go to the lnk to reset your password </p>
            <a href=${resetUrl} clicktracking= off>${resetUrl} </a>
        `

        try {
            await sendEmail({
                to: user.email,
                subject: " Password reset request",
                text: message
            })
            res.status(200).json({ success: true, data: "Email sent"})
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email could not be send", 500));
        }
    } catch (error) {
        next(error);
    }
}


//Reset Password Controller

exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()}
        })

        if(!user) {
            return next(new ErrorResponse("Invalid ResetToken", 400))
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(201).json({
            success:true,
            data: "Password Reset Success"
        })
    } catch (error) {
        next(error);
    }
}

const sendToken = async (user, statusCode, res) => {
    const token = await user.getSignedToken();
    // console.log(token)
    res.status(statusCode).json({
        success: true,
        token
    })
}