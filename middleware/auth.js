require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // Bearer 2hjari34rehh7wjkhsa4hj
        token = req.headers.authorization.split(" ")[1]
    }
    // console.log(token)
    
    // console.log(typeof token)

    if(!token) {
        return next(new ErrorResponse("Not!! authorized to access this route", 401));
    }
   
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        console.log(user);
        if(!user) {
            return next(new ErrorResponse("No user found with this Id", 404));
        }

        req.user = user;

        next();
    } catch (error) {
        return next(new ErrorResponse("Not authorised to access this route",401))
    }
}

// exports.verifyToken =  (req, res, next) =>  {
//     //req.headers.authorization
//     let tokenArr = req.headers.authorization ? req.headers.authorization.split(" "): null;
//     console.log(tokenArr)
//     if(!tokenArr){
//         return next(new ErrorResponse("Not!! authorized to access this route", 401));
//     }
    
//     token = tokenArr[0];
//     // console.log(token)
//     const decoded = jwt.verify( token, process.env.JWT_SECRET)
//     // if (err)
//     // {
//     //     // console.log("jwt token varification error is >>>>>>>>>" ,err);
//     //     // res.json({
//     //     //     "code" : 400,
//     //     //     message : 'Invalid user',
//     //     //     data : null
//     //     // });
//     //     return next(new ErrorResponse("jwt token verification error", 401));
//     // }
//     // else if(decoded)
//     // {   
//         const user =  User.findById(decoded.id);
//         // console.log(user);
//         if(!user) {
//             return next(new ErrorResponse("No user found with this Id", 404));
//         }

//         req.user = user;
//         next();
//     }

