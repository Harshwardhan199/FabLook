const express = require('express');
const router = express.Router();
const { registerUser, verifyUser, userHome } = require('../controllers/userControllers');

router.post('/registerUser', registerUser);
router.post('/verifyUser', verifyUser);

router.post('/userDataDB', userHome);

module.exports = router;
