const express = require('express')
const router = express.Router()

const {
    register, 
    login, 
    forgotPassword, 
    resetPassword
} = require('../controllers/userAuth')

// router.route('/register').post(register);
router.post('/register', register);

router.post('/login', login);

router.post('/forgot-password', forgotPassword);

router.put('/reset-password/:resetToken', resetPassword);


module.exports = router;