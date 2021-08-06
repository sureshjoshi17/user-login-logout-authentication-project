const express = require('express');
const { getPrivateData } = require('../controllers/private');
const { protect, verifyToken } = require('../middleware/auth');
const router = express.Router();

router.get("/",   protect,  getPrivateData);

module.exports = router;
