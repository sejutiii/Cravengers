const express = require('express');
const { verifyUser } = require('../controllers/authController');
const { customerLogin } = require('../controllers/authentication/customerLoginController');
const { customerSignUp } = require('../controllers/authentication/customerSignUpController');
const { restaurantLogin } = require('../controllers/authentication/restaurantLoginController');
const { restaurantSignUp } = require('../controllers/authentication/restaurantSignUpController');
const { riderLogin } = require('../controllers/authentication/riderLoginController');
const { riderSignUp } = require('../controllers/authentication/riderSignUpController');
const router = express.Router();

router.post('/verify', verifyUser);
router.post('/customer/login', customerLogin);
router.post('/customer/signup', customerSignUp);
router.post('/restaurant/login', restaurantLogin);
router.post('/restaurant/signup', restaurantSignUp);
router.post('/rider/login', riderLogin);
router.post('/rider/signup', riderSignUp);

module.exports = router;
